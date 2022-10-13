import React from 'react'
import _cloneDeep from 'lodash/cloneDeep'
import _isEmpty from 'lodash/isEmpty'
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import useAppContext from '~/hooks/useAppContext'
import { useEditor } from "@layerhub-io/react"
import { Button } from 'gestalt'

const Loader = (props) => {
    const { setCurrentScene, currentScene } = useDesignEditorContext()
    const { dimensions, backgroundColor } = useAppContext()
    const editor = useEditor()

    React.useEffect(() => {
        if(editor && !_isEmpty(props.template)) {
            handleLoadTemplate()
        }
    }, [JSON.stringify(props.template), backgroundColor, dimensions])

    const handleLoadTemplate = async () => {
        let fonts = []

        const template = _cloneDeep(props.template)

        template.layers.forEach((object) => {
            if (object.type === "StaticText" || object.type === "DynamicText") {
                fonts.push({
                    name: object.fontFamily,
                    url: object.fontURL,
                    options: { style: "normal", weight: 400 },
                })
            }

            if(object.type === 'Background') {
                object.fill = `#${backgroundColor}`
                object.width = dimensions.width
                object.height = dimensions.height
                object.left = 0
                object.top = 0
            }
        })
    
        const filteredFonts = fonts.filter((f) => !!f.url)

        if (filteredFonts.length > 0) {
            await loadFonts(filteredFonts)
        }

        editor.frame.resize({
            width: parseInt(template.frame.width),
            height: parseInt(template.frame.height),
        })

        setCurrentScene({ ...template, id: currentScene?.id })
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

    return null
}

export default Loader