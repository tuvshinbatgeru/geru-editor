import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Image, Icon, Text, Spinner } from 'gestalt'
import { request, cloudFront } from '~/services/S3'
import { nanoid } from 'nanoid'
import useAppContext from '~/hooks/useAppContext'

const UploadItem = (props) => {
  const { file } = props
  const [uploading, setUploading] = useState(true)
  const [object_url, setObjectUrl] = useState(null)
  const [width, setWidth] = useState(1)
  const [height, setHeight] = useState(1)
  const id = nanoid()
  const { params } = useAppContext()

  useEffect(() => {
    getSize()
  }, [])

  const getSize = () => {
    const object_url = URL.createObjectURL(file)
    setObjectUrl(object_url)
    uploadFile()
  }

  const uploadFile = () => {
    request({ 
      dirName: "geru-by-me/uploads",
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
    }).uploadFile(file, (id + file.name).replace(/\.[^/.]+$/, ""))
    .then(res => {
      props.onUploadDone(file, {
        url: cloudFront(res.location),
      })
    })
    .catch(err => alert(err))
    .then(() => setUploading(false))
  }

  if(!uploading) return null

  return (
    <Box position='relative'>
      <Image 
          alt="uploading"
          src={object_url}
          naturalHeight={height}
          naturalWidth={width}
      />
      {
        uploading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Box display='flex' alignItems='center' justifyContent='center' height="100%"> 
              <Spinner show={true} size="sm" color="subtle" />
            </Box>
          </div>
        )
      }
    </Box>
  )
}

const Upload = (props) => {
    const { acceptedTypes = 'image/png' } = props 
    const [files, setFiles] = useState([])
  
    const onDrop = useCallback(acceptedFiles => {
      // props.onDrop(acceptedFiles)
      setFiles(files => files.concat(acceptedFiles))
    }, [])
  
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
      accept: {
        'image/*': ['.jpeg', '.png']
      },
      onDrop
    });

    const onUploadDone = (file, params) => {
      props.onUploadDone(params)
      setFiles(files.filter((current) => current.path != file.path))
    }
  
    return (
      <Box>
        <Box display='flex' marginBottom={2}>
            <div style={{ width: '100%' }} {...getRootProps({ className: 'dropzone' })}>
                <Box display='flex' height={40} rounding={2} position='relative' color="brand" paddingX={2} paddingY={2} justifyContent='center' alignItems='center'>
                    <Box>
                      <Icon accessibilityLabel='camera' icon='camera-roll' size={20} color="light" />
                    </Box>
                    <Box width={12} />
                    <Box>
                        <Text color="light" weight='bold'>Зураг оруулах</Text>
                        <input {...getInputProps()} />
                    </Box>
              </Box>
          </div>
        </Box>
        <Box display='flex' wrap>
          {
            files.map((file, index) => (
              <Box column={4} key={index} padding={2}>
                <UploadItem file={file} onUploadDone={onUploadDone} />
              </Box>
            ))
          }
        </Box>
      </Box>
    )
  }

  export default Upload