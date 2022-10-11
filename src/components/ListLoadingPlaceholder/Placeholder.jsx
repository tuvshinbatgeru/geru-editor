import React from 'react'
import { Box, Flex } from 'gestalt'

const ListLoadingPlaceholder = () => {
    return (
        <Box paddingX={4}>
            <Flex gap={12} direction='column'>
                <Box>
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                    <Box color='dark' height={60} marginBottom={2} />
                </Box>
            </Flex>
        </Box>
    )
}

export default ListLoadingPlaceholder