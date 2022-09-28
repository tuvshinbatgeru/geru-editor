import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { Button } from "gestalt"

export default function () {
  return (
      <>
        <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Scrollable>
                <Block padding={"0 1.5rem"}>
                    <Button
                        onClick={() => alert("My design is fetching ....")}
                        color="red"
                        text="My design"
                        fullWidth
                    />
                </Block>
            </Scrollable>
        </Block>
      </>
  )
}
