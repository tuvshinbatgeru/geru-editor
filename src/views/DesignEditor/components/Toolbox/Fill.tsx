import React from 'react'

import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { Button, SIZE, KIND } from "baseui/button"
import useAppContext from "~/hooks/useAppContext"
import useEyeDropper from 'use-eye-dropper'
import { useEditor, useActiveObject } from "@layerhub-io/react"
import { Box, Image, Mask, IconButton } from 'gestalt'

export default function () {
  const { setActiveSubMenu } = useAppContext()
  const { open, close, isSupported } = useEyeDropper()
  const editor = useEditor()
  const activeObject = useActiveObject()

  const pickColor = () => {
    open()
    .then(color => changeBackgroundColor(color.sRGBHex))
    .catch(e => {
    })
  }

  const changeBackgroundColor = (color: string) => {
    if (editor) {
      editor.frame.setBackgroundColor(color)
    }
  }

  return (
    <Box display='flex' alignItems='center'>
      <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"}>
        <Button
          onClick={() => setActiveSubMenu("Customize")}
          size={SIZE.mini}
          kind={KIND.tertiary}
        >
          <Mask height={32} width={32} rounding="circle">
            <Image 
              naturalHeight={1}
              naturalWidth={1}
              alt="Background"
              color="white"
              src="https://www.geru.mn/images/full-color.png"
            />
          </Mask>
        </Button>
      </StatefulTooltip>
      {
        !activeObject && (
          <Box>
            {
              isSupported() &&
              <IconButton 
                accessibilityLabel="Color Picker"
                icon="color-picker"
                size='sm'
                bgColor="lightGray"
                onClick={pickColor}
              />
            }
          </Box>
        )
      }
    </Box>
  )
}
