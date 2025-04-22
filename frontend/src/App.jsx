import { ChakraProvider, Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import FileUpload from './components/FileUpload'
import ChatInterface from './components/ChatInterface'
import { useState } from 'react'

function App() {
  const [fileUploaded, setFileUploaded] = useState(false)

  return (
    <ChakraProvider>
      <Box h="90vh" bg="gray.50" display="flex" flexDirection="column">
        <Box 
          bg="white" 
          boxShadow="sm" 
          position="sticky" 
          top={0} 
          zIndex={1}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <Container maxW="container.xl" py={4}>
            <VStack spacing={1}>
              <Heading 
                as="h1" 
                size="xl" 
                bgGradient="linear(to-r, blue.400, blue.600)"
                bgClip="text"
                fontWeight="extrabold"
              >
                PDF Chatbot
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Chat with your documents using AI
              </Text>
            </VStack>
          </Container>
        </Box>
        <Box flex="1" display="flex" flexDirection="column" bg="gray.50">
          <Container maxW="container.xl" flex="1" display="flex" flexDirection="column" py={6}>
            {!fileUploaded ? (
              <FileUpload onUploadSuccess={() => setFileUploaded(true)} />
            ) : (
              <ChatInterface />
            )}
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App 