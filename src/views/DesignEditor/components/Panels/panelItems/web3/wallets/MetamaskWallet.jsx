import React, { useState, useEffect } from 'react'
import { Box,  TapArea, Button, Text, Image} from 'gestalt'
import { utils } from 'ethers';
import { HeaderText } from "geru-components"
import { Scrollbars } from 'react-custom-scrollbars'
import Masonry from 'react-masonry-component'
import { fetchNFTs } from '../ethNft'
import { useEditor } from "@layerhub-io/react"

const install_metamask_text = 'Please install metamask!';
const connect_wallet_error_text = 'Not able to get accounts';
const initial_wallet_text = 'Not connected';
const no_nfts_text = 'Does not have any NFTs';
const connect_wallet_text = 'Connect metamask';
const loading_nfts_text = 'Fetching NFTs...';
const wallet_empty_text = 'No nfts to display'


const MetamaskWallet = (props) => {
    const [wallet, setWallet] = useState("");
    const [nfts, setNFTs] = useState([])
    const [fetching, setFetching] = useState(false)
    const [connected, setConnected] = useState(false)
    const editor = useEditor()

    
    const isMetaMaskInstalled = () => {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    const MetaMaskClientCheck = () => {
        if (!isMetaMaskInstalled()) {
            setWallet(install_metamask_text)
        }
    };
    const getNfts = () => {
        setFetching(true)
        fetchNFTs(wallet)
        .then(nfts => setNFTs(nfts))
        .then(() => setFetching(false))
    }

    const addObject = React.useCallback(
        (item) => {
            const { media } = item

            // console.log(media)

            if(media.length > 0) {
                const nft = media[0]

                if (editor) {
                    const options = {
                        type: "StaticImage",
                        src: nft.gateway,
                        // src: nft.thumbnail
                    }

                    editor.objects.add(options)
                }
            }
        },
        [editor]
    )

    const onClickConnect = () => {
        try {
            MetaMaskClientCheck();
            ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(ethereum
                    .request({ method: 'eth_accounts' })
                    .then(accounts => {
                        if (accounts[0] === undefined ||accounts[0] === null ){
                            setWallet(connect_wallet_error_text)
                        }else{
                            localStorage.setItem("meta_contract_address", JSON.stringify(accounts[0]));
                            setConnected(true)
                            setWallet(accounts[0])
                        }
                    }));
        } catch (error) {
            console.error(error);
        }
    };
    //const onLogout = () => {
    //    try {
    //        const ttt = localStorage.setItem("meta_contract_address", JSON.stringify(false));
    //        setConnected(false)
            
    //    } catch (error) {
    //      console.error(error);
    //    }
    //};
    useEffect(() => {
        if (utils.isAddress(wallet)) {
            setWallet(wallet)
        }
    }, [wallet])

    useEffect(() => {
        // const wallet_with_nfts = '0x91b51c173a4bdaa1a60e234fc3f705a16d228740';
        if (utils.isAddress(wallet)) getNfts()
    }, [wallet])

    useEffect(() => {
        const saved = localStorage.getItem("meta_contract_address");
        if (saved === null || !saved ) {
            setConnected(false)
        }else{
            setConnected(true)
            setWallet(saved)
        }
    }, [])
    return (
       <Box>
            {
                true && (
                    <TapArea tapStyle="compress" onTap={onClickConnect} fullWidth={false}>
                        <Box display='flex' paddingX={4} paddingY={2} alignItems='center' color='lightWash' rounding={2}>
                            <Box>
                                <img
                                    src="https://opensea.io/static/images/logos/metamask-fox.svg"
                                    width={50}
                                    height={50}
                                />
                            </Box>
                            <Box width={20} />
                            <Box>
                                <Text weight='bold' size='400'>MetaMask</Text>
                                <Text size='200'>Connect to your MetaMask Wallet</Text>
                            </Box>
                        </Box>
                    </TapArea>
                )
            }
            
                <Box>
                    <Box paddingY={4}>
                        {/*<Text size="sm" color='light'>{connected ? wallet : null}</Text>*/}
                        {
                                wallet && (
                                    <Box>
                                        <Box height={20}/>
                                        <Box>
                                        </Box>
                                        {
                                            Array.isArray(nfts) && nfts.length > 0 ? (
                                            <Masonry>
                                                {
                                                nfts.map((item, index) => (
                                                    <Box
                                                        key={index}
                                                        column={6}
                                                        padding={1}
                                                    >
                                                    <TapArea onTap={() => addObject(item)}>
                                                        <Image
                                                            alt={item.title}
                                                            naturalHeight={1000}
                                                            naturalWidth={1000}
                                                            color="#fff"
                                                            src={item.media[0].gateway}
                                                        />
                                                    </TapArea>
                                                    </Box>
                                                ))
                                                }
                                            </Masonry>
                                            ) : <Text size="xl" color='light'>{fetching ? loading_nfts_text : wallet_empty_text}</Text>
                                        }
                                    </Box>
                                )
                            }
                    </Box>
                </Box>
          
       </Box>
    )
}

export default MetamaskWallet