import React from 'react'
import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"

import useAppContext from "~/hooks/useAppContext"
import { useEditor } from "@layerhub-io/react"

import { defaultFonts } from '~/constants/fonts'

function GraphicEditor(props) {
  const {
    params = {}
  } = props

  const { backgroundColor, setBackgroundColor, dimensions, setDimensions, setFonts } = useAppContext()
  const editor = useEditor()

  React.useEffect(() => {
    setDimensions(params.dimensions || { width: 4000, height: 2000 })
    setBackgroundColor(params.backgroundColor || "#000")
  }, [params.backgroundColor, params.dimensions])

  React.useEffect(() => {
    let fonts = params.fonts || defaultFonts

    setFonts(fonts.map((font) => {
      return {
        id: font._id,
        name: font.name,
        family: font.family || font.name,
        full_name: font.full_name || font.name,
        postscript_name: font.postscript_name || font.name,
        preview: font.preview || "https://ik.imagekit.io/scenify/fonts/previews/9idoq0LRDb67USctK3Z5iDnt.png",
        url: font.url,
        category: "handwriting",
      }
    }))
  }, [params.fonts])

  React.useEffect(() => {
    if(editor) {
        editor.frame.setBackgroundColor(`#${backgroundColor}`)
    }
  }, [backgroundColor, dimensions])

  React.useEffect(() => {
    editor && editor.frame.resize({
      width: parseInt(dimensions.width),
      height: parseInt(dimensions.height)
    })
  }, [dimensions])

  return (
    <>
      <EditorContainer>
        <div style={{ display: "flex", flex: 1 }}>
          <Panels />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
            <Toolbox />
            <Canvas />
            <Footer />
          </div>
        </div>
      </EditorContainer>
    </>
  )
}

export default GraphicEditor
