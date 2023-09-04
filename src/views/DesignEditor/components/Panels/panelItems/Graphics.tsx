import React from "react"
import { Scrollbars } from 'react-custom-scrollbars'
import { Block } from "baseui/block"
import { useEffect, useState } from 'react'
import ListLoadingPlaceholder from '~/components/ListLoadingPlaceholder'
import { Text,Box, TapArea, Column, Mask, Image } from "gestalt"
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
// import { Tabs } from 'gestalt'
import Tabs from '~/components/Tabs'

export default function () {
    const editor = useEditor()
    const [fetching, setFetching] = useState(false)
    const [objects, setObjects] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const { setIsShowMobileModal, dimensions, setIsAssetLoading } = useAppContext()

    useEffect(() => {
        getStickers()
    }, [activeIndex])

    const getStickers = () => {
        setObjects([])
        let exts = ['png', 'jpeg', 'jpg', 'svg']

        if(activeIndex == 1) {
          exts = ['png', 'jpeg', 'jpg']
        }

        if(activeIndex == 2) {
          exts = ['svg']
        }

        setFetching(true)
        fetchPacksWithParams({
          extensions: exts,
        })
        .then(res => {
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
          name: item.name,
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
            src: item.secure_url,
          }
        case "svg":
          return {
            type: "StaticVector",
            src: item.secure_url,
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
      const { height } = await getImageDimensions(item.secure_url)

      editor.objects.add(options)
      // editor.objects.add({
      //   type: "StaticImage",
      //   src: "https://res.cloudinary.com/urlan/image/upload/c_thumb,h_300,w_300/v1/elements/pvnmbcpjryyj3lluzw60?_a=ATO2BAA0"
      // })
      

      setIsShowMobileModal(false)
      setIsAssetLoading(false)
    }

    const addObject = (item) => {
      if (editor) {
        addImateToCanvas(item)
      }
    }
    
    return (
        <>
            <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box paddingY={2} mdPaddingX={2} display="flex" justifyContent="center">
                  <Tabs
                    activeTabIndex={activeIndex}
                    onChange={({ activeTabIndex, event }) => {
                      setActiveIndex(activeTabIndex);
                    }}
                    tabs={[
                      { href: 'https://pinterest.com', text: 'Бүгд' },
                      { href: 'https://pinterest.com', text: 'Зураг' },
                      { href: 'https://pinterest.com', text: 'Элемент' }
                    ]}
                  />
                </Box>
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
        <Box padding={3} position='relative' marginBottom={6}>
          <TapArea onTap={() => props.onTapSticker(sticker)}>
            <Mask>
              <TransformImage 
                url={sticker.url}
                // width={200}
                // height={Math.ceil(sticker.height / sticker.width) * 200}
                // width={300}
                // height={Math.ceil(sticker.width / sticker.height) * 300} 
              />
            </Mask>
            <div style={{ position: 'absolute', bottom: -12, display: 'flex', width: '100%', height: '40%' }}>
              <Box display='flex' width='100%'>
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
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