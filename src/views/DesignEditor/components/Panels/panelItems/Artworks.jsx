import React, { useState, useEffect} from "react"
import useAppContext from "~/hooks/useAppContext"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { Scrollbars } from 'react-custom-scrollbars'
import InfiniteScroll from 'react-infinite-scroller'
import Cookies from 'js-cookie'
import Masonry from 'react-masonry-component'
import { useEditor } from "@layerhub-io/react"
import { nanoid } from "nanoid"
import { useMediaQuery } from 'react-responsive'
import { Box, Card, TapArea,Icon, Spinner ,Text,FixedZIndex, Image as GestaltImage, RadioButton, Sheet, Layer, Button,Heading, RadioGroup} from 'gestalt'
import { TransformImage ,HeaderText} from 'geru-components'
import { fetchUserUploads, fileUpload, fetchArtworks , fetchSuggestedTopics} from "~/views/DesignEditor/utils/services"
import { getImageDimensions } from '../../../utils/helper'
import _isEmpty from 'lodash/isEmpty'
import { BallTriangle } from  'react-loader-spinner'

const Image = (props) => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const { photo, addImageToCanvas = () => {} } = props

    return (
        <Box 
            column={isTabletOrMobile ? 4 : 6}
            padding={2}
            //paddingY={4}
            borderStyle={"raisedTopShadow"}
        >
            <TapArea onTap={() => addImageToCanvas(photo.cover_url)}>
                <div style={{
                    background: photo.tg
                }}>
                    <TransformImage 
                        url={photo.cover_url}
                        width={300}
                        height={Math.ceil(photo.ratio * 300)}
                    />
                </div>
                {/* <GestaltImage
                    src={photo.medium_cover_url}
                    naturalWidth={1800}
                    naturalHeight={width}
                /> */}
                         
          <div style={{ position: 'absolute', bottom: 7, display: 'flex', width: '100%', height: '40%' }}>
            <Box display='flex' width='100%' >
              <div style={{ 
                    backgroundImage: "linear-gradient(to bottom, rgba(27, 25, 39, 0), rgba(27, 25, 39, 1))", 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'end' }}>
                <Text color='light' align='center' size="300" weight='bold'>{"15$"}</Text>
              </div>
            </Box>
          </div>
            </TapArea>
        </Box>
    )
}

