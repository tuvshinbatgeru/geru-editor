import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { HexColorPicker } from "react-colorful"
import { Delete } from "baseui/icon"
import { throttle } from "lodash"
import { Box } from 'gestalt'
import { HeaderText } from 'geru-components'
import { useActiveObject, useEditor } from "@layerhub-io/react"

import { colors } from '~/constants/colors'
const PRESET_COLORS = colors

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

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column", height: '100%' }}>
      <Scrollable>
        <Block padding={"1.5rem 1.5rem"}>
          <HexColorPicker onChange={updateObjectFill} style={{ width: "100%" }} />
          <Block>
            <Box height={20} />
            <Box paddingY={4}>
              <HeaderText color='white'>Preset colors</HeaderText>
            </Box>
            <Block $style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: "0.25rem" }}>
              {PRESET_COLORS.map((color, index) => (
                <Block
                  $style={{
                    cursor: "pointer",
                  }}
                  onClick={() => updateObjectFill(color)}
                  backgroundColor={color}
                  height={"38px"}
                  key={index}
                ></Block>
              ))}
            </Block>
          </Block>
        </Block>
      </Scrollable>
    </Block>
  )
}
