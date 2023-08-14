import React from "react"
import { Scrollbars } from 'react-custom-scrollbars'
import { Block } from "baseui/block"
import { useEffect, useState } from 'react'
import ListLoadingPlaceholder from '~/components/ListLoadingPlaceholder'
import { Text,Box, TapArea, Column, Mask, Card } from "gestalt"
import { HeaderText, TransformImage } from "geru-components"
import { useMediaQuery } from 'react-responsive'
import { useEditor, useActiveObject } from "@layerhub-io/react"
import { colors } from 'geru-components/dist/utils'
import {fetchPacks} from "../../../utils/services"
import { currencyFormat, getImageDimensions } from '../../../utils/helper'
import useAppContext from '~/hooks/useAppContext'

import { motion, LayoutGroup } from 'framer-motion'

export default function () {
    const editor = useEditor()
    const [fetching, setFetching] = useState(false)
    const [objects, setObjects] = useState([])
    const { setIsShowMobileModal, dimensions, setIsAssetLoading, stickerParams } = useAppContext()
    const activeObject = useActiveObject()

    useEffect(() => {
        getStickers()
    }, [stickerParams])

    const getStickers = () => {
        setFetching(true)
        fetchPacks({})
        .then(res => {
            if(res.data.code == 0) {
                setObjects(res.data.packs)
            }
        })
        .catch(err => console.log(err))
        .then(() => setFetching(false))
    }

    const addImateToCanvas = async (item) => {
      setIsAssetLoading(true)
      let adjustScale = 1

      const recommendedSize = Math.ceil(dimensions.height / 2)
      const { height } = await getImageDimensions(item.url)

      adjustScale = recommendedSize / height
      
      const options = {
        type: "StaticImage",
        src: item.url,
        scaleX: adjustScale,
        scaleY: adjustScale
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
                <Box paddingX={6} paddingY={4}>
                  { fetching && <ListLoadingPlaceholder /> }
                  {objects.map((obj, index) => (
                    <Pack 
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
                <Scrollbars>
                        <Box paddingX={4}>
                          { fetching && <ListLoadingPlaceholder /> }
                           {objects.map((obj, index) => (
                            <Pack 
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
  const { sticker } = props

  return (
    <Column span={4} key={sticker.url}>
      <motion.div layout>
        <Box padding={3} position='relative'>
          <TapArea onTap={() => props.onTapSticker(sticker)}>
            <Card>
              <Mask>
                <TransformImage 
                  url={sticker.url} 
                />
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

const Pack = (props) => {
    const [is_collapse, setIsCollapse] = useState(true)
    const { item, onTapSticker = () => {} } = props
    const { stickers = [] } = item
  
    return (
      <Box marginBottom={2} paddingY={2}>
        <Box display='flex' justifyContent='between' alignItems='center'>
          <Text color='light' weight="bold">{item.title}</Text>
          {
            stickers.length > 3 && (
              <Box>
                <TapArea onTap={() => setIsCollapse(!is_collapse)}>
                  <Box padding={2}>
                    <Text underline weight='bold' align='center' color='light'>{is_collapse ? 'see all' : 'close'}</Text>
                  </Box>
                </TapArea>
              </Box>
            )
          }
        </Box>
        <LayoutGroup>
          <Box display='flex' alignItems='center' wrap>
            {
              stickers.slice(0, 3).map(sticker => (
                  <Sticker
                    sticker={sticker}
                    key={sticker._id}
                    onTapSticker={onTapSticker}
                  />
              ))
            }
            {
              !is_collapse && stickers.slice(3, stickers.length).map(sticker => (
                  <Sticker
                    sticker={sticker}
                    key={sticker._id}
                    onTapSticker={onTapSticker}
                  />
              ))
            }
          </Box>
        </LayoutGroup>
      </Box>
    )
  }