import React, { useEffect, useState }  from 'react'
import axios from 'axios'
import { Box,  TapArea, Button, Text, Link,Card, Image} from 'gestalt'
import { HeaderText } from 'geru-components'
import {resolveToWalletAddress, getParsedNftAccountsByOwner,} from "@nfteyez/sol-rayz";
import InfiniteScroll from 'react-infinite-scroller'
import { useEditor } from "@layerhub-io/react"
import Masonry from 'react-masonry-component'
import { Scrollbars } from 'react-custom-scrollbars'
import { PublicKey, Transaction} from "@solana/web3.js";

const loading_nfts_text = 'Fetching NFTs...';
const wallet_empty_text = 'No nfts to display'
const PhantomWallet = () => {
    const editor = useEditor()
    const [nfts, setNFTs] = useState([])
    const [fetching, setFetching] = useState(false)
    const [provider, setProvider] = useState<PhantomProvider | undefined>(
        undefined
    );
    const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
        undefined
    );
    //const getNfts = async () => {
    //    setFetching(true)
    //    try {
    //        const address = walletKey;
          
    //        const publicAddress = await resolveToWalletAddress({
    //            text: address
    //        });
          
    //        const nftArray = await getParsedNftAccountsByOwner({
    //            publicAddress,
    //        });
    //        nftArray.map(async nft => {
    //            const solNFTs = await axios.get(nft.data.uri).then(res => {
    //                if(res) {
    //                   let nfts = {}
    //                   Object.assign(nfts, { 
    //                        name: res.data.name,
    //                        description: res.data.description,
    //                        image: res.data.image,
    //                    })
    //                    return nfts
    //                }
    //            });
    //            setNFTs(nfts => [...nfts, solNFTs] );
    //        })
    //      } catch (error) {
    //        console.log("Error thrown, while fetching NFTs", error.message);
    //      }
    //}
    const getProvider = (): PhantomProvider | undefined => {
        if ("solana" in window) {
            // @ts-ignore
            const provider = window.solana as any;
            if (provider.isPhantom) return provider as PhantomProvider;
        }
    };
    
    const connectWallet = async () => {
        // @ts-ignore
        const { solana } = window;

        if (solana) {
            try {
                const response = await solana.connect();
                //console.log("wallet account ", response.publicKey.toString());
                setWalletKey(response.publicKey.toString());
            } catch (err) {
            // { code: 4001, message: 'User rejected the request.' }
            }
        }
    };

    const disconnectWallet = async () => {
        // @ts-ignore
        const { solana } = window;

        if (walletKey && solana) {
            await (solana as PhantomProvider).disconnect();
            setWalletKey(undefined);
        }
    };

    const addImageToCanvas = item => {
        const options = {
            type: 'StaticImage',
            metadata: { 
                src: item.image
            },
        }
        editor.objects.add(options)
    }
    
    //// detect phantom provider exists
    //useEffect(() => {
    //    const provider = getProvider();
    //    if (provider) 
    //        setProvider(provider);
    //    else 
    //        setProvider(undefined);
    //}, []);
    //useEffect(() => {
    //   getNfts()
    //}, [walletKey])

   
    return (
        <Box borderStyle="sm" >
        <TapArea tapStyle="compress" onTap={connectWallet} fullWidth={true} >
            <Box display='flex'  padding={4}  borderStyle='shadow' alignItems='center'>
                <img
                    src="https://res.cloudinary.com/urlan/image/upload/v1660723953/geru-by-me/Logo/phantom_t9b870.png"
                    width={50}
                    height={50}
                />
                <Box width={20} />
                <HeaderText  size="xl" color='white'>Phantom</HeaderText> 
                <Box width={20} />
                {/*{provider && walletKey && (
                    <Box>
                        <HeaderText size='sm' color='white'>Connected </HeaderText>
                    </Box>
                )}*/}
            </Box>
            {/*<Box height='100%' paddingX={2}>
            {
                walletKey && nfts.length > 0 ? (
                    <Box >
                        {
                        nfts.map((item, index) => (
                            <Box
                                key={index}
                                column={6}
                                padding={2}
                            >
                                <HeaderText  size='md' color='white'> {item.name}</HeaderText>
                                <Box height={10}/>
                            <TapArea onTap={() => addImageToCanvas(item)}>
                                <Card>
                                <Image
                                    alt={item.image}
                                    naturalHeight={1}
                                    naturalWidth={1}
                                    color="#fff"
                                    src={item.image}
                                />
                                </Card>
                            </TapArea>
                            
                            </Box>
                        ))
                        }
                    </Box>
                ) : null
            }</Box>
            <Box/>*/}
            {/*</Scrollbars>*/}
            
            {/*<Box display='flex' paddingX={8} paddingY={2} color='blue' borderStyle='shadow' alignItems='center'>
                {!provider && (
                    <Box column={12}>
                        <Text color='light' inline weight="bold">
                            No provider found. Install 
                            <Link inline  href="https://phantom.app/"> 
                                The Phantom Browser extension
                            </Link>
                        </Text>
                    </Box>
                )}
            </Box>*/}
        </TapArea>
        </Box>
    )
}
type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
    | "connect"
    | "disconnect"
    | "signTransaction"
    | "signAllTransactions"
    | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
    publicKey: PublicKey | null;
    isConnected: boolean | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    signMessage: (
        message: Uint8Array | string,
        display?: DisplayEncoding
    ) => Promise<any>;
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export default PhantomWallet