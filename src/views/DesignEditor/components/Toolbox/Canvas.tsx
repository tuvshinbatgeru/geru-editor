import React from "react"
import { Block } from "baseui/block"
import Common from "./Common"
import useAppContext from "~/hooks/useAppContext"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import Navbar from "../Navbar"

export default function () {
  const [state, setState] = React.useState({ fill: "#000000" })
  
  const editor = useEditor()
  const activeObject = useActiveObject() as any

  React.useEffect(() => {
    if (editor) {
      setState({ fill: editor.canvas.backgroundColor as string })
    }
  }, [editor])

  React.useEffect(() => {
    let watcher = async () => {
      setState({ fill: editor.canvas.backgroundColor as string })
    }
    if (editor) {
      editor.on("canvas:updated", watcher)
    }
    return () => {
      if (editor) {
        editor.off("canvas:updated", watcher)
      }
    }
  }, [editor, activeObject])

  return (
    <Navbar />
  )
}
