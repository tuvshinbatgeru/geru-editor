import React from 'react'
import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"

import useAppContext from "~/hooks/useAppContext"
import { useEditor } from "@layerhub-io/react"

import { fetchFonts } from '~/views/DesignEditor/utils/services'

function GraphicEditor() {
  const { backgroundColor, setBackgroundColor, dimensions, setDimensions, fonts, setFonts } = useAppContext()
  const editor = useEditor()

  React.useEffect(() => {
    editor && editor.frame.setBackgroundColor(`#${backgroundColor}`)
  }, [backgroundColor])

  React.useEffect(() => {
    editor && editor.frame.resize({
      width: parseInt(dimensions.width),
      height: parseInt(dimensions.height)
    })
  }, [dimensions])

  React.useEffect(() => {
    fetchFonts()
    .then(res => {
      if(res.data.code == 0) {
            setFonts(res.data.font.map((font) => {
              return {
                id: font._id,
                name: font.name,
                family: font.name,
                full_name: font.name,
                postscript_name: font.name,
                preview: "https://ik.imagekit.io/scenify/fonts/previews/9idoq0LRDb67USctK3Z5iDnt.png",
                style: font.name,
                url: font.url,
                category: "handwriting",
              }
            }))
      }
    })
  }, [])

  React.useEffect(() => {
    setTimeout(() => {
      setBackgroundColor("000")
      setDimensions({
        width: 4000,
        height: 2000,
      })
    }, 500)
  }, [])

  return (
    <>
      <EditorContainer>
        {/* <Navbar /> */}
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
