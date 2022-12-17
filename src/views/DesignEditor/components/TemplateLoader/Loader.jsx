import React from 'react'
import _cloneDeep from 'lodash/cloneDeep'
import _isEmpty from 'lodash/isEmpty'
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import useAppContext from '~/hooks/useAppContext'
import { useEditor } from "@layerhub-io/react"
import { Button } from 'gestalt'

const Loader = (props) => {
    const { setCurrentScene, currentScene, currentDesign, setCurrentDesign } = useDesignEditorContext()
    const { dimensions, backgroundColor } = useAppContext()
    const editor = useEditor()
    

    React.useEffect(() => {
        if(editor) {
            handleLoadTemplate()
        }
    }, [JSON.stringify(props.template), backgroundColor, dimensions])

    const handleLoadTemplate = async () => {
        let fonts = []

        // let template = {
        //     "id": "dC1JWDly7rSqI-0zqBib2",
        //     "name": "Untitled design",
        //     "layers": [
        //         {
        //             "shadow": null,
        //             "src": "https://res.cloudinary.com/urlan/image/upload/v1668497897/geru-by-me/stickers/BolGoy/bumkbsemacojcklxaslh.png",
        //             "width": 1080,
        //             "left": 119.9,
        //             "height": 1080,
        //             "cropX": 0,
        //             "cropY": 0,
        //             "opacity": 1,
        //             "flipX": false,
        //             "name": "StaticImage",
        //             "flipY": false,
        //             "scaleX": 1.17,
        //             "skewX": 0,
        //             "strokeWidth": 0,
        //             "scaleY": 1.17,
        //             "skewY": 0,
        //             "visible": true,
        //             "originX": "left",
        //             "angle": 0,
        //             "originY": "top",
        //             "top": -19.220000000000027,
        //             "stroke": null,
        //             "type": "StaticImage",
        //             "id": "SWmfqagdeEro8eZZWgkmj"
        //         }
        //     ],
        //     "frame": {
        //         "width": 1500,
        //         "height": 2120
        //     },
        //     "metadata": {
        //         "animated": false
        //     }
        // }

        let template = _cloneDeep(props.template)

        if(!_isEmpty(template)) {
            template.frame.width = dimensions.width
            template.frame.height = dimensions.height

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

            setCurrentScene({ ...template, id: currentScene?.id })
        } else {
            let layers = (currentScene && currentScene.layers) ? currentScene.layers : []
            
            layers.forEach((object) => {
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

            setCurrentScene({ ...currentScene, 
                id: currentScene?.id,
                layers,
                frame: {
                    width: parseInt(dimensions.width),
                    height: parseInt(dimensions.height),
                    backgroundColor,
                },
            })
        }
        
        editor.frame.setBackgroundColor(backgroundColor)
        editor.frame.resize({
            width: parseInt(dimensions.width),
            height: parseInt(dimensions.height),
        })
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