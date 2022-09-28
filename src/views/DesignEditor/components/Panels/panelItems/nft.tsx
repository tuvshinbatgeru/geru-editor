import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { Button } from "gestalt"
//import { Text} from "geru-components"
import { HeaderText} from "geru-components"
import { Box} from "gestalt"

export default function () {
    return (
        <>
            <Block $style={{ flex: 1, display: "flex", flexDirection: "column"}}>
                <Scrollable>
                    <Box padding={6} display='flex' justifyContent='center' height='100%' alignItems='center'>
                        <HeaderText color="white" align='center'>NFT WALLET CONNECTION COMING SOON...</HeaderText>
                    </Box>
                </Scrollable>
            </Block>
        </>
    )
}
