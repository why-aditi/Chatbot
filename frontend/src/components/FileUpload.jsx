import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Button,
  Text,
  VStack,
  useToast,
  Center,
  Icon,
  Progress,
  Flex,
} from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import axios from 'axios'

const FileUpload = ({ onUploadSuccess }) => {
  const toast = useToast()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setIsUploading(true)
      setUploadProgress(0)

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(progress)
        },
      })

      toast({
        title: 'File uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onUploadSuccess()
    } catch (error) {
      toast({
        title: 'Error uploading file',
        description: error.response?.data?.detail || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [toast, onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  return (
    <Center
      {...getRootProps()}
      p={10}
      border="2px dashed"
      borderColor={isDragActive ? 'blue.500' : 'gray.300'}
      borderRadius="lg"
      bg={isDragActive ? 'blue.50' : 'white'}
      cursor={isUploading ? 'not-allowed' : 'pointer'}
      _hover={{ borderColor: isUploading ? 'gray.300' : 'blue.500' }}
      position="relative"
    >
      <input {...getInputProps()} />
      <VStack spacing={4} w="full">
        <Icon as={FiUpload} w={10} h={10} color="blue.500" />
        <Text fontSize="lg">
          {isUploading
            ? 'Uploading file...'
            : isDragActive
            ? 'Drop the file here'
            : 'Drag and drop a PDF or text file here, or click to select'}
        </Text>
        {isUploading && (
          <Flex w="full" direction="column" gap={2}>
            <Progress
              value={uploadProgress}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
            />
            <Text fontSize="sm" color="gray.500">
              {uploadProgress}%
            </Text>
          </Flex>
        )}
        <Button
          colorScheme="blue"
          isLoading={isUploading}
          loadingText="Uploading"
        >
          Select File
        </Button>
      </VStack>
    </Center>
  )
}

export default FileUpload 