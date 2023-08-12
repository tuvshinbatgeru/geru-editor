import React from "react"
import { Scrollbars } from 'react-custom-scrollbars'
import { Block } from "baseui/block"
import { useEffect, useState } from 'react'
import ListLoadingPlaceholder from '~/components/ListLoadingPlaceholder'
import { Text,Box, TapArea, Column, Mask, Card, Image } from "gestalt"
import { HeaderText, TransformImage } from "geru-components"
import { useMediaQuery } from 'react-responsive'
import { useEditor, useActiveObject } from "@layerhub-io/react"
import { colors } from 'geru-components/dist/utils'
import {fetchPacksWithParams} from "../../../utils/services"
import { currencyFormat, getImageDimensions } from '../../../utils/helper'
import useAppContext from '~/hooks/useAppContext'

import { FontItem } from "~/interfaces/common"
import { nanoid } from "nanoid"
import { motion, LayoutGroup } from 'framer-motion'
import { loadFonts } from "~/utils/fonts"

export default function () {
    const editor = useEditor()
    const [fetching, setFetching] = useState(false)
    const [objects, setObjects] = useState([])
    const { setIsShowMobileModal, dimensions, setIsAssetLoading } = useAppContext()

    useEffect(() => {
        getStickers()
    }, [])

    const getStickers = () => {
        setFetching(true)
        fetchPacksWithParams({
          pack_type: 'graphics',
        })
        .then(res => {
            // console.log(res.data)
            if(res.data.code == 0) {
                setObjects(res.data.elements)
            }
        })
        .catch(err => console.log(err))
        .then(() => setFetching(false))
    }

    const _getType = async (item) => {
      if(item.extension == "otf" ||
        item.extension == "ttf" ||
        item.extension == "woff" ||
        item.extension == "woff2"
      ) {
        const new_font = {
          name: "Oswald",
          url: item.secure_url,
        }
  
        await loadFonts([new_font])

        return {
          id: nanoid(),
          type: "StaticText",
          width: 420,
          text: "TYPE TEXT",
          fontSize: 92,
          fontFamily: "Oswald",
          textAlign: "center",
          fontStyle: "normal",
          fontURL: item.secure_url,
          fill: "#fff",
          metadata: {},
        }
      }

      switch(item.extension) {
        case "png":
        case "jpeg":
        case "jpg":
          return {
            type: "StaticImage",
            src: item.url,
          }
        case "svg":
          return {
            type: "StaticVector",
            src: item.url,
          }
        default:
          return {
            type: "StaticVector"
          }
      }
    }

    const addImateToCanvas = async (item) => {
      setIsAssetLoading(true)
      
      let options = await _getType(item)
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
                <Box paddingX={6} paddingY={4}>
                  { fetching && <ListLoadingPlaceholder /> }
                  <Box display="flex" wrap>
                    {objects.map((obj, index) => (
                      <Sticker
                        sticker={obj}
                        key={index}
                        onTapSticker={addObject}
                      />
                    ))}
                  </Box>
                </Box>
              </Scrollbars>
            </Box>
          </div>
        )
    }
    return (
        <>
            <Block $style={{ flex: 1, display: "flex", flexDirection: "column" , backgroundColor: colors.colorBlack}}>
                <Scrollbars>
                        <Box paddingX={4}>
                          { fetching && <ListLoadingPlaceholder /> }
                          <Box display="flex" wrap>
                           {objects.map((obj, index) => (
                            <Sticker
                              sticker={obj}
                              key={index}
                              onTapSticker={addObject}
                            />
                           ))}
                           </Box>
                        </Box>
                </Scrollbars>
            </Block>
           
        </>
    )
}

const Sticker = (props) => {
  const { sticker } = props

  return (
    <Column span={4} key={sticker.url}>
      <motion.div layout>
        <Box padding={3} position='relative'>
          <TapArea onTap={() => props.onTapSticker(sticker)}>
            <Card>
              <Mask>
                <Image
                    src={sticker.url}
                    naturalHeight={sticker.height}
                    naturalWidth={sticker.width}
                    alt="sticker"
                    color="transparent"
                />
                {/* <TransformImage 
                  url={sticker.url} 
                /> */}
              </Mask>
            </Card>
            <div style={{ position: 'absolute', bottom: 7, display: 'flex', width: '100%', height: '40%' }}>
              <Box display='flex' width='100%'>
                <div style={{ backgroundImage: "linear-gradient(to bottom, rgba(27, 25, 39, 0), rgba(27, 25, 39, 1))", width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
                  <Text color='light' align='center' size="200" weight='bold'>{sticker.price ? `${currencyFormat(sticker.price)}` : 'Free'}</Text>
                </div>
              </Box>
            </div>
          </TapArea>
        </Box>
      </motion.div>
    </Column>
  )
}