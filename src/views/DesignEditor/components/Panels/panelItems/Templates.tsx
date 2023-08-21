import React, { useState, useEffect } from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { loadFonts } from "~/utils/fonts"
import Scrollable from "~/components/Scrollable"
import { useStyletron } from "baseui"
import { Box, Spinner, TapArea, Image } from 'gestalt'
import useAppContext from "~/hooks/useAppContext"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import InfiniteScroll from 'react-infinite-scroller'
import { PanelType } from "~/constants/app-options";
import { fetchAllTemplates } from "../../../utils/services"
import { motion } from "framer-motion";

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { setCurrentScene, currentScene } = useDesignEditorContext()
  const [fetching, setFetching] = useState(false)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [templates, setTemplates] = useState([])
  // const currentScene = editor.scene.exportToJSON()
  const { setIsShowMobileModal, params, dimensions, setActivePanel, setActiveSubMenu } = useAppContext()

  useEffect(() => {
      getTemplates()
  }, [page])

  const getTemplates = () => {
      setFetching(true)
      fetchAllTemplates({
        page,
        product_title: params.product_title
      })
      .then(res => {
          if(res.data.code == 0) {
              if(page == 1) {
                setTemplates(res.data.result.docs)
              } else setTemplates(templates.concat(res.data.result.docs))
              
              setPages(res.data.result.pages)

              if(res.data.result.total == 0) {
                setIsSidebarOpen(true)
                setActivePanel(PanelType.GRAPHICS)
                setActiveSubMenu("")
              }
          }
      })
      .then(() => setFetching(false))
  }

  const onLoadMore = () => {
      let nextPage = page + 1
      if(fetching || pages < nextPage) return
      setFetching(true)
      setPage(nextPage)
  }

  const loadTemplate = React.useCallback(
    async (template: any) => {
      if (editor) {
        const fonts: any[] = []

        let backgroundColor = params.backgroundColor

        template.editor_json.layers.forEach((object: any) => {
          if(object.type === "Background") {
            object.fill = backgroundColor.includes("#") ? backgroundColor : ("#" + backgroundColor) 
            object.width = parseInt(dimensions.width)
            object.height = parseInt(dimensions.height)
          }

          if (object.type === "StaticText" || object.type === "DynamicText") {
            fonts.push({
              name: object.fontFamily,
              url: object.fontURL,
              options: { style: "normal", weight: 400 },
            })
          }
        })

        const filteredFonts = fonts.filter((f) => !!f.url)
        if (filteredFonts.length > 0) {
          await loadFonts(filteredFonts)
        }

        // let tempWidth = template.editor_json.frame.width
        // let tempHeight = template.editor_json.frame.height

        template.editor_json.frame.width = parseInt(dimensions.width)
        template.editor_json.frame.height = parseInt(dimensions.height)

        setCurrentScene({ ...template.editor_json, id: currentScene?.id })

        setIsShowMobileModal(false)
      }
    },
    [editor, currentScene]
  )

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Scrollable>
        <InfiniteScroll
          // loader={getLoaderElement()}
          loadMore={onLoadMore}
          hasMore={true}
          threshold={1000}
          useWindow={false}
        >
            <Box paddingY={4}>
              <div style={{ padding: "0 1.5rem" }}>
                <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
                  {templates.map((item, index) => {
                    return <TemplateItem onClick={() => loadTemplate(item)} key={index} template={item} preview={`${item.preview_url}`} />
                  })}
                </div>
              </div>
            </Box>
        </InfiniteScroll>
        <Spinner show={fetching} accessibilityLabel="Loading" />
      </Scrollable>
    </Block>
  )
}

const TemplateItem = (props) => {
  const { template } = props

  const WrapperSize = 140

  return (
      <Box padding={1}>
          <TapArea tapStyle='compress' onTap={props.onClick}>
              <Box color='secondary' width={WrapperSize} height={WrapperSize} rounding={1} position='relative'>
                  <Box width={WrapperSize} height={WrapperSize} display='flex' justifyContent='center' alignItems='center' overflow='hidden'>
                      <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{
                              scale: 0.8,
                              borderRadius: "100%"
                          }}
                      >
                          <Box height={template.height <= template.height ? (110 / Math.ceil(template.height / template.width)) : 110} width={110}>
                              <Image
                                  src={template.preview_url}
                                  naturalHeight={template.height}
                                  naturalWidth={template.weight}
                                  color="white"
                                  alt={template.name}
                              />
                          </Box>
                      </motion.div>
                  </Box>
              </Box>
          </TapArea>
      </Box>
  )
}
