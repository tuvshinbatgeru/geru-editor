import React from 'react'
import { Box, TapArea, Text } from 'gestalt'
import { motion } from 'framer-motion'

const Tab = (props) => {
    const { tab, index, activeTabIndex } = props

    const selected = index == activeTabIndex

    return (
        <Box paddingX={1} position='relative' paddingY={2}>
            <TapArea tapStyle='compress' onTap={props.onChange}>
                <Box paddingX={4} paddingY={1} rounding={2}>
                    <Text color='light' weight={selected ? "bold" : "normal"}>{tab.text}</Text>
                </Box>
            </TapArea>

            {
                selected && (
                    <motion.div layoutId="underline" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '30%',
                        right: '30%',
                        height: 2,
                        background: "#CD1E3B",
                    }}></motion.div>
                )
            }
        </Box>
    )
}

const Tabs = (props) => {
    const {
        activeTabIndex,
        tabs
    } = props
    // activeTabIndex={activeIndex}
    //                 onChange={({ activeTabIndex, event }) => {
    //                   event.preventDefault();
    //                   setActiveIndex(activeTabIndex);
    //                 }}
    //                 // bgColor="transparent"
    //                 tabs={[

    return (
        <Box display='flex' position='relative'>
            {
                tabs.map((tab, index) => (
                    <Tab 
                        key={index}
                        index={index}
                        activeTabIndex={activeTabIndex}
                        tab={tab}
                        onChange={() => {
                            props.onChange({ activeTabIndex: index })
                        }}
                    />
                ))
            }
        </Box>
    )
}

export default Tabs