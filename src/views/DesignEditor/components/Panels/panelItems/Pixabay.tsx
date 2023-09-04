import React from "react"
import { Scrollbars } from 'react-custom-scrollbars'
import { Block } from "baseui/block"
import { useEffect, useState } from 'react'
import ListLoadingPlaceholder from '~/components/ListLoadingPlaceholder'
import { Text,Box, TapArea, Column, Mask, Image, TextField } from "gestalt"
import { HeaderText, TransformImage } from "geru-components"
import { useMediaQuery } from 'react-responsive'
import { useEditor, useActiveObject } from "@layerhub-io/react"
import { colors } from 'geru-components/dist/utils'
import {fetchPacksWithParams} from "../../../utils/services"
import { currencyFormat, getImageDimensions } from '../../../utils/helper'
import useAppContext from '~/hooks/useAppContext'

import { motion, LayoutGroup } from 'framer-motion'

import axios from 'axios'

export default function () {
    const editor = useEditor()
    const [fetching, setFetching] = useState(false)
    const [objects, setObjects] = useState([])
    const [query, setQuery] = useState("")
    const { setIsShowMobileModal, dimensions, setIsAssetLoading } = useAppContext()

    useEffect(() => {
        getStickers()
    }, [query])

    const getStickers = () => {
        setFetching(true)
        axios.get("https://pixabay.com/api/", {
          params: {
            key: "38559773-0732c38025706649560b23742",
            q: query,
            image_type: "illustration",
            pretty: true
          }
        })
        .then(res => {
            setObjects(res.data.hits)
        })
        .catch(err => console.log(err))
        .then(() => setFetching(false))
    }

    const addImateToCanvas = async (item) => {
      // let adjustScale = 1

      // const recommendedSize = Math.ceil(dimensions.height / 2)
      // const { height } = await getImageDimensions(item.url)

      // adjustScale = recommendedSize / height

      // alert(item.largeImageURL)
      console.log(item.largeImageURL)
      
      setIsAssetLoading(true)
      const options = {
        type: "StaticVector",
        src: item.largeImageURL,
        // width: item.imageWidth,
        // height: item.imageHeight
        // scaleX: adjustScale,
        // scaleY: adjustScale
      }

      editor.objects.add(options)
      setIsShowMobileModal(false)
      setIsAssetLoading(false)
    }

    const addObject = (item) => {
      if (editor) {
        addImateToCanvas(item)
      }
    }
    
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    if(isTabletOrMobile){
        return (
          <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
            <Box height='100%'>
              <Scrollbars>
                <Box paddingX={6} paddingY={4} display='flex' wrap>
                  { fetching && <ListLoadingPlaceholder /> }
                  {objects.map((obj, index) => (
                    <Sticker 
                      key={index}
                      item={obj}
                      onTapSticker={addObject}
                  />
                  ))}
                </Box>
              </Scrollbars>
            </Box>
          </div>
        )
    }
    return (
        <>
            <Block $style={{ flex: 1, display: "flex", flexDirection: "column" , backgroundColor: colors.colorBlack}}>
                <Box padding={4}>
                  <TextField 
                    id="query"
                    value={query}
                    onChange={({ value }) => setQuery(value)}
                  />
                </Box>

                <Scrollbars>
                        <Box paddingX={4} display='flex' wrap>
                          { fetching && <ListLoadingPlaceholder /> }
                           {objects.map((obj, index) => (
                            <Sticker 
                                key={index}
                                item={obj}
                                onTapSticker={addObject}
                             />
                           ))}
                        </Box>
                </Scrollbars>
            </Block>
           
        </>
    )
}

const Sticker = (props) => {
  const { item } = props

  return (
    <Column span={6} key={item.url}>
      <motion.div layout>
        <Box padding={3} position='relative'>
          <TapArea onTap={() => props.onTapSticker(item)}>
              <Mask>
                <Image 
                  src={item.previewURL}
                  alt="But"
                  color="transparent"
                  naturalHeight={item.imageHeight}
                  naturalWidth={item.imageWidth}
                />
              </Mask>
          </TapArea>
        </Box>
      </motion.div>
    </Column>
  )
}