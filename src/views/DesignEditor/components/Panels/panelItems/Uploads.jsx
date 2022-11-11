import React, { useState, useEffect } from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import useAppContext from "~/hooks/useAppContext"

import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { Scrollbars } from 'react-custom-scrollbars'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
import InfiniteScroll from 'react-infinite-scroller'
import Cookies from 'js-cookie'
import Masonry from 'react-masonry-component'
import { useEditor } from "@layerhub-io/react"
import { nanoid } from "nanoid"
import { useMediaQuery } from 'react-responsive'
import { Box, Card, TapArea, Spinner ,Text,FixedZIndex} from 'gestalt'
import { TransformImage ,HeaderText} from 'geru-components'
import { fetchUserUploads, fileUpload } from "~/views/DesignEditor/utils/services"

import { getImageDimensions } from '../../../utils/helper'

const Image = (props) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const { photo, addImageToCanvas = () => {} } = props


  return (
    <Box 
      column={isTabletOrMobile ? 4 : 6}
      padding={2}
      
    >
      <TapArea onTap={() => addImageToCanvas(photo)}>
        <Card >
          <TransformImage
              url={photo.url}
              width={200}
              height={Math.ceil(photo.height / photo.width) * 200}
          />
        </Card>
        <div style={{ position: 'absolute', bottom: 7, display: 'flex', width: '100%', height: '40%' }}>
        <Box display='flex' width='100%'>
            <div style={{ 
                backgroundImage: "linear-gradient(to bottom, rgba(27, 25, 39, 0), rgba(27, 25, 39, 1))", 
                width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end' }} /> 
          </Box>
        </div>
      </TapArea>
    </Box>
  )
}

export default function () {
  const { backgroundRemove , setBackgroundRemove} = useAppContext()
  const [uploads, setUploads] = React.useState([])
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { setIsShowMobileModal, dimensions } = useAppContext()

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [fetching, setFetching] = useState(false)
  
  const user_id = Cookies.get('user_id') ? Cookies.get('user_id') : ""
  const is_logged_in = Cookies.get('token') ? true : false

  React.useEffect(() => {
    getPhotos()
  }, [page])

  React.useEffect(() => {
    if(page == 1) {
      getPhotos()
    } else {
      setPage(1)
    }
  }, [user_id,backgroundRemove])

  const getPhotos = () => {
    if(!user_id) return

    setFetching(true)
    fetchUserUploads(user_id, {
      page
    })
    .then(res => {
      if(res.data.code == 0) {
        const { pages, docs } = res.data.result

        if(page == 1) setUploads(docs) 
        else setUploads(uploads.concat(docs))
        
        setPages(pages)
      }
    })
    .then(() => {
      setFetching(false)
      // props.setUpdateBackgroundRemoveUrl(false)
    })
  }

  const onLoadMore = () => {
    let nextPage = page + 1
    if(fetching || pages < nextPage) return
    setFetching(true)
    setPage(nextPage)
  }

  const handleDropFiles = (files) => {
    const file = files[0]
    const url = URL.createObjectURL(file)
    const upload = {
      id: nanoid(),
      url,
    }
    setUploads([...uploads, upload])
  }

  const addImageToCanvas = async (url) => {
    let adjustScale = 1

    const recommendedSize = Math.ceil(dimensions.height / 2)
    const { height } = await getImageDimensions(url)

    adjustScale = recommendedSize / height
    
    const options = {
      type: "StaticImage",
      src: url,
      scaleX: adjustScale,
      scaleY: adjustScale
    }

    editor.objects.add(options)
    setIsShowMobileModal(false)
  }

  const successCallBack = (res) => {
    const { event, info } = res

    if(event == "success") {
      setUploads(uploads => [{
        user: "test",
        url: info.url,
        public_id: info.public_id,
        height: info.height,
        width: info.width
      }, ...uploads])

      if(is_logged_in) fileUpload(user_id, info)
    }
  }

  const failureCallBack = () => {

  }
  const zIndex = new FixedZIndex(2)
  return (
    <Box display="flex"  height="100%" direction="column" width="100%">
      <WidgetLoader />
      <Box paddingX={4} paddingY={4}>
        <Widget
          //sources={['local', 'dropbox', 'facebook']} // set the sources available for uploading -> by default
          sources={['local']}
          // all sources are available. More information on their use can be found at 
          // https://cloudinary.com/documentation/upload_widget#the_sources_parameter
          sourceKeys={{
            dropboxAppKey: '1dsf42dl1i2', 
            instagramClientId: 'd7aadf962m',
            facebookAppId: "470771220120261"
          }} // add source keys 
          // and ID's as an object. More information on their use can be found at 
          // https://cloudinary.com/documentation/upload_widget#the_sources_parameter
          resourceType={'image'} // optionally set with 'auto', 'image', 'video' or 'raw' -> default = 'auto'
          cloudName='urlan' // your cloudinary account cloud name. 
          // Located on https://cloudinary.com/console/
          uploadPreset={'tyt2eb9j'} // check that an upload preset exists and check mode is signed or unisgned
          //buttonText={'Зураг оруулах'} // default 'Upload Files'
          buttonText={"Upload Files"}
          style={{
            border: 'none',
            fontSize: 16,
            fontFamily: "GeruBebas",
            color: "#fff",
            width: '100%',
            backgroundColor: '#CD1E3B',
            borderRadius: '0px',
            height: '40px'
          }} // inline styling only or style id='cloudinary_upload_button'
          folder={'geru-by-me'} // set cloudinary folder name to send file
          cropping={false} // set ability to crop images -> default = true
          // https://support.cloudinary.com/hc/en-us/articles/203062071-How-to-crop-images-via-the-Upload-Widget-#:~:text=Click%20on%20the%20%22Edit%22%20link,OK%22%20and%20Save%20the%20changes.
          // more information here on cropping. Coordinates are returned or upload preset needs changing
          multiple={true} // set to false as default. Allows multiple file uploading
          // will only allow 1 file to be uploaded if cropping set to true
          autoClose={true} // will close the widget after success. Default true 
          onSuccess={successCallBack} // add success callback -> returns result
          onFailure={failureCallBack} // add failure callback -> returns 'response.error' + 'response.result'
          logging={false} // logs will be provided for success and failure messages, 
          // set to false for production -> default = true
          //customPublicId={'sample'} // set a specific custom public_id. 
          // To use the file name as the public_id use 'use_filename={true}' parameter
          //eager={'w_400,h_300,c_pad|w_260,h_200,c_crop'} // add eager transformations -> deafult = null
          use_filename={false} // tell Cloudinary to use the original name of the uploaded 
          // file as its public ID -> default = true,
          widgetStyles={{
            palette: {
              window: '#272428',
              windowBorder: '#fff',
              tabIcon: '#FD3533',
              menuIcons: '#D7D7D8',
              textDark: '#DEDEDE',
              textLight: '#FFFFFF',
              link: '#00CDA5',
              action: '#FD3533',
              inactiveTabIcon: '#BDBDBD',
              error: '#FD3533',
              inProgress: '#00CDA5',
              complete: '#00CDA5',
              sourceBg: '#272428'
            },
            fonts: {
              default: null,
              "'GeruBebas', sans-serif": {
                url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
                active: true
              }
            }
          }} // ability to customise the style of the widget uploader
          destroy={true} // will destroy the widget on completion
          // 👇 FOR SIGNED UPLOADS ONLY 👇
          //generateSignatureUrl={'http://my_domain.com/api/v1/media/generate_signature'} // pass the api 
          // endpoint for generating a signature -> check cloudinary docs and SDK's for signing uploads
          apiKey={359513655322777} // cloudinary API key -> number format
          //accepts={'application/json'} // for signed uploads only -> default = 'application/json'
          //contentType={'application/json'} // for signed uploads only -> default = 'application/json'
          withCredentials={true} // default = true -> check axios documentation for more information
          unique_filename={true} // setting it to false, you can tell Cloudinary not to attempt to make 
          // the Public ID unique, and just use the normalized file name -> default = true
        />
      </Box>
      {
        backgroundRemove && (
            <Box 
                position="absolute" 
                left top height="100%" width="100%"
                zIndex={zIndex}
                display='flex'
                alignItems="center"
                direction='column'
                justifyContent="center"
                dangerouslySetInlineStyle={{
                    __style: {
                        backgroundColor:'rgba(0,0,30,0.4)',
                        backdropFilter: 'blur(10px)',
                        opacity: 1
                    }
                }}
                >
                <HeaderText color='white'>
                    Syncing new images ...
                </HeaderText>
                <Box height={12} />
                <Box color='white' rounding='circle' padding={1}> 
                    <Spinner accessibilityLabel='loading' show={true} />
                </Box>
            </Box>
        )
      }
      <Box height='100%' paddingX={2} >
        <Scrollbars>
            
            <InfiniteScroll
                // loader={getLoaderElement()}
                loadMore={onLoadMore}
                hasMore={true}
                threshold={1000}
                useWindow={false}
            >
                <Masonry
                  // key={1}
                  // className={'my-gallery-class'} // default ''
                  disableImagesLoaded={true} // default false
                  updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
                >
                  {
                    uploads.map((upload, index) => (
                        <Image 
                          photo={upload}
                          key={index}
                          addImageToCanvas={() => addImageToCanvas(upload.url)}
                        />
                    ))
                  }
                </Masonry>
               
                
            </InfiniteScroll>
            <Spinner show={fetching} accessibilityLabel="Loading" />
        </Scrollbars>
      </Box>
    </Box>
)




  return (
      <Box height="100%" width="100%" display="flex" direction="column" color='dark'>
          <WidgetLoader />
          <Box paddingX={2} paddingY={3}>
            <Widget
              //sources={['local', 'dropbox', 'facebook']} // set the sources available for uploading -> by default
              sources={['local']}
              // all sources are available. More information on their use can be found at 
              // https://cloudinary.com/documentation/upload_widget#the_sources_parameter
              sourceKeys={{
                dropboxAppKey: '1dsf42dl1i2', 
                instagramClientId: 'd7aadf962m',
                facebookAppId: "470771220120261"
              }} // add source keys 
              // and ID's as an object. More information on their use can be found at 
              // https://cloudinary.com/documentation/upload_widget#the_sources_parameter
              resourceType={'image'} // optionally set with 'auto', 'image', 'video' or 'raw' -> default = 'auto'
              cloudName='urlan' // your cloudinary account cloud name. 
              // Located on https://cloudinary.com/console/
              uploadPreset={'tyt2eb9j'} // check that an upload preset exists and check mode is signed or unisgned
              //buttonText={'Зураг оруулах'} // default 'Upload Files'
              buttonText={"Upload Files"}
              style={{
                border: 'none',
                fontSize: 16,
                fontFamily: "GeruBebas",
                color: "#fff",
                width: '100%',
                backgroundColor: '#CD1E3B',
                borderRadius: '0px',
                height: '40px'
              }} // inline styling only or style id='cloudinary_upload_button'
              folder={'geru-by-me'} // set cloudinary folder name to send file
              cropping={false} // set ability to crop images -> default = true
              // https://support.cloudinary.com/hc/en-us/articles/203062071-How-to-crop-images-via-the-Upload-Widget-#:~:text=Click%20on%20the%20%22Edit%22%20link,OK%22%20and%20Save%20the%20changes.
              // more information here on cropping. Coordinates are returned or upload preset needs changing
              multiple={true} // set to false as default. Allows multiple file uploading
              // will only allow 1 file to be uploaded if cropping set to true
              autoClose={true} // will close the widget after success. Default true 
              onSuccess={successCallBack} // add success callback -> returns result
              onFailure={failureCallBack} // add failure callback -> returns 'response.error' + 'response.result'
              logging={false} // logs will be provided for success and failure messages, 
              // set to false for production -> default = true
              //customPublicId={'sample'} // set a specific custom public_id. 
              // To use the file name as the public_id use 'use_filename={true}' parameter
              //eager={'w_400,h_300,c_pad|w_260,h_200,c_crop'} // add eager transformations -> deafult = null
              use_filename={false} // tell Cloudinary to use the original name of the uploaded 
              // file as its public ID -> default = true,
              widgetStyles={{
                palette: {
                  window: '#272428',
                  windowBorder: '#fff',
                  tabIcon: '#FD3533',
                  menuIcons: '#D7D7D8',
                  textDark: '#DEDEDE',
                  textLight: '#FFFFFF',
                  link: '#00CDA5',
                  action: '#FD3533',
                  inactiveTabIcon: '#BDBDBD',
                  error: '#FD3533',
                  inProgress: '#00CDA5',
                  complete: '#00CDA5',
                  sourceBg: '#272428'
                },
                fonts: {
                  default: null,
                  "'GeruBebas', sans-serif": {
                    url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
                    active: true
                  }
                }
              }} // ability to customise the style of the widget uploader
              destroy={true} // will destroy the widget on completion
              // 👇 FOR SIGNED UPLOADS ONLY 👇
              //generateSignatureUrl={'http://my_domain.com/api/v1/media/generate_signature'} // pass the api 
              // endpoint for generating a signature -> check cloudinary docs and SDK's for signing uploads
              apiKey={359513655322777} // cloudinary API key -> number format
              //accepts={'application/json'} // for signed uploads only -> default = 'application/json'
              //contentType={'application/json'} // for signed uploads only -> default = 'application/json'
              withCredentials={true} // default = true -> check axios documentation for more information
              unique_filename={true} // setting it to false, you can tell Cloudinary not to attempt to make 
              // the Public ID unique, and just use the normalized file name -> default = true
            />
          </Box>
        <Scrollable>
          <Box paddingX={2}>
          {
            fetching && (
                <Box position="absolute" left top height="100%" width="100%"
                    zIndex={zIndex}
                    display='flex'
                    alignItems="center"
                    direction='column'
                    justifyContent="center"
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor:'rgba(0,0,30,0.4)',
                            backdropFilter: 'blur(10px)',
                            opacity: 1
                        }
                    }}
                >
                <HeaderText color='white'>
                    Syncing new images ...
                </HeaderText>
                <Box height={12} />
                <Box color='white' rounding='circle' padding={1}> 
                    <Spinner accessibilityLabel='loading' show={true} />
                </Box>
            </Box>)
          }
            <InfiniteScroll
                // loader={getLoaderElement()}
                loadMore={onLoadMore}
                hasMore={true}
                threshold={1000}
                useWindow={false}
            >
                <Masonry
                  // key={1}
                  // className={'my-gallery-class'} // default ''
                  disableImagesLoaded={true} // default false
                  updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
                >
                  {
                    uploads.map((upload, index) => (
                        <Image 
                          photo={upload}
                          key={index}
                          addImageToCanvas={() => addImageToCanvas(upload.url)}
                        />
                    ))
                  }
                </Masonry>
               
                
            </InfiniteScroll>

            {
                fetching && <Box><Spinner show={true} /></Box>
            }
          </Box>
        </Scrollable>
      </Box>
  )
}
