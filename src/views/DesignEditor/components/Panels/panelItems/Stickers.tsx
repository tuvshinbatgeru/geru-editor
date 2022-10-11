import React from "react"
import { useDebounce } from 'use-debounce'
import { Scrollbars } from 'react-custom-scrollbars'
import { Block } from "baseui/block"
import { useEffect, useState } from 'react'
import Scrollable from "~/components/Scrollable"
import { Button,Text,Box, TapArea, Column, Mask, Image, Card ,Flex, Icon} from "gestalt"
import {HeaderText} from "geru-components"
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
    const [value] = useDebounce(search, 1000)


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
            //console.log("item",item)
          if (editor) {
            const options = {
              type: "StaticImage",
              src: item.url,
              width: "50%",
              height: "50%",
              objectFit: "contain",
              pointerEvents: "none",
              verticalAlign: "middle",
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
                                                <HeaderText color='white' align='center'>Loading stickers...</HeaderText>
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


const Pack = (props) => {
    const [is_collapse, setIsCollapse] = useState(true)
    const { item, onTapSticker = () => {} } = props
    const { stickers = [] } = item
  
    return (
      <Box marginBottom={2} paddingY={2}>
        <Box display='flex' justifyContent='between' alignItems='center'>
          <Text weight='bold' color='light'>{item.title}</Text>
          <Box>
            <TapArea onTap={() => setIsCollapse(!is_collapse)}>
              <Box color='light' padding={2}>
                <Text weight='bold' align='center'>{is_collapse ? 'see all' : 'close'}</Text>
              </Box>
            </TapArea>
          </Box>
        </Box>
        <Box display='flex' alignItems='center' wrap>
          {
            stickers.slice(0, is_collapse ? 3 : stickers.length).map(sticker => (
              <Column span={4} key={sticker.url}>
                <Box padding={3} position='relative'>
                  <TapArea onTap={() => onTapSticker(sticker)}>
                    <Card>
                      <Mask>
                        <Image
                            alt={sticker.url}
                            color='transparent'
                            naturalHeight={1}
                            naturalWidth={1}
                            src={sticker.url}
                        />
                      </Mask>
                    </Card>
                    <div style={{ position: 'absolute', bottom: 7, display: 'flex', width: '100%', height: '40%' }}>
                      <Box display='flex' width='100%'>
                        <div style={{ backgroundImage: "linear-gradient(to bottom, rgba(27, 25, 39, 0), rgba(27, 25, 39, 1))", width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
                          <Text color='light' align='center' size='md' weight='bold'>{sticker.price ? `${currencyFormat(sticker.price)}` : 'Free'}</Text>
                        </div>
                      </Box>
                    </div>
                  </TapArea>
                </Box>
              </Column>
            ))
          }
        </Box>
      </Box>
    )
  }