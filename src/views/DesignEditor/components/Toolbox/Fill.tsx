import React from "react"
import { useEditor } from "@layerhub-io/react"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { Button, SIZE, KIND } from "baseui/button"
import useAppContext from "~/hooks/useAppContext"
import { Box, Image, Mask } from 'gestalt'

export default function () {
  const { setActiveSubMenu } = useAppContext()

  return (
    <Box>
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
    </Box>
  )
}
