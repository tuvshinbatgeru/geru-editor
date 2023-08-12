import React, { useState } from "react"
import { useEditor } from "@layerhub-io/react"
import { FontItem } from "~/interfaces/common"
import { searchFont } from "~/views/DesignEditor/utils/services"
import { loadFonts } from "~/utils/fonts"
import { IStaticText } from "@layerhub-io/types"
import { nanoid } from "nanoid"
import { Block } from "baseui/block"

import Scrollable from "~/components/Scrollable"
import ListLoadingPlaceholder from '~/components/ListLoadingPlaceholder'

import { TapArea, Box } from "gestalt"
import useAppContext from "~/hooks/useAppContext"

export default function () {
  const editor = useEditor()
  const [fetching, setFetching] = React.useState(false)
  const { setIsShowMobileModal, backgroundColor, setFonts } = useAppContext()
  const [local_fonts, setLocalFonts] = useState([])
  const [uploaded_fonts, setUploadedFonts] = useState([])

  React.useEffect(() => {
    fetchFonts()
  }, [])

  React.useEffect(() => {
    setFonts(local_fonts.concat(uploaded_fonts))
    _loadingFonts()
  }, [local_fonts])

  const _loadingFonts = async () => {
    if(local_fonts.length == 0 && uploaded_fonts.length == 0) return
    await loadFonts(local_fonts.concat(uploaded_fonts))
    setFetching(false)
  }

  const fetchFonts = async () => {
    setFetching(true)
    searchFont({

    })
    .then(res => {
      if(res.data.code == 0) {
        setLocalFonts(res.data.fonts.map((font) => {
          return {
            id: font._id,
            name: font.name,
            family: font.family || font.name,
            full_name: font.full_name || font.name,
            postscript_name: font.postscript_name || font.name,
            preview: font.preview || "https://ik.imagekit.io/scenify/fonts/previews/9idoq0LRDb67USctK3Z5iDnt.png",
            url: font.secure_url || font.url,
            category: "handwriting",
          }
        }))

        setUploadedFonts(res.data.uploaded_fonts.map((font) => {
          return {
            id: font._id,
            name: font.name,
            family: font.family || font.name,
            full_name: font.full_name || font.name,
            postscript_name: font.postscript_name || font.name,
            preview: font.preview || "https://ik.imagekit.io/scenify/fonts/previews/9idoq0LRDb67USctK3Z5iDnt.png",
            url: font.secure_url || font.url,
            category: "handwriting",
          }
        }))
      }
    })
    .catch(err => {
      alert(err)
      setFetching(false)
    })
    // .then(() => setFetching(false))

    // if(fonts.length == 0) return
    // setFetching(true)
    // await loadFonts(fonts)
    // setCommonFonts(fonts)
    // setFetching(false)
  } 

  const AddNewFonts = async (font) => {
    if (editor) {
      // const new_font: FontItem = {
      //   name: font.name,
      //   url: font.url,
      // }

      // await loadFonts([new_font])
      const options = {
        id: nanoid(),
        type: "StaticText",
        width: 420,
        text: font.name,
        fontSize: 92,
        fontFamily: font.name,
        textAlign: "center",
        fontStyle: "normal",
        fontURL: font.secure_url || font.url,
        fill: (backgroundColor == "#fff" || backgroundColor == "fff") ? "#000" : "#fff", 
        metadata: {},
      }

      // alert(JSON.stringify(opti))
      console.log(options)


      editor.objects.add(options)
      setIsShowMobileModal(false)
    }
  }
  
  return (
    <Box height="100%" width="100%" display="flex">
      <Scrollable>
        <div style={{
            display: 'grid',
            gap: '0.5rem',
        }}>
            { fetching && <ListLoadingPlaceholder /> }

            {uploaded_fonts.map(font => (
              <TapArea key={font.name} tapStyle="compress" onTap={() => AddNewFonts(font)}>
                <Box paddingX={4} smPaddingX={4} mdPaddingX={4} lgPaddingX={4} >
                  <Box padding={2} borderStyle="raisedTopShadow">
                     <div style={{
                        display: 'flex',
                        paddingLeft: '1rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        fontSize: '20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontFamily: font.name
                    }}>
                      <span style={{ color: "#fff" }}>{font.name}</span>
                    </div>
                  </Box>
                </Box>
              </TapArea>
            ))}

            {local_fonts.map(font => (
              <TapArea key={font.name} tapStyle="compress" onTap={() => AddNewFonts(font)}>
                <Box paddingX={4} smPaddingX={4} mdPaddingX={4} lgPaddingX={4} >
                  <Box padding={2} borderStyle="raisedTopShadow">
                     <div style={{
                        display: 'flex',
                        paddingLeft: '1rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        fontSize: '20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontFamily: font.name
                    }}>
                      <span style={{ color: "#fff" }}>{font.name}</span>
                    </div>
                  </Box>
                </Box>
              </TapArea>
            ))}

            
          </div>
      </Scrollable>
    </Box>
  )
}