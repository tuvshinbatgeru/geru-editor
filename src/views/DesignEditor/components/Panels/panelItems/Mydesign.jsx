import { useState, useEffect } from 'react'
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { IconButton, Text,Box, Flex,TapArea, Image, Link, Column} from "gestalt"
import { useMediaQuery } from 'react-responsive'
import {fetchTemplates, deleteTemplate } from "../../../utils/services"
import {HeaderText} from "geru-components"
import Masonry from 'react-masonry-component'
import useAppContext from "~/hooks/useAppContext"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { useEditor } from "@layerhub-io/react"
import { toast } from 'react-toastify'
export default function () {

    const { setCurrentScene, currentScene } = useDesignEditorContext()
    const [fetching, setFetching] = useState(false)
    const [templates, setTemplates] = useState([])
    const editor = useEditor()
    const { dimensions, setReferralTemplateId, setTemplateCollaborations } = useAppContext()
    const { width, height } = dimensions
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    useEffect(() => {
        getTemplates()
    }, [])
    
    const getTemplates = () => {
        setFetching(true)
        fetchTemplates()
        .then(res => {
            if(res.data.code == 0) {
                setTemplates(res.data.templates)
            }
        })
        .then(() => setFetching(false))
    }

    const handleLoadTemplate = async template => {
        let fonts = []

        template.editor_json.layers.forEach((object) => {
        if (object.type === "StaticText" || object.type === "DynamicText") {
            fonts.push({
              name: object.fontFamily,
              url: object.fontURL,
              options: { style: "normal", weight: 400 },
            })
          }
        })

        const filteredFonts = fonts.filter((f) => !!f.url)
        if (filteredFonts.length > 0) {
            await loadFonts(filteredFonts)
        }
    
        let tempWidth = template.editor_json.frame.width
        let tempHeight = template.editor_json.frame.height
       
        template.editor_json.frame.width = parseInt(tempWidth)
        template.editor_json.frame.height = parseInt(tempHeight)
    
        //setIsShowMobileModal(!isShowMobileModal)
        setReferralTemplateId(String(template._id))
        setTemplateCollaborations(template.collaborations)
        setCurrentScene({ ...template.editor_json, id: currentScene?.id })
        setIsShowMobileModal(false)
      }
    
      const loadFonts = fonts => {
            const promisesList = fonts.map(font => {
                // @ts-ignore
                return new FontFace(font.name, `url(${font.url})`, font.options).load().catch(err => err)
            })
            return new Promise((resolve, reject) => {
                Promise.all(promisesList)
                    .then(res => {
                        res.forEach(uniqueFont => {
                            // @ts-ignore
                            if (uniqueFont && uniqueFont.family) {
                            // @ts-ignore
                            document.fonts.add(uniqueFont)
                            resolve(true)
                        }
                    })
                 })
                .catch(err => reject(err))
            })
      }
    
      const onDelete = (id) => {
        let confirm = window.confirm('Template-г устгахдаа итгэлтэй байна уу?')
    
        if(confirm){
            deleteTemplate(id)
            .then(res => {
                if(res.data.code == 0){
                    getTemplates()
                    return toast.success('Template устгагдлаа.')
                }
            })
            .catch((err) => console.log(err))
        }
      }
    
    return (
        <>
            <Box display='flex' height="100%" direction='column'>
                <Scrollable>
                    <Box display='flex' alignItems='center' wrap paddingX={2} paddingY={2}>
                    {
                        templates.length == 0 && 
                            <Box paddingX={2} paddingY={6}>
                                    <Flex gap={12} direction='column'>
                                    <HeaderText color='white' align='center'>Одоогоор загвар үүсгээгүй байна</HeaderText>
                                    <Text color='light' align='center'>
                                    Таны загвараас худалдан авах бүрт 5% танд орлого болж орно
                                    </Text>
                                        {isTabletOrMobile ? 
                                            <Box color='dark' padding={2} justifyContent='center' alignItems='center'  >
                                                <IconButton 
                                                    icon="replace"
                                                    accessibilityLabel="save"
                                                    size="sm"
                                                    bgColor='red'
                                                /> 
                                            </Box>
                                        :<Box color='dark' padding={2} justifyContent='center' alignItems='center'  display='flex'>
                                            <IconButton 
                                                icon="download"
                                                accessibilityLabel="save"
                                                size="sm"
                                                bgColor='red'
                                            />
                                            <Box width={5} />
                                            <Text color='light' weight='bold' align='center' overflow='noWrap'>{"Save template"}</Text>
                                        </Box>}
                                    </Flex>
                            </Box>
                    }
                    {
                        (fetching && templates.length == 0) && (
                            [1, 2, 3, 4, 5, 6].map((index) => (
                            <Column span={4} key={index}>
                                <Box  padding={2}>
                                    <Box height={120} color='dark'></Box>
                                </Box>
                            </Column>
                            ))
                        )
                    }
                    </Box>
                    <Box paddingX={2}>
                        <Masonry
                            transitionDuration={400}
                            className={'my-gallery-class'} // default ''
                            //elementType={'ul'} // default 'div'
                            disableImagesLoaded={false} // default false
                            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                            // /imagesLoadedOptions={imagesLoadedOptions} // default {}
                        >
                        {
                            templates.map((template, index) => (
                                <Box column={6} key={index} padding={2}>
                                    {/*<TapArea onTap={() => handleLoadTemplate(template.editor_json)}>*/}
                                    <TapArea onTap={() => handleLoadTemplate(template)}>
                                    <Image
                                        alt="Template"
                                        color='transparent'
                                        naturalHeight={236 * (template.editor_json.frame.height / template.editor_json.frame.width)}
                                        naturalWidth={236}
                                        src={template.preview_url}
                                    />
                                    <div style={{ position: 'absolute', bottom: 6, display: 'flex', width: '100%', height: '40%' }}>
                                        <Box display='flex' width='100%' >
                                        <div style={{ backgroundImage: "linear-gradient(to bottom, rgba(27, 25, 39, 0), rgba(27, 25, 39, 1))", width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
                                            <Text color='light' align='center' size='200' weight='bold'>{template.name}</Text>
                                        </div>
                                        </Box>
                                    </div>
                                    </TapArea>
                                    <div style={{ position: 'absolute', top: 2, right: 2 }}>
                                        <IconButton 
                                            accessibilityLabel='icon'
                                            icon='clear'
                                            size='lg'
                                            onClick={() => onDelete(template._id)}
                                        />
                                    </div>
                                </Box>
                            ))
                        }
                        </Masonry>
                    </Box>
                </Scrollable>
                <Box display="flex" padding={3}>
                    <Link href="https://geru.mn/by-me/sell-on-geru" target="blank">
                        <Box color="dark" rounding={3} paddingX={3} paddingY={2}>
                            <Box display="flex" alignItems="center">
                                <Text color='light' weight="bold" size='400'>Sell on</Text>
                                <Box width={8} />
                                <Box height={28} width={28 * 2.58}>
                                    <Image 
                                    src="https://res.cloudinary.com/urlan/image/upload/v1654234524/static/geru_v4_white_qd1seb.png"
                                    naturalHeight={50}
                                    naturalWidth={129}
                                    alt="geru"
                                    />
                                </Box>
                            </Box>
                            <Text color='light' size='200'>Таны загвараас худалдан авах бүрт 5% танд орлого болж орно</Text>
                        </Box>
                    </Link>
                </Box>
            </Box>
        </>
    )
}
