import React from "react"
import { Button, SIZE } from "baseui/button"
import { HexColorPicker } from "react-colorful"
import { StatefulPopover, PLACEMENT } from "baseui/popover"
import { Plus } from "baseui/icon"
import { Input } from "baseui/input"
import { useEditor, useFrame } from "@layerhub-io/react"
import { Modal, ROLE } from "baseui/modal"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { sampleFrames } from "~/constants/editor"
import Scrollbar from "@layerhub-io/react-custom-scrollbar"
import SwapHorizontal from "~/components/Icons/SwapHorizontal"
import { Tabs, Tab } from "baseui/tabs"
import { Box, Icon, Image, TapArea } from 'gestalt'
import { HeaderText } from 'geru-components'
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import useAppContext from '~/hooks/useAppContext'

const colors = [
  '#048c7f',
  '#f2e2c4',
  '#d99441',
  '#d94e41',
  '#bf0a0a',
  '#eb9331',
  '#fdc76f',
  '#fbf1d6',
  '#d3f5fe',
  '#8ed1e2',
  '#8254f6',
  '#d2d5e1',
  '#ee352a',
  '#133740',
  '#001f27',
  '#d90416',
  '#020540',
  '#32508c',
  '#048abf',
  '#f2f2f2',
  '#048c7f',
  '#f28f16',
  '#d96e11',
  '#8c5230',
  '#260101',
  '#a7c1d9',
  '#878c5d',
  '#bdbf6f',
  '#f2cd5e',
  '#bf5b45',
  '#285954',
  '#88bfba',
  '#6da653',
  '#e5dba8',
  '#d95032',
  '#f24452',
  '#542d59',
  '#c5d930',
  '#f2cf63',
  '#f25d50',
  '#a9d9cb',
  '#f2d7b6',
  '#593a2e',
  '#f25835',
  '#f29985',
  '#f2c2dc',
  '#a56da6',
  '#442f73',
  '#f2bb13',
  '#f2d16d',
  '#f294a5',
  '#f2a2c0',
  '#f26938',
  '#f25430',
  '#f2766b',
  '#bf2441',
  '#070a0d',
  '#213d40',
  '#6e736f',
  '#bf9c88',
  '#113059',
  '#26528c',
  '#62b7d9',
  '#b3e0f2',
  '#f2f2f2',
  '#f28d9f',
  '#a62679',
  '#743b8c',
  '#f2ccb6',
  '#f29472',
  '#f24b59',
  '#e73557',
  '#cb1550',
  '#f56191',
  '#f896ad',
  '#e9cabb',
  '#05787d',
  '#bcd8cc',
  '#efc809',
  '#ef8e6d',
  '#1e7494',
  '#ade9ff',
  '#43b7e0',
  '#ed881c',
  '#f5b776',
  '#ffc2bd',
  '#acb9fa',
  '#fff5bf',
  '#ffad87',
  '#82ffd1',
  '#a34687',
  '#f0e297',
  '#f07fce',
  '#67edf0',
  '#14a1a3',
  '#8b428c',
  '#0d7ba6',
  '#f29f05',
  '#f28705',
  '#f24949',
  '#f22738',
  '#00010d',
  '#133840',
  '#feffff',
  '#8fbbc4',
  '#fdd5c0',
  '#fb8289',
  '#f46161',
  '#f89d5b',
  '#ffcf62',
  '#747ba8',
  '#9da9f5',
  '#f5f191',
  '#a452a8',
  '#ef84f5',
  '#0476d9',
  '#04bfad',
  '#f2d335',
  '#f28705',
  '#d94a4a',
]

interface State {
  backgroundColor: string
}

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { backgroundColor } = useAppContext()

  const [state, setState] = React.useState<State>({
    backgroundColor: "#000000",
  })

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
                // background: "#fafafa",
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
                  gap: "0.5rem",
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
              </div>
            </div>
          </Block>

          <Box display='flex' direction='row' paddingX={4} paddingY={2} wrap>
            {colors.map((color) => (
              <Box key={color} paddingX={1} paddingY={3}>
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