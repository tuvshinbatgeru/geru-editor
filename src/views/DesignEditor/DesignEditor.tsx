import React, { useEffect } from 'react'
import GraphicEditor from "./GraphicEditor"
import TemplateLoader from './components/TemplateLoader'
import useAppContext from "~/hooks/useAppContext"
import { useEditor } from "@layerhub-io/react"
import { defaultFonts } from '~/constants/fonts'

function DesignEditor(props) {
  const { setBackgroundColor, setDimensions, setFonts, setIgnoreAppOptions, setStickerParams, setParams } = useAppContext()
  const { params = {} } = props
  const { template = {} } = params 

  const editor = useEditor()

  useEffect(() => {
    if(editor) {
      const dimensions = params.dimensions || { width: 2000, height: 3000 }
      const fonts = params.fonts || defaultFonts
      const backgroundColor = params.backgroundColor || "000"
      const ignoreAppOptions = params.ignoreAppOptions || []
      const stickerParams = params.stickerParams || {}

      setDimensions(dimensions)
      setBackgroundColor(backgroundColor)
      setIgnoreAppOptions(ignoreAppOptions)
      setStickerParams(stickerParams)
      setParams(params)
      
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
    }
  }, [editor, props.params])

  return (
    <>
      <TemplateLoader template={template} />
      <GraphicEditor {...props} />
    </>
  )
}

export default DesignEditor
