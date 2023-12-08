import React, { useState, useEffect } from "react"
import { Block } from "baseui/block"
import Upload from "~/components/Upload"
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
import { Box, TapArea, Spinner ,Text,FixedZIndex, Image as GesaltImage } from 'gestalt'
import { TransformImage ,HeaderText} from 'geru-components'
import { fetchUserUploads, fileUpload } from "~/views/DesignEditor/utils/services"

import { getImageDimensions } from '../../../utils/helper'

// import 

//https://d110hwq6svvzha.cloudfront.net
//arn:aws:cloudfront::967296680226:distribution/E3MNSUI573QJA

const Image = (props) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const { photo, addImageToCanvas = () => {} } = props


  return (
    <Box 
      column={isTabletOrMobile ? 4 : 6}
      padding={2}
      
    >
      <TapArea onTap={() => addImageToCanvas(photo)}>
        <GesaltImage
            src={photo.url}
            naturalWidth={photo.width}
            naturalHeight={photo.height}
        />
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
  const { backgroundRemove , setBackgroundRemove, setIsAssetLoading } = useAppContext()
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
    setIsAssetLoading(true)
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
    setIsAssetLoading(false)
  }

  const onUploadDone = async ({ url }) => {
    const { height, width } = await getImageDimensions(url)

    setUploads(uploads => [{
      user: "test",
      url,
      public_id: url,
      height: height,
      width: width
    }, ...uploads])
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
      <Box paddingX={4} paddingY={4}>
        <Upload
					onUploadDone={onUploadDone}
					acceptedTypes='image/jpeg, image/png'
					// hasPullsar={photos.length == 0}
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
      <Box height='100%' paddingX={2}>
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
}
