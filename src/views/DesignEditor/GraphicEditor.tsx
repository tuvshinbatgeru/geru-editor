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

function GraphicEditor(props) {
  const {
    params = {}
  } = props


  const {
    backgroundColor = "000",
    dimensions = {
      width: 2000,
      height: 2000,
    },
    fonts = []
  } = params

  const { setBackgroundColor, setDimensions, setFonts } = useAppContext()
  const editor = useEditor()

  React.useEffect(() => {
    // editor && editor.frame.setBackgroundColor(`#${backgroundColor}`)
  }, [backgroundColor, editor])

  React.useEffect(() => {
    // if(editor)
    // console.log(editor.frame)
    // editor && editor.frame.resize({
    //   width: parseInt(dimensions.width),
    //   height: parseInt(dimensions.height)
    // })
  }, [dimensions, editor])

  // React.useEffect(() => {
  //   fetchFonts()
  //   .then(res => {
  //     if(res.data.code == 0) {
  //           setFonts(res.data.font.map((font) => {
  //             return {
  //               id: font._id,
  //               name: font.name,
  //               family: font.name,
  //               full_name: font.name,
  //               postscript_name: font.name,
  //               preview: "https://ik.imagekit.io/scenify/fonts/previews/9idoq0LRDb67USctK3Z5iDnt.png",
  //               style: font.name,
  //               url: font.url,
  //               category: "handwriting",
  //             }
  //           }))
  //     }
  //   })
  // }, [])

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
