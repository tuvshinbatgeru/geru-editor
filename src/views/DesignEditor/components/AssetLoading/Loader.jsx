import React from 'react'
import { Box, FixedZIndex } from 'gestalt'
import { BallTriangle } from 'react-loader-spinner'
import useAppContext from "~/hooks/useAppContext"

const AssetLoading = () => {
    const { isAssetLoading } = useAppContext()
    const zIndex = new FixedZIndex(9999)

    if(!isAssetLoading) return null

    return (
        <Box
            position="absolute" 
            left 
            top 
            height="100%" 
            width="100%"
            zIndex={zIndex}
            display='flex'
            alignItems="center"
            justifyContent="center"
            dangerouslySetInlineStyle={{
                __style: {
                    backgroundColor:'rgba(0,0,30, 0.4)',
                    backdropFilter: 'blur(20px)',
                    opacity: 1,
                    display: 'flex',
                    alignItems: 'center'
                }
            }}
            paddingY={10}
        >
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="white"   
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </Box>
    )
}

export default AssetLoading