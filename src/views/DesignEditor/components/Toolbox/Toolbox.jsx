import React from "react"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import getSelectionType from "~/utils/get-selection-type"
import { styled } from "baseui"
import Items from "./Items"
import useAppContext from "~/hooks/useAppContext"
import Navbar from '~/views/DesignEditor/components/Navbar'
import { Box, FixedZIndex, ScrollBoundaryContainer } from 'gestalt'
import { useMediaQuery } from 'react-responsive'

import Fill from "./Fill"

const DEFAULT_TOOLBOX = "Canvas"

const Container = styled("div", (props) => ({
  boxShadow: "rgb(0 0 0 / 15%) 0px 1px 1px",
  height: "50px",
  display: "flex",
  // position: `${props => props.position}`,
  position: "sticky",
  top: 0,
  left: 0,
  right: 0,
  zIndex: `${props => props.zIndex}`,
}))

const Toolbox = (props) => {
  const [state, setState] = React.useState({ toolbox: "Text" })
  const { setActiveSubMenu } = useAppContext()
  const activeObject = useActiveObject()
  const editor = useEditor()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const zIndex = new FixedZIndex(2)

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

  if(isTabletOrMobile) return (
    <Box position="fixed" top left right height={50} zIndex={zIndex} display='flex'>
      <Box flex='grow' display="flex" alignItems="center" height={50} color='light'>
          <Fill />
      </Box>
      <Navbar onSaveTemplateCallback={props.onSaveTemplateCallback} />
    </Box>
  )

  return (
    <Container position="sticky" zIndex={0}>
      <Box flex='grow' display="flex" alignItems="center" height={50} width="100%" color='light'>
        <Fill />
        <Box flex='grow'>
          <Component has_common has_toolbox />
        </Box>
      </Box>
      <Navbar onSaveTemplateCallback={props.onSaveTemplateCallback} />
    </Container>
  )
}

export default Toolbox
