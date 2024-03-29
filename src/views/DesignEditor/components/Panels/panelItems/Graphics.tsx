import React, { useRef, useCallback } from "react"
import { Block } from "baseui/block"
import { useEffect, useState } from 'react'
import Scrollable from "~/components/Scrollable"
import ImageResize from "~/components/ImageResize"
import { Text,Box, TapArea, Column, Mask, TextField, IconButton, Spinner } from "gestalt"
import { TransformImage } from "geru-components"
import { useEditor } from "@layerhub-io/react"
import {fetchPacksWithParams} from "../../../utils/services"
import { currencyFormat, getImageDimensions } from '../../../utils/helper'
import useAppContext from '~/hooks/useAppContext'
import InfiniteScroll from 'react-infinite-scroller'

import { nanoid } from "nanoid"
import { motion } from 'framer-motion'
import { loadFonts } from "~/utils/fonts"
import Tabs from '~/components/Tabs'
import _debounce from 'lodash/debounce'
import Collections from './Collections'

export default function () {
    const editor = useEditor()
    const [fetching, setFetching] = useState(false)
    const [objects, setObjects] = useState([])
    const [groupedObjects, setGroupedObjects] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const { setIsShowMobileModal, dimensions, setIsAssetLoading } = useAppContext()
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const isMountingRef = useRef(false)

    const [grouped_tags, setGroupedTags] = useState([{
      tags: ["цэцэг"]
    }])

    const onQueryChange = useCallback(
      _debounce(query => {
        if(isMountingRef.current) {
          getStickers({
            query,
            page: 1
          })
        }

        isMountingRef.current = true
      }, 400), 
      []
    )

    useEffect(() => {
        getStickers({
          query,
          page,
        })
    }, [page, activeIndex])

    useEffect(() => {
      if(page != 1) setPage(1)
    }, [activeIndex])

    useEffect(() => {
      onQueryChange(query)
    }, [query])

    // const get
    const getStickers = ({ query, page }) => {
        let exts = ['png', 'jpeg', 'jpg', 'svg']

        if(activeIndex == 1) {
          exts = ['png', 'jpeg', 'jpg']
        }

        if(activeIndex == 2) {
          exts = ['svg']
        }

        // alert(JSON.stringify(query))
        // console.log(query)
        if(page == 1) {
          setObjects([])
        }

        setFetching(true)
        fetchPacksWithParams({
          extensions: exts,
          q: query,
          tags: query ? query.split(",") : "",
          page,
          limit: 40
        })
        .then(res => {
            if(res.data.code == 0) {
                if(page == 1) {
                  setObjects(res.data.result.docs)
                  window.scrollTo(0, 0);
                } else setObjects(objects.concat(res.data.result.docs))
              
                setPages(res.data.result.pages)
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

    const onLoadMore = () => {
      let nextPage = page + 1
      if(fetching || pages < nextPage) return
      setFetching(true)
      setPage(nextPage)
    }

    const addImateToCanvas = async (item) => {
      setIsAssetLoading(true)

      let adjustScale = 1

      const recommendedSize = Math.ceil(dimensions.width / 2)

      let options = await _getType(item)
      await getImageDimensions(item.secure_url)
      const { width } = item
      adjustScale = recommendedSize / width


      editor.objects.add(Object.assign(options, {
        scaleX: adjustScale,
        scaleY: adjustScale
      }))

      setIsShowMobileModal(false)
      setIsAssetLoading(false)
    }

    const addObject = (item) => {
      if (editor) {
        addImateToCanvas(item)
      }
    }

    const onCollectionTap = (collection) => {
      setQuery(String(collection.tags))
    }
    
    return (
        <>
            <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box paddingX={2} mdPaddingX={2} display="flex" justifyContent="between" alignItems="center" marginTop={2} paddingY={2}>
                  <Box flex='grow'>
                    <TextField
                      id="query"
                      placeholder="Хайх"
                      value={query}
                      onChange={({ value }) => setQuery(value)}
                    />
                  </Box>
                  {
                    query.trim() && (
                      <IconButton
                        icon="cancel"
                        accessibilityLabel="cancel"
                        size='sm'
                        iconColor="white"
                        onClick={() => setQuery("")}
                        // colo
                      />
                    )
                  }
                </Box>
                {/* <Box paddingY={2} mdPaddingX={2} display="flex" justifyContent="center">
                  <Tabs
                    activeTabIndex={activeIndex}
                    onChange={({ activeTabIndex, event }) => {
                      setActiveIndex(activeTabIndex);
                    }}
                    tabs={[
                      { href: 'https://pinterest.com', text: 'Бүгд' },
                      { href: 'https://pinterest.com', text: 'Артворк' },
                      { href: 'https://pinterest.com', text: 'Элемент' }
                    ]}
                  />
                </Box> */}
                <Scrollable>
                  
                  <InfiniteScroll
                    // loader={getLoaderElement()}
                    loadMore={onLoadMore}
                    hasMore={true}
                    threshold={1000}
                    useWindow={false}
                  >
                      {
                        !query && <Collections onCollectionTap={onCollectionTap} />
                      }
                      
                      <Box paddingX={2} marginTop={4} mdMarginTop={6}>
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
                  </InfiniteScroll>
                  <Spinner show={fetching} accessibilityLabel="Loading" />
                </Scrollable>
            </Block>
           
        </>
    )
}

const Sticker = (props) => {
  const { sticker } = props

  const is_cloudinary = sticker.url.includes("cloudinary")

  return (
    <Column span={4} key={sticker.url}>
      <motion.div layout>
        <Box padding={1} position='relative' marginBottom={6}>
          <TapArea onTap={() => props.onTapSticker(sticker)}>
            <Mask>
              {
                is_cloudinary ? (
                  <TransformImage 
                    url={sticker.url}
                  />
                ) : <ImageResize url={sticker.url} width={sticker.width} height={sticker.height} />
              }
            </Mask>
            {/* <Box display="flex" wrap>
              {
                sticker.tags.map((tag,) => (
                  <Text key={tag} color='light'>{tag}</Text>
                ))
              }
            </Box> */}
            <div style={{ position: 'absolute', bottom: -18, display: 'flex', width: '100%', height: '40%' }}>
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