# PDF Chatbot

A modern web application that allows users to upload PDF or text files and chat with their content using Google's Gemini AI model. The application features a beautiful and intuitive user interface with real-time chat capabilities.

## ✨ Features

- 📄 Upload PDF and text files with drag-and-drop interface
- 💬 Real-time chat interface with document content
- 🧠 Powered by Google's Gemini AI model
- 📊 Progress bar for file uploads
- 🎨 Modern and responsive UI
- 🔄 Conversation memory
- 📱 Mobile-friendly design

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- Chakra UI
- Axios
- React Dropzone
- React Icons

### Backend

- FastAPI
- LangChain
- ChromaDB
- Google Gemini
- PyPDF

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- Google API key for Gemini

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd pdf-chatbot
```

2. Set up the frontend:

```bash
cd frontend
npm install
```

3. Set up the backend:

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory with your Google API key:

```
GOOGLE_API_KEY=your_api_key_here
```

## 🏃‍♂️ Running the Application

1. Start the backend server:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

2. In a new terminal, start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 💡 Usage

1. Upload a PDF or text file using the drag-and-drop interface
2. Wait for the file to be processed (you'll see a progress bar)
3. Once the file is processed, you can start chatting with its content
4. Ask questions about the document's content
5. The chatbot will respond based on the information in the document

## 🔧 Configuration

### Environment Variables

- `GOOGLE_API_KEY`: Your Google API key for Gemini

### Customization

You can customize various aspects of the application by modifying:

- Frontend styles in the Chakra UI components
- Backend processing parameters in `main.py`
- Chat model settings in the LangChain configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the AI model
- [LangChain](https://www.langchain.com/) for the document processing framework
- [Chakra UI](https://chakra-ui.com/) for the UI components
