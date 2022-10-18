import React from "react"
import { HexColorPicker } from "react-colorful"
import { StatefulPopover, PLACEMENT } from "baseui/popover"
import { Plus } from "baseui/icon"
import { Input } from "baseui/input"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { Box, Icon, IconButton, Image, TapArea } from 'gestalt'
import { HeaderText } from 'geru-components'
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useAppContext from '~/hooks/useAppContext'
import { colors } from '~/constants/colors'
import useEyeDropper from 'use-eye-dropper'

interface State {
  backgroundColor: string
}

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { backgroundColor } = useAppContext()
  const { open, close, isSupported } = useEyeDropper()
  const [error, setError] = React.useState()

  const [state, setState] = React.useState<State>({
    backgroundColor: "#000000",
  })

  const pickColor = () => {
    open()
    .then(color => handleChange("backgroundColor", color.sRGBHex))
    .catch(e => {
    })
  }

  const changeBackgroundColor = (color: string) => {
    if (editor) {
      editor.frame.setBackgroundColor(color)
    }
  }
  const handleChange = (type: string, value: any) => {
    setState({ ...state, [type]: value })
    changeBackgroundColor(value)
  }

  const onDefaultBackground = () => {
    handleChange("backgroundColor", backgroundColor)
  }

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Scrollable>
        <Block padding={"1.5rem 0"}>
          <Block paddingTop={"0.5rem"}>
            <div
              style={{
                borderRadius: "8px",
                padding: "0.45rem 1rem",
                fontSize: "14px",
              }}
            >
              <HeaderText color='white'>Background color</HeaderText>
              <Box height={12} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  // gap: "0.5rem",
                  paddingTop: "0.25rem",
                }}
              >
                <TapArea tapStyle="compress" onTap={onDefaultBackground}>
                  <Box width={80} height={80}>
                      <Image 
                        src="https://res.cloudinary.com/urlan/image/upload/v1665720526/colors/transparent_vae72w.jpg"
                        naturalHeight={1}
                        naturalWidth={1}
                        color='white'
                        alt="transparent"
                      >
                        <Box display="flex" justifyContent='center' alignItems="center" height="100%" width="100%">
                          <Icon
                            icon="cancel"
                            accessibilityLabel="close"
                            color='dark'
                          />
                        </Box>
                      </Image>
                  </Box>
                </TapArea>
                <StatefulPopover
                  placement={PLACEMENT.bottomLeft}
                  content={
                    <div
                      style={{
                        padding: "1rem",
                        background: "#ffffff",
                        width: "200px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <HexColorPicker onChange={(v) => handleChange("backgroundColor", v)} />
                      <Input
                        overrides={{ Input: { style: { textAlign: "center" } } }}
                        value={state.backgroundColor}
                        onChange={(e) => handleChange("backgroundColor", (e.target as any).value)}
                        placeholder="#000000"
                        clearOnEscape
                      />
                    </div>
                  }
                  accessibilityType={"tooltip"}
                >
                  <div>
                    <div
                      style={{
                        height: "80px",
                        width: "80px",
                        backgroundSize: "100% 100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundImage:
                          'url("https://static.canva.com/web/images/788ee7a68293bd0264fc31f22c31e62d.png")',
                      }}
                    >
                      <div
                        style={{
                          height: "72px",
                          width: "72px",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                        }}
                      >
                        <Plus size={24} />
                      </div>
                    </div>
                  </div>
                </StatefulPopover>

                {isSupported() &&
                  <IconButton
                    accessibilityLabel="Color Picker"
                    icon="color-picker"
                    size='lg'
                    bgColor="lightGray"
                    onClick={pickColor}
                  />
                }
              </div>
            </div>
          </Block>

          <Box display='flex' direction='row' paddingX={4} paddingY={2} wrap>
            {colors.map((color, index) => (
              <Box key={`${color}_${index}`} paddingX={1} paddingY={3}>
                <div
                  onClick={() => handleChange("backgroundColor", color)}
                  key={color}
                  style={{ height: '60px', width: '60px', background: color, cursor: 'pointer' }}
                ></div>
              </Box>
            ))}
            </Box>
        </Block>
      </Scrollable>
    </Block>
  )
}