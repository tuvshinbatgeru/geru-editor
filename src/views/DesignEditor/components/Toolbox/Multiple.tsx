import { Block } from "baseui/block"
import Common from "./Common"
import { PLACEMENT, StatefulPopover } from "baseui/popover"
import { CompactPicker } from 'react-color'
import { HexColorPicker } from "react-colorful"
import { colors } from '~/constants/colors'
import { useActiveObject } from "@layerhub-io/react"

const PRESET_COLORS = colors

export default function () {
  const activeObject = useActiveObject()

  // console.log(activeObject._objects)

  return (
    <Block
      $style={{
        // flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: "space-between",
      }}
    >
      {/* <StatefulPopover
        placement={PLACEMENT.bottomLeft}
        content={
          <div
            style={{
              padding: "1rem",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <CompactPicker 
              // color={c}
              colors={PRESET_COLORS}
              presetColors={PRESET_COLORS}
              onChange={(color) => {
                // changeBackgroundColor(c, color.hex)
              }}
            />
            <HexColorPicker 
              // color={c}
              // onChange={(color) => changeBackgroundColor(c, color)}
            />
          </div>
        }
        accessibilityType={"tooltip"}
      >
        <div>
          <div
            style={{
              height: "24px",
              width: "24px",
              borderRadius: '12px',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              // background: "red",
              backgroundColor: "#000",// state.colorMap[c],
              border: "1px solid #dedede",
            }}
          ></div>
        </div>
      </StatefulPopover> */}
      <Block>Олон элемэнт</Block>
      <Common />
    </Block>
  )
}
