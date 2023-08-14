import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { Delete } from "baseui/icon"
import { throttle } from "lodash"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { TEXT_EFFECTS } from "~/constants/design-editor"
import { Text, Box, TapArea } from 'gestalt'
import Outline from "./Common/Outline"
import Shadow from "./Common/Shadow"

const EFFECTS = {
  None: {
    fill: "#333333",
    strokeWidth: 0,
    shadow: {
      blur: 0,
      color: "#afafaf",
      offsetX: 10,
      offsetY: 10,
      enabled: false,
    },
  },
  Shadow: {
    fill: "#333333",
    shadow: {
      blur: 0,
      color: "#afafaf",
      offsetX: 10,
      offsetY: 10,
      enabled: true,
    },
  },
  Lift: {
    fill: "#333333",
    shadow: {
      blur: 0,
      color: "rgba(0,0,0,0.45)",
      offsetX: 0,
      offsetY: 0,
      enabled: true,
    },
  },
  Hollow: {
    stroke: "#fff",
    fill: null,
    strokeWidth: 2,
    shadow: {
      blur: 0,
      color: "rgba(0,0,0,0.45)",
      offsetX: 0,
      offsetY: 0,
      enabled: false,
    },
  },
  Splice: {
    stroke: "#000000",
    fill: null,
    strokeWidth: 2,
    shadow: {
      blur: 0,
      color: "#afafaf",
      offsetX: 10,
      offsetY: 10,
      enabled: true,
    },
  },
  Neon: {
    stroke: "#e84393",
    fill: "#fd79a8",
    strokeWidth: 2,
    shadow: {
      blur: 0,
      color: "#fd79a8",
      offsetX: 0,
      offsetY: 0,
      enabled: true,
    },
  },
}
export default function () {
  const [color, setColor] = React.useState("#b32aa9")
  const activeObject = useActiveObject()
  const editor = useEditor()

  const updateObjectFill = throttle((color: string) => {
    if (activeObject) {
      editor.objects.update({ fill: color })
    }

    setColor(color)
  }, 100)

  const applyEffect = (name: string) => {
    if (editor) {
      //  @ts-ignore
      const effect = EFFECTS[name]
      if (effect) {
        editor.objects.update(effect)
      }
    }
  }
  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Text color='light' size='400' weight="bold">Effects</Text>

        <Block $style={{ cursor: "pointer", display: "flex" }}>
          <Delete size={24} color='white' />
        </Block>
      </Block>
      <Scrollable>
        <Box display='flex' wrap>
            {TEXT_EFFECTS.map((effect, index) => {
              return (
                <Box column={4} key={index} marginBottom={4}>
                  <Block style={{ cursor: "pointer" }} key={index}>
                    <TapArea
                      onTap={() => applyEffect(effect.name)}
                      tapStyle="compress"
                    >
                      <Box height={70} display="flex" justifyContent="center" alignItems="center">
                        <img style={{ width: "70px" }} src={effect.preview} />
                      </Box>
                    </TapArea>
                    <Box marginTop={2}>
                      <Text color='light' align="center">
                        {effect.name}
                      </Text>
                    </Box>
                  </Block>
                </Box>
              )
            })}
        </Box>
        <Box mdMarginTop={10}>
            <Outline />
            <Shadow />
        </Box>
      </Scrollable>
    </Block>
  )
}
