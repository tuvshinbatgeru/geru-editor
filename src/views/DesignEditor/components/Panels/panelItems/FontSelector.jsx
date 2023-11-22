import React, { useState, useEffect } from "react"
import ArrowBackOutline from "~/components/Icons/ArrowBackOutline"
import Search from "~/components/Icons/Search"
import { Input, SIZE } from "baseui/input"
import useAppContext from "~/hooks/useAppContext"
import { useStyletron } from "baseui"
import { IStaticText } from "@layerhub-io/types"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { loadFonts } from "~/utils/fonts"
import { SAMPLE_FONTS } from "~/constants/editor"
import { groupBy } from "lodash"
import Scrollable from "~/components/Scrollable"
import { Block } from "baseui/block"
import {TapArea, Box} from "gestalt"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { nanoid } from "nanoid"
import { FontItem } from '~/views/DesignEditor/components/Panels/panelItems/Text'
import { colors } from 'geru-components/dist/utils'
import { searchFont } from "~/views/DesignEditor/utils/services"

export default function () {
  const [query, setQuery] = React.useState("")
  const { setActiveSubMenu, fonts } = useAppContext()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const [commonFonts, setCommonFonts] = React.useState([])
  const [css] = useStyletron()
  const editor = useEditor()
  const activeObject = useActiveObject()

  const [fetching, setFetching] = React.useState(false)
  const [local_fonts, setLocalFonts] = useState([])
  const [uploaded_fonts, setUploadedFonts] = useState([])
  const [fontTypes, setFontTypes] = useState([{
    title: "Крилл",
    name: "cyrillic",
    fonts: []
  }, {
    title: "Латин",
    name: "unicode",
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
  }]) 

  useEffect(() => {
    fetchFonts()
    // setFontTypes()
  }, [])

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
      // setFetching(false)
    })
    .then(() => setFetching(false))

    // if(fonts.length == 0) return
    // setFetching(true)
    // await loadFonts(fonts)
    // setCommonFonts(fonts)
    // setFetching(false)
  } 
  
  const addObject = async (font) => {
    if (editor) {
      await loadFonts([font])
      // debugger
      editor.objects.update({
        fontFamily: font.name,
        fontURL: font.url,
      })
    }
  }

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Scrollable>
        <div style={{
            display: 'grid',
            gap: '0.5rem',
          }}>
            {uploaded_fonts.concat(local_fonts).map((font, index) => (
              <FontItem 
                  key={index}
                  font={font}
                  text={activeObject && activeObject.text}
                  onTap={() => addObject(font)}
              />
            ))}
          </div>
      </Scrollable>
    </Block>
  )
}
