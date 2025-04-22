import { useState, useRef, useEffect } from 'react'
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  useToast,
  Container,
  Avatar,
  IconButton,
} from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import axios from 'axios'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const toast = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', { message: input })
      const botMessage = { role: 'assistant', content: response.data.response }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack spacing={0} h="calc(100vh - 140px)" display="flex" flexDirection="column">
      <Box
        flex={1}
        w="full"
        overflowY="auto"
        p={4}
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
      >
        <Container maxW="container.lg" px={0}>
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
              mb={4}
              gap={2}
            >
              {message.role === 'assistant' && (
                <Avatar
                  size="sm"
                  name="AI Assistant"
                  src="https://avatars.dicebear.com/api/bottts/ai-assistant.svg"
                />
              )}
              <Box
                maxW="70%"
                p={3}
                borderRadius="lg"
                bg={message.role === 'user' ? 'blue.500' : 'gray.100'}
                color={message.role === 'user' ? 'white' : 'black'}
                textAlign="left"
                boxShadow="sm"
              >
                <Text whiteSpace="pre-wrap">{message.content}</Text>
              </Box>
              {message.role === 'user' && (
                <Avatar
                  size="sm"
                  name="You"
                  src="https://avatars.dicebear.com/api/avataaars/user.svg"
                />
              )}
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Container>
      </Box>
      <Flex 
        w="full" 
        gap={2} 
        p={4} 
        bg="white" 
        borderTop="1px" 
        borderColor="gray.200"
        position="sticky"
        bottom={0}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          size="lg"
          borderRadius="full"
          bg="gray.50"
          _focus={{
            bg: 'white',
            boxShadow: '0 0 0 1px #3182ce',
          }}
        />
        <IconButton
          colorScheme="blue"
          aria-label="Send message"
          icon={<FiSend />}
          onClick={handleSendMessage}
          isLoading={isLoading}
          size="lg"
          borderRadius="full"
        />
      </Flex>
    </VStack>
  )
}

export default ChatInterface 