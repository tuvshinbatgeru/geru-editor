import React, { useState, useEffect } from "react"
import { useEditor } from "@layerhub-io/react"
import { FontItem } from "~/interfaces/common"
import { searchFont } from "~/views/DesignEditor/utils/services"
import { loadFonts } from "~/utils/fonts"
import { IStaticText } from "@layerhub-io/types"
import { nanoid } from "nanoid"
import { Block } from "baseui/block"

import Scrollable from "~/components/Scrollable"
import ListLoadingPlaceholder from '~/components/ListLoadingPlaceholder'

import { TapArea, Box, Spinner, Text } from "gestalt"
import useAppContext from "~/hooks/useAppContext"

export default function () {
  const editor = useEditor()
  const [fetching, setFetching] = React.useState(false)
  const { setIsShowMobileModal, backgroundColor, setFonts } = useAppContext()
  const [local_fonts, setLocalFonts] = useState([])
  const [uploaded_fonts, setUploadedFonts] = useState([])
  const [fontTypes, setFontTypes] = useState([{
    title: "Крилл",
    name: "cyrillic",
    fonts: []
  }, {
    title: "Монгол Бичиг",
    name: "mongol_script",
    fonts: []
  }, {
    title: "Соёмбо үсэг",
    name: "soyombo_script",
    fonts: [],
    link: "https://en.wikipedia.org/wiki/Soyombo_script"
  }, {
    title: "Латин",
    name: "unicode",
    fonts: []
  }]) 

  useEffect(() => {
    fetchFonts()
    // setFontTypes()
  }, [])

  useEffect(() => {
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
        let newFontTypes = [...fontTypes]

        const local_fonts = res.data.fonts.map((font) => {
          return {
            id: font._id,
            name: font.name,
            family: font.family || font.name,
            full_name: font.full_name || font.name,
            postscript_name: font.postscript_name || font.name,
            preview: font.preview || "https://ik.imagekit.io/scenify/fonts/previews/9idoq0LRDb67USctK3Z5iDnt.png",
            placeholder: font.placeholder || font.name,
            url: font.secure_url || font.url,
            category: "handwriting",
          }
        })

        setLocalFonts(local_fonts)

        let index = newFontTypes.findIndex((cur) => cur.name == "cyrillic")
        newFontTypes[index].fonts = local_fonts

        let uploaded_fonts = res.data.uploaded_fonts.map((font) => {
          return {
            id: font._id,
            name: font.name,
            family: font.family || font.name,
            full_name: font.full_name || font.name,
            postscript_name: font.postscript_name || font.name,
            placeholder: font.placeholder || font.name,
            preview: font.preview || "https://ik.imagekit.io/scenify/fonts/previews/9idoq0LRDb67USctK3Z5iDnt.png",
            url: font.secure_url || font.url,
            category: font.category || "handwriting",
          }
        })

        let mongol_scriptIndex = newFontTypes.findIndex((cur) => cur.name == "mongol_script")
        newFontTypes[mongol_scriptIndex].fonts = uploaded_fonts.filter((font) => font.category == "mongol_script")

        let soyombo_scriptIndex = newFontTypes.findIndex((cur) => cur.name == "soyombo_script")
        newFontTypes[soyombo_scriptIndex].fonts = uploaded_fonts.filter((font) => font.category == "soyombo_script")

        let latin_index = newFontTypes.findIndex((cur) => cur.name == "unicode")
        newFontTypes[latin_index].fonts = uploaded_fonts.filter((font) => font.name != "soyombo_script" && font.name != "mongol_script")

        setUploadedFonts(uploaded_fonts)
        setFontTypes(newFontTypes)
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
      // alert(font.placeholder)
      // await loadFonts([new_font])
      const options = {
        id: nanoid(),
        type: "StaticText",
        width: 420,
        text: font.placeholder || font.name,
        fontSize: 92,
        fontFamily: font.name,
        textAlign: "center",
        // clipPath: "M0,50c6.27-6.5,12.54-13,25.08-13,25.07,0,25.07,26,50.15,26,12.33,0,18.6-6.29,24.77-12.68",
        // diameter: 360,
        // skewX: 30,
        // skewY: 30,
        // cacheProperties: "diameter",
        fontURL: font.secure_url || font.url,
        fill: (backgroundColor == "#fff" || backgroundColor == "fff") ? "#000" : "#fff", 
        metadata: {},
      }

      // alert(JSON.stringify(opti))
      // console.log(options)


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
            { 
              fetching ? <Box>
                <Box display='flex' paddingY={10} justifyContent="center">
                  <Spinner show={true} accessibilityLabel="Loading" />
                </Box>
                <ListLoadingPlaceholder />
              </Box> : <>
                  {
                    fontTypes.map((font, index) => (
                      <Box key={index}>
                        <Box paddingX={4} paddingY={6} display="flex" justifyContent="between">
                          <Text color='light' weight="bold">{font.title}</Text>
                          {
                            font.fonts.length > 3 && <Text color='light' underline>илүү ихийг</Text>
                          }
                        </Box>
                        <Box>
                          {font.fonts.slice(0, 3).map(font => (
                            <TapArea key={font.name} tapStyle="compress" onTap={() => AddNewFonts(font)}>
                              <Box paddingX={4} smPaddingX={4} mdPaddingX={4} lgPaddingX={4} >
                                <Box padding={2} borderStyle="raisedTopShadow">
                                  <div style={{
                                      display: 'flex',
                                      paddingLeft: '1rem',
                                      paddingTop: '1rem',
                                      paddingBottom: '1rem',
                                      fontSize: '18px',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      textAlign: 'center',
                                      fontFamily: font.name
                                  }}>
                                    <span style={{ color: "#fff" }}>{font.name}</span>
                                  </div>
                                </Box>
                              </Box>
                            </TapArea>
                          ))}
                        </Box>
                      </Box>
                    ))
                  }  
              </>
            }
          </div>
      </Scrollable>
    </Box>
  )
}