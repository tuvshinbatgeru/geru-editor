import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { Button } from "gestalt"
import { HeaderText} from "geru-components"
import { Box} from "gestalt"
import PhantomWallet from '../panelItems/web3/wallets/PhantomWallet'
import MetamaskWallet from '../panelItems/web3/wallets/MetamaskWallet'
export default function () {
    return (
        <>
            <Block $style={{ flex: 1, display: "flex", flexDirection: "column"}}>
                <Scrollable>
                    {/*<Box padding={6} display='flex' justifyContent='center' height='100%' alignItems='center'>
                        <HeaderText color="white" align='center'>NFT WALLET CONNECTION COMING SOON...</HeaderText>
                    </Box>*/}
                    <Box padding={4}>
                        <MetamaskWallet/>
                    </Box>
                    <Box padding={4}>
                        <PhantomWallet />
                    </Box>
                </Scrollable>
            </Block>
        </>
    )
}
