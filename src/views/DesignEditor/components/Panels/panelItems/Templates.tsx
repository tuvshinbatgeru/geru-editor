import React, { useState, useEffect } from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { loadFonts } from "~/utils/fonts"
import Scrollable from "~/components/Scrollable"
import { useStyletron } from "baseui"
import { Box, Spinner } from 'gestalt'
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import InfiniteScroll from 'react-infinite-scroller'

import { fetchAllTemplates } from "../../../utils/services"

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { setCurrentScene, currentScene } = useDesignEditorContext()
  const [fetching, setFetching] = useState(false)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [templates, setTemplates] = useState([])
  // const currentScene = editor.scene.exportToJSON()

  useEffect(() => {
      getTemplates()
  }, [page])

  const getTemplates = () => {
      setFetching(true)
      fetchAllTemplates({
        page,
      })
      .then(res => {
          if(res.data.code == 0) {
              if(page == 1) {
                setTemplates(res.data.result.docs)
              } else setTemplates(templates.concat(res.data.result.docs))
              
              setPages(res.data.result.pages)
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
        template.editor_json.layers.forEach((object: any) => {
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

        let tempWidth = template.editor_json.frame.width
        let tempHeight = template.editor_json.frame.height

        template.editor_json.frame.width = parseInt(tempWidth)
        template.editor_json.frame.height = parseInt(tempHeight)

        setCurrentScene({ ...template.editor_json, id: currentScene?.id })
      }
    },
    [editor, currentScene]
  )

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/*<Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Templates</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>*/}
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
                    return <ImageItem onClick={() => loadTemplate(item)} key={index} preview={`${item.preview_url}`} />
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

function ImageItem({ preview, onClick }: { preview: any; onClick?: (option: any) => void }) {
  const [css] = useStyletron()
  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        "::before:hover": {
          opacity: 1,
        },
      })}
    >
      <div
        className={css({
          backgroundImage: `linear-gradient(to bottom,
          rgba(0, 0, 0, 0) 0,
          rgba(0, 0, 0, 0.006) 8.1%,
          rgba(0, 0, 0, 0.022) 15.5%,
          rgba(0, 0, 0, 0.047) 22.5%,
          rgba(0, 0, 0, 0.079) 29%,
          rgba(0, 0, 0, 0.117) 35.3%,
          rgba(0, 0, 0, 0.158) 41.2%,
          rgba(0, 0, 0, 0.203) 47.1%,
          rgba(0, 0, 0, 0.247) 52.9%,
          rgba(0, 0, 0, 0.292) 58.8%,
          rgba(0, 0, 0, 0.333) 64.7%,
          rgba(0, 0, 0, 0.371) 71%,
          rgba(0, 0, 0, 0.403) 77.5%,
          rgba(0, 0, 0, 0.428) 84.5%,
          rgba(0, 0, 0, 0.444) 91.9%,
          rgba(0, 0, 0, 0.45) 100%)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          height: "100%",
          width: "100%",
          ":hover": {
            opacity: 1,
          },
        })}
      ></div>
      <img
        src={preview}
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          verticalAlign: "middle",
        })}
      />
    </div>
  )
}