export default function () {
    const { backgroundRemove} = useAppContext()
    const [artworks, setArtworks] = React.useState([])
    const editor = useEditor()
    const [queueSearch, setQueueSearch] = useState("latest");
    const [typeSearch, setTypeSearch] = useState("all");
    const [topicSearch, setTopicSearch] = useState('');
    const selected = {
        value: 'latest',
        label:  'recommended' ? "Санал болгох" : "Сүүлд нэмэгдсэн",
    }
    
    const { setIsShowMobileModal, dimensions } = useAppContext()
    const [is_open_mobile_filter, setIsOpenMobileFilter] = useState(false)
    const [addImageLoader, setAddImageLoader] = useState(false)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [fetching, setFetching] = useState(false)
    const [topics, setTopics] = useState([])
    //const { user_id } = //{props}
    React.useEffect(() => {
        getArtworks()
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
        }, [queueSearch,typeSearch,topicSearch])

    useEffect(() => {
        getTopics()
    }, [])

    const getTopics = () => {
        fetchSuggestedTopics()
        .then(res => {
            if(res.data.code == 0)
                setTopics(res.data.topics)
        })
        .catch(err => alert(err))
    }
    const getArtworks = () => {
        setFetching(true)
        let topic_slug_ = topicSearch.replace(/\s/gm, '').toLowerCase();
        fetchArtworks({
            page,
            limit: 30,
            sort: queueSearch,
            artwork_type: typeSearch === 'all' ? '' : typeSearch,
            topic_slug:   topic_slug_ ? topic_slug_ : ''
        })
        .then(res => {
            if(res.data.code == 0) {
                setArtworks(res.data.result.docs)
            }
        })
        .catch((err) => alert(err))
        .then(() => setFetching(false))
    }

    const onLoadMore = () => {
        let nextPage = page + 1
        if(fetching || pages < nextPage) return
        setFetching(true)
        setPage(nextPage)
    }


    const addImageToCanvas = async (url) => {
        let adjustScale = 1
        setAddImageLoader(true)
        const recommendedSize = Math.ceil(dimensions.height / 2)
        const { height } = await getImageDimensions(url)

        adjustScale = recommendedSize / height
        
        const options = {
            type: "StaticImage",
            src: url,
            scaleX: adjustScale,
            scaleY: adjustScale
        }

        editor.objects.add(options)
        setIsShowMobileModal(false)
        setAddImageLoader(false)
    }
    const zIndex = new FixedZIndex(2)
    const FilterTrigger ={}
    const renderMobileFilter = () => {
        return (
            //<Wrapper>
                <Box paddingX={10}>
                    <Box>
                        <Box>
                            <Box marginBottom={3}>
                                <Heading size='sm'>Эрэмбэ дараалал</Heading>
                            </Box>
                            <Box>
                            {
                                [{
                                    value: 'recommended',
                                    label: 'Санал болгох',
                                }, {
                                    value: 'latest',
                                    label: 'Сүүлд нэмэгдсэн',
                                }].map((type, index) => (
                                    <Box paddingY={2} key={index}>
                                        <RadioGroup id="queue">
                                            <RadioGroup.RadioButton
                                                checked={String(queueSearch) === String(type.value)}
                                                id={`queue_${index}`}
                                                label={type.label}
                                                name={type.value}
                                                onChange={() => setQueueSearch(type.value)}
                                                value={String(type.value)}
                                            />
                                        </RadioGroup>
                                    </Box>
                                ))
                            }
                            </Box>
                        </Box>
                    </Box>
                    <Box height={1} color='lightGray'/>
                    <Box paddingY={2}>
                        <Box>
                            <Box paddingY={3}>
                                <Heading size='sm'>Төрлөөр шүүх</Heading>
                            </Box>
                            <Box>
                            {
                                [{
                                    value: "all",
                                    label: "Бүгд"
                                }, {
                                    value: "digital_art",
                                    label: "Дижитал арт"
                                }, {
                                    value: "photography",
                                    label: "Гэрэл зураг"
                                }, {
                                    value: "graphic_design",
                                    label: "График дизайн"
                                }].map((type, index) => (
                                    <Box paddingY={2} key={index}>
                                        <RadioGroup id="type">
                                            <RadioGroup.RadioButton
                                                checked={String(typeSearch) === String(type.value)}
                                                id={`type_${index}`}
                                                label={type.label}
                                                name={type.value}
                                                onChange={() => setTypeSearch(type.value)}
                                                value={String(type.value)}
                                            />
                                        </RadioGroup>
                                    </Box>
                                ))
                            }
                            </Box>
                        </Box>
                    </Box>
                    <Box height={1} color='lightGray'/>
                    <Box paddingY={2}>
                        <Box>
                            <Box paddingY={3}>
                                <Heading size='sm'>Сэдвээр шүүх</Heading>
                            </Box>
                            <Box>
                            {
                                topics.map((topic, index) => (
                                    <Box paddingY={2} key={index}>
                                        <RadioGroup id="topicsss">
                                            <RadioGroup.RadioButton
                                                checked={String(topicSearch) === String(topic.title_en)}
                                                id={`topicsss_${index}`}
                                                label={_isEmpty(topic) ? "Бүгд" : topic.title}
                                                name={topic.title}
                                                onChange={() => setTopicSearch(topic.title_en)}
                                                value={String(topic.title)}
                                            />
                                        </RadioGroup>
                                    </Box>
                                ))
                            }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            //</Wrapper>
        )
    }

    const HEADER_ZINDEX = new FixedZIndex(9999)
    return (
        <Box display="flex"  height="100%" direction="column" width="100%" >
          
            <Box display='flex' justifyContent='center' paddingY={4} paddingX={4} >
                <TapArea tapStyle="compress" onTap={() => setIsOpenMobileFilter(true)} fullWidth >
                    <Box color='light' borderStyle='shadow' paddingY={4} height={48} paddingX={4} rounding={8} display='flex' alignItems='center'>
                        <Text justifyContent='center' alignItems='center' color="dark" weight='bold'>Filter</Text>

                        <Box width={8} />

                        <Icon 
                            icon="filter"
                            color='white'
                            size={12}
                        />
                    </Box>
                </TapArea>
            
            </Box>
            
        {
            backgroundRemove && (
                <Box 
                    position="absolute" 
                    left top height="100%" width="100%"
                    zIndex={zIndex}
                    display='flex'
                    alignItems="center"
                    direction='column'
                    justifyContent="center"
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor:'rgba(0,0,30,0.4)',
                            backdropFilter: 'blur(10px)',
                            opacity: 1
                        }
                    }}
                    >
                    <HeaderText color='white'>
                        Syncing new images ...
                    </HeaderText>
                    <Box height={12} />
                    <Box color='white' rounding='circle' padding={1}> 
                        <Spinner accessibilityLabel='loading' show={true} />
                    </Box>
                </Box>
            )
        }
        {
            addImageLoader && (
                <Box 
                    position="absolute" 
                    left top height="100%" width="100%"
                    zIndex={zIndex}
                    display='flex'
                    alignItems="center"
                    direction='column'
                    justifyContent="center"
                    dangerouslySetInlineStyle={{
                        __style: {
                            backgroundColor:'rgba(0,0,30,0.4)',
                            backdropFilter: 'blur(20px)',
                            opacity: 1
                        }
                    }}
                    >
                    <Box height={12} />
                    <Box> 
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
                </Box>
            )
        }
        <Box height='100%' paddingX={2} >
            <Scrollbars>
                <InfiniteScroll
                    // loader={getLoaderElement()}
                    loadMore={onLoadMore}
                    hasMore={true}
                    threshold={1000}
                    useWindow={false}>
                    <Masonry
                        // key={1}
                        // className={'my-gallery-class'} // default ''
                        disableImagesLoaded={true}
                        updateOnEachImageLoad={true} 
                        >
                        {
                            artworks.map((artwork, index) => (
                                
                                <Image 
                                    photo={artwork}
                                    key={index}
                                    //src={artwork.medium_cover_url}
                                    addImageToCanvas={(url) => addImageToCanvas(url)}
                                />
                            ))
                        }
                    </Masonry>
                </InfiniteScroll>
                <Spinner show={fetching} accessibilityLabel="Loading" />
            </Scrollbars>
        </Box>
        {
                is_open_mobile_filter && (
                    <Layer zIndex={HEADER_ZINDEX}>
                        <Sheet
                            accessibilityDismissButtonLabel="Dismiss"
                            accessibilitySheetLabel="Example sheet to demonstrate different sizes"
                            footer={
                                <Box display='flex'>
                                    {/*<Link 
                                        route={'/discover/artwork'}
                                        href={'/discover/artwork'}
                                    >
                                        <Button fullWidth text='Цэвэрлэх' />
                                    </Link>*/}
                                <Box width={20} />
                                    <Button fullWidth text='Болсон' color='red' onClick={() => setIsOpenMobileFilter(false)}/>
                                </Box>
                            }
                            onDismiss={() => setIsOpenMobileFilter(false)}
                            size="sm"
                        >
                            { renderMobileFilter() }
                        </Sheet>
                    </Layer>
                )
            }
        </Box>
    )

}
