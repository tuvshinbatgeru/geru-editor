import React from "react"
import { Block } from "baseui/block"
import { HexColorPicker } from "react-colorful"
import Common from "./Common"
import { useActiveObject } from "@layerhub-io/react"
import { groupBy } from "lodash"
import { PLACEMENT, StatefulPopover } from "baseui/popover"
import Flip from "./Shared/Flip"
import { SketchPicker, CompactPicker, SwatchesPicker } from 'react-color'

import { colors } from '~/constants/colors'
const PRESET_COLORS = colors

export default function (props) {
  const { has_common = false, has_toolbox = false } = props
  const [state, setState] = React.useState<any>({ colors: [], colorMap: {} })
  const vectorPaths = React.useRef<any>({})
  const activeObject = useActiveObject() as any

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticVector") {
      const objects = activeObject._objects[0]._objects
      const objectColors = groupBy(objects, "fill")
      vectorPaths.current = objectColors
      setState({ ...state, colors: Object.keys(objectColors), colorMap: activeObject.colorMap })
    }
  }, [activeObject])

  const changeBackgroundColor = (prev: string, next: string) => {
    const objectRef = activeObject
    objectRef.updateLayerColor(prev, next)
    setState({
      ...state,
      colorMap: {
        ...state.colorMap,
        [prev]: next,
      },
    })
  }

  return (
    <Block
      $style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: has_toolbox ? "space-between" : "flex-end",
      }}
    >
      {
        has_toolbox && (
          <Block>
            <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {Object.keys(state.colorMap).map((c, index) => {
                  return (
                    <StatefulPopover
                      key={index}
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
                            color={c}
                            colors={PRESET_COLORS}
                            presetColors={PRESET_COLORS}
                            onChange={(color) => {
                              changeBackgroundColor(c, color.hex)
                            }}
                          />
                          <HexColorPicker 
                            color={c}
                            onChange={(color) => changeBackgroundColor(c, color)}
                          />
                          {/* <SketchPicker 
                            color={c}
                            disableAlpha
                            presetColors={[]}
                            onChange={(color) => {
                              changeBackgroundColor(c, color.hex)
                            }}
                          /> */}
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
                            backgroundColor: state.colorMap[c],
                            border: "1px solid #dedede",
                          }}
                        ></div>
                      </div>
                    </StatefulPopover>
                  )
                })}
              </Block>
              <Flip />
            </Block>
          </Block>
        )
      }

      { has_common && <Common /> }
    </Block>
  )
}
