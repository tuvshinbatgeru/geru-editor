import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { Button } from "gestalt"
//import { Text} from "geru-components"

export default function () {
    return (
        <>
            <Block $style={{ flex: 1, display: "flex", flexDirection: "column"}}>
                <Scrollable>
                    <Block padding={"0 1.5rem"}>
                        <Button
                            onClick={() => alert("NFT fetching ....")}
                            color={ "red"}
                            text="NFT"
                            fullWidth
                        />
                        {/*<Text text="test"></Text>*/}
                    </Block>
                </Scrollable>
            </Block>
        </>
    )
}
