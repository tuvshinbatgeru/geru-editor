import React from "react"
import { Scrollbars } from 'react-custom-scrollbars'
import { Block } from "baseui/block"
import { useEffect, useState } from 'react'
import Scrollable from "~/components/Scrollable"
import { Button,Text,Box, TapArea, Column, Mask, Image, Card ,Flex, Icon} from "gestalt"
import { HeaderText, TransformImage } from "geru-components"
import { useMediaQuery } from 'react-responsive'
import { useContextMenuRequest, useEditor } from "@layerhub-io/react"
import { colors } from 'geru-components/dist/utils'
import useAppContext from "~/hooks/useAppContext"
import {fetchPacks} from "../../../utils/services"
import { currencyFormat } from '../../../utils/helper'

export default function () {
    const editor = useEditor()
    const { setActiveSubMenu, setIsMobile, isMobile } = useAppContext()
    const [search, setSearch] = useState('')

    const [fetching, setFetching] = useState(false)
    const [objects, setObjects] = useState([])

    useEffect(() => {
        getStickers()
    }, [])

    const getStickers = () => {
        setFetching(true)
        fetchPacks()
        .then(res => {
            if(res.data.code == 0) {
                setObjects(res.data.packs)
            }
        })
        .catch(err => console.log(err))
        .then(() => setFetching(false))
    }
    const addObject = React.useCallback(
        (item) => {
          if (editor) {
            const options = {
              type: "StaticImage",
              src: item.url
            }

            editor.objects.add(options)
          }
        },
        [editor]
    )
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    if(isTabletOrMobile){
        return (
          <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <Box height='100%'>
              <Scrollbars>
                <Box paddingX={6} paddingY={4}>
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
                            {
                                fetching && (
                                    <>
                                        <Box paddingX={4}>
                                            <Flex gap={12} direction='column'>
                                                <Box>
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                    <Box color='dark' height={50} marginBottom={2} />
                                                </Box>
                                            </Flex>
                                        </Box>
                                    </>
                            )
                           }
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
          <HeaderText color='white' size="2lg">{item.title}</HeaderText>
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
        <Box display='flex' alignItems='center' wrap>
          {
            stickers.slice(0, is_collapse ? 3 : stickers.length).map(sticker => (
              <Sticker
                sticker={sticker}
                key={sticker._id}
                onTapSticker={onTapSticker}
              />
            ))
          }
        </Box>
      </Box>
    )
  }