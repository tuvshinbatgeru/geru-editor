import React from "react"
import { useZoomRatio, useEditor, useActiveObject } from "@layerhub-io/react"
import useAppContext from "~/hooks/useAppContext"

import { useMediaQuery } from 'react-responsive'
import { Box } from 'gestalt'
import Items from "../../Toolbox/Items"

import getSelectionType from "~/utils/get-selection-type"

const DEFAULT_TOOLBOX = "Canvas"

interface Options {
  zoomRatio: number
}

export default function () {
  const zoomMin = 10
  const zoomMax = 240
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const editor = useEditor()
  const [options, setOptions] = React.useState<Options>({
    zoomRatio: 20,
  })

  const [state, setState] = React.useState({ toolbox: "Text" })
  const activeObject = useActiveObject()
  const { setActiveSubMenu } = useAppContext()
  const zoomRatio: number = useZoomRatio()

  React.useEffect(() => {
    const selectionType = getSelectionType(activeObject)
    if (selectionType) {
      if (selectionType.length > 1) {
        setState({ toolbox: "Multiple" })
      } else {
        setState({ toolbox: selectionType[0] })
      }
    } else {
      setState({ toolbox: DEFAULT_TOOLBOX })
      setActiveSubMenu("")
    }
  }, [activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject) {
        // @ts-ignore
        const selectionType = getSelectionType(activeObject)

        if (selectionType.length > 1) {
          setState({ toolbox: "Multiple" })
        } else {
          setState({ toolbox: selectionType[0] })
        }
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor, activeObject])

  // @ts-ignore
  const Component = Items[state.toolbox] ? Items[state.toolbox] : Items[DEFAULT_TOOLBOX]

  const handleChange = (type: string, value: any) => {
    if (value < 0) {
      editor.zoom.zoomToRatio(zoomMin / 100)
    }
    else if (value > zoomMax) {
      editor.zoom.zoomToRatio(zoomMax / 100)
    }
    else {
      editor.zoom.zoomToRatio(value / 100)
    }
  }

  React.useEffect(() => {
    setOptions({ ...options, zoomRatio: Math.round(zoomRatio * 100) })
  }, [zoomRatio])

  if(isTabletOrMobile) return (
    <Box display='flex' color='light' position="fixed" bottom height={70} direction='row' left right width="100%">
        <Box width={70} />
        <Box flex='grow' display='flex' alignItems="center">
          <Component has_common has_toolbox={false} />
        </Box>
    </Box>
  )

  return null
}
