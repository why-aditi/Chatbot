from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Check if API key is set
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

# Configure the Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
try:
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = None
    qa_chain = None
except Exception as e:
    raise RuntimeError(f"Failed to initialize embeddings: {str(e)}")

class ChatRequest(BaseModel):
    message: str

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    global vector_store, qa_chain
    
    if not file.filename.endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="File must be PDF or TXT")
    
    try:
        content = await file.read()
        
        # Save file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(content)
        
        try:
            # Process file based on type
            if file.filename.endswith('.pdf'):
                loader = PyPDFLoader(temp_path)
            else:
                loader = TextLoader(temp_path)
            
            documents = loader.load()
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.split_documents(documents)
            
            # Create vector store
            vector_store = Chroma.from_documents(chunks, embeddings)
            
            # Initialize chat model with system message conversion
            chat = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                convert_system_message_to_human=True
            )
            
            # Create memory
            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
            
            # Create QA chain
            qa_chain = ConversationalRetrievalChain.from_llm(
                llm=chat,
                retriever=vector_store.as_retriever(),
                memory=memory
            )
            
            return {"message": "File processed successfully"}
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing file: {str(e)}"
            )
        finally:
            # Clean up
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error handling file upload: {str(e)}"
        )

@app.post("/api/chat")
async def chat(request: ChatRequest):
    global qa_chain
    
    if not qa_chain:
        raise HTTPException(status_code=400, detail="No document loaded")
    
    try:
        response = qa_chain({"question": request.message})
        return {"response": response["answer"]}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 