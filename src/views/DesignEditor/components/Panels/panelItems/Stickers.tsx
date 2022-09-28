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
                            onClick={() => alert("sticker fetching ....")}
                            color="red"
                            text="STICKERS"
                            fullWidth
                        />
                    </Block>
                </Scrollable>
            </Block>
        </>
    )
}
