import React from "react"
import { useEditor } from "@layerhub-io/react"
import { Box, TapArea, Icon, Text, Spinner, FixedZIndex ,Modal, Layer , TextField} from 'gestalt'
import { HeaderText } from 'geru-components'
import useAppContext from "~/hooks/useAppContext"
import { resizeImage } from '~/views/DesignEditor/utils/helper'
import {uploadTemporaryArtwork, saveTemplate} from "../../utils/services"
import { request, cloudFront } from "~/services/S3"
import _isEmpty from 'lodash/isEmpty'
import { toast } from 'react-toastify'
import useDesignEditorPages from "~/hooks/useDesignEditorScenes"

export default function (props) {
    const scenes = useDesignEditorPages()
    const { setIsSaving, params } = useAppContext()
    const { has_save_template = true, hasMultiScenes = false } = params
    const editor = useEditor()
    const [templateName, setTemplateName] = React.useState("")

    const [fetching, setFetching] = React.useState(false)
    const [public_id, setPublicId] = React.useState(`test${Math.floor(Math.random() * 100)}`)
    const [templateModal, setTemplateModal] = React.useState(false)
    const zIndex = new FixedZIndex(99)

    const makeDownloadTemplate = async () => {
        if(hasMultiScenes) {
            params.onSuccessCallback({
                scenes
            })
            return
        }
        setIsSaving(true)
    }

    const onSaveTemplate = async () => {
        if(templateName.length == 0 || templateName.length === null ) {
            toast.warning('Та template-ийнхаа нэрийг оруулна уу?')
            return true
        }
        const template = editor.scene.exportToJSON()
        template.layers = template.layers.filter((layer) => layer.id != 'background')

        const image = (await editor.renderer.render(template)) as string

        
        const resized = await resizeImage(image) as URL
        const pId = `template_${Math.floor(Math.random() * 100)}_${Math.floor(Math.random() * 100000)}`
        setPublicId(pId)
        setFetching(true)

        fetch(resized)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], pId + ".png", { type: "image/png" })

            request({ 
                dirName: "geru-by-me/template/preview",
                accessKeyId: params.accessKeyId,
                secretAccessKey: params.secretAccessKey,
            }).uploadFile(file, pId)
            .then(res => {
                setFetching(true)
                saveTemplate({
                    editor_json: template,
                    preview_url: cloudFront(res.location),
                    name: templateName,
                    customization: params.customization,
                    area_name: params.area_name,
                    selected_variation: params.selected_variation,
                    lookup_id: params.lookup_id,
                    product_title: params.product_title,
                    color: params.color
                })
                .then(res => {
                    if(res.data.code != 0) {
                        alert(res.data.errors[0].msg)
                    }
                    if(res.data.code == 0) {
                        toast.success('Амжилттай хадгаллаа')
                        setTemplateModal(!templateModal)
                    }
                })
                .catch(err => alert(err))
                .then(() => {
                    setFetching(false) 
                    setTemplateName("")
                })
            })
            .catch(err => alert(err))
            .then(() => setFetching(false))
        })
    }
    return (
        <Box display="flex" justifyContent="end" alignItems="center" paddingX={2} mdPaddingX={6} color='light' paddingY={2}>
            {
                has_save_template && <>
                    <TapArea tapStyle="compress" fullWidth={false} onTap={() => setTemplateModal(!templateModal)}>
                        <Box color='dark' paddingY={2} paddingX={4} justifyContent='center' alignItems='center'  display='flex'>
                            <Icon 
                                icon="download"
                                accessibilityLabel="save"
                                size={16}
                                color='light'
                            />
                            <Box width={8} />
                            {/* <HeaderText size='md' whiteSpace='nowrap' color='white'>{fetching ? "Saving ..." : "Save template"}</HeaderText> */}
                            <Text color='light' weight="bold" overflow="noWrap">{fetching ? "Уншиж байна ..." : "Загвар хадгалах"}</Text>
                        </Box>
                    </TapArea>
                    <Box width={8} />
                </>
            }
            
            <TapArea tapStyle="compress" fullWidth={false} onTap={makeDownloadTemplate}>
                <Box color='primary' paddingY={2} paddingX={4} justifyContent='center' alignItems='center' display='flex'>
                    <Icon 
                        icon="check-circle"
                        accessibilityLabel="save"
                        size={16}
                        color='light'
                    />
                    <Box width={8} />
                    <Text color='light' weight="bold" overflow="noWrap">Хадгалах</Text>
                </Box>
            </TapArea>
            
            {
                templateModal && (
                    <Layer zIndex={zIndex}>
                        <Modal
                            accessibilityModalLabel='template Modal'
                            onDismiss={() => setTemplateModal(!templateModal)}
                        >
                            <Box padding={4} >
                                <HeaderText align='center' weight='bold'>Загвар хадгалах</HeaderText>
                                <Box height={20} />
                                <TextField
                                    id="template input"
                                    placeholder='нэр оруулах'
                                    onChange={({value}) => setTemplateName(value)}
                                />

                                <Box direction='row' display='flex' paddingY={4}>
                                    <TapArea onTap={() => setTemplateModal(!templateModal)}>
                                        <Box color='dark' padding={4}>
                                            <HeaderText align='center' size="md" color='white' weight='bold'>Хаах</HeaderText>
                                        </Box>
                                    </TapArea>
                                    <Box width={30} />
                                    <TapArea onTap={onSaveTemplate}>
                                        <Box color='errorBase' padding={4}>
                                            <HeaderText align='center' size="md"  color='white' weight='bold'>Хадгалах</HeaderText>
                                        </Box>
                                    </TapArea>
                                </Box>
                            </Box>
                        </Modal>
                    </Layer>
                )
            }
            {
                fetching && (
                    <Layer zIndex={zIndex}>
                        <Modal
                            accessibilityModalLabel='template Modal'
                            onDismiss={() => {}}
                            size="lg"
                        >
                            <Box 
                                position="relative" 
                                zIndex={zIndex}
                                display='flex'
                                direction='column'
                                paddingY={10}
                                alignItems="center"
                                dangerouslySetInlineStyle={{
                                    __style: {
                                        backgroundColor:'black',
                                        backdropFilter: 'blur(20px)',
                                        opacity: 2
                                    }
                                }}> 
                                <HeaderText color='white'>
                                    Saving your template as 
                                </HeaderText>
                                <Box height={20} />
                                <HeaderText color='red'>
                                    {templateName}
                                </HeaderText>
                                <Box height={20} />
                                <Box color='light' rounding='circle' padding={1}> 
                                    <Spinner accessibilityLabel='loading' show={true} />
                                </Box>
                            </Box>
                        </Modal>
                    </Layer>
                )
            }
        </Box>
    )
}
