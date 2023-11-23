import React, { useState, useEffect } from 'react'
import { fetchPacksWithParams, fetchPopularElements } from "../../../utils/services"
import { Box, Column, WashAnimated, Text, Mask, TapArea, Spinner } from 'gestalt'
import { TransformImage } from "geru-components"

const ElementItem = ({ element }) => {
    return (
        <Column span={4} key={element.url}>
            <WashAnimated>
                <Box padding={2} position='relative'>
                    <Mask>
                        <TransformImage 
                            url={element.url}
                        />
                    </Mask>
                </Box>
            </WashAnimated>
        </Column>
    )
}

const CollectionItem = (props) => {
    const { tags } = props
    const [fetching, setFetching] = useState(false)
    const [elements, setElements] = useState([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        getElements()
    }, [tags])

    const getElements = () => {
        let exts = ['png', 'jpeg', 'jpg', 'svg']

        // if(activeIndex == 1) {
        //   exts = ['png', 'jpeg', 'jpg']
        // }

        // if(activeIndex == 2) {
        //   exts = ['svg']
        // }

        // alert(JSON.stringify(exts))

        setFetching(true)
        fetchPacksWithParams({
          extensions: exts,
          q: String(tags),
          page: 1,
          limit: 6
        })
        .then(res => {
            if(res.data.code == 0) {
                setElements(res.data.result.docs)
                // if(page == 1) {
                //   setObjects(res.data.result.docs)
                // } else setObjects(objects.concat(res.data.result.docs))
              
                setTotal(res.data.result.total)
                // setPages(res.data.result.pages)
            }
        })
        .catch(err => console.log(err))
        .then(() => setFetching(false))
    }

    return (
        <Box column={6} padding={1}>
            <TapArea tapStyle="compress" onTap={props.onCollectionTap}>
                <Box color='dark' rounding={2} padding={1}>
                    <Box>
                        <Box display="flex" wrap>
                            {
                                fetching ? <Box height={100} /> : (
                                    elements.map((obj, index) => (
                                        <ElementItem
                                            element={obj}
                                            key={index}
                                        />
                                    ))
                                )
                            }
                        </Box>
                        <Box paddingX={1}>
                            <Text color='light' weight='bold'>{String(tags)}</Text>
                            <Text color="light" size="100">нийт: {total}</Text>
                        </Box>
                    </Box>
                </Box>
            </TapArea>
        </Box>
    )
}

const Collections = (props) => {
    // const grouped = [{
    //     tags: ["knit"]
    // }, {
    //     tags: ["cute"]
    // }, {
    //     tags: ["letter"]
    // }, {
    //     tags: ["цэцэг"]
    // }]

    const [fetching, setFetching] = useState(false)
    const [grouped, setGrouped] = useState([])

    useEffect(() => {
        getPopularTags()
    }, [])

    const getPopularTags = () => {
        setFetching(true)
        fetchPopularElements()
        .then(res => {
            if(res.data.code == 0) {
                setGrouped(res.data.grouped_tags)
            }
        })
        .catch(err => alert(err))
        .then(() => setFetching(false))
    }

    return (
        <Box>
            <Box paddingX={2} paddingY={3}>
                <Text color='light'>Санал болгох</Text>
            </Box>

            <Box display="flex" wrap paddingX={1}>
                {
                    fetching && (
                        <Spinner show={true} />
                    )
                }
                {
                    grouped.map((current, index) => (
                        <CollectionItem 
                            key={index}
                            tags={current.tags}
                            onCollectionTap={() => props.onCollectionTap(current)}
                        />
                    ))
                }
            </Box>
        </Box>
    )
}

export default Collections