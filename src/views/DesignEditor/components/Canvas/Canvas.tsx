import React from "react"
import { Canvas } from "@layerhub-io/react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ContextMenu from "../ContextMenu"
import { Text, Box } from 'gestalt'
import { useMediaQuery } from 'react-responsive'

export default function () {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: 'column' }}>
      <Box height="100%" width="100%" flex='grow' display="flex">
        <Canvas
          config={{
            guidelines: true,
            background: "#f4f4f4",
            controlsPosition: {
              rotation: "BOTTOM",
            },
            shadow: {
              blur: 4,
              color: "#4f4f4f",
              offsetX: 0,
              offsetY: 0,
            },
          }}
        />
      </Box>
      {
        isTabletOrMobile && <Box height={100} color="light" />
      }
      <ContextMenu />
    </div>
  )
}
