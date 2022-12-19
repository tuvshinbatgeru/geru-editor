import React from "react"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import getSelectionType from "~/utils/get-selection-type"
import { styled } from "baseui"
import Items from "../Toolbox/Items"
import useAppContext from "~/hooks/useAppContext"
import Navbar from '~/views/DesignEditor/components/Navbar'
import { Box, ScrollBoundaryContainer } from 'gestalt'
import { useMediaQuery } from 'react-responsive'

const DEFAULT_TOOLBOX = "Canvas"

const Container = styled("div", (props) => ({
//   boxShadow: "rgb(0 0 0 / 15%) 0px 1px 1px",
  height: "50px",
//   backgroundColor: '#fff',
  position: 'fixed',
  bottom: '80px',
  left: '0px',
  right: '0px',
  borderRadius: '30px',
  display: "flex",
  justifyContent: 'center'
}))

const Toolbox = () => {
  const [state, setState] = React.useState({ toolbox: "Text" })
  const { setActiveSubMenu } = useAppContext()
  const activeObject = useActiveObject()
  const editor = useEditor()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  if(!isTabletOrMobile) return null

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

  return (
    <Container>
      <Box display="flex" alignItems="center" height={50} color='light' borderStyle="shadow" rounding={6}>
        <Component has_toolbox />
      </Box>
    </Container>
  )
}

export default Toolbox
