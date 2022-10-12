import React from 'react'
import _cloneDeep from 'lodash/cloneDeep'
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

const Loader = (props) => {
    const { setCurrentScene, currentScene } = useDesignEditorContext()

    React.useEffect(() => {
        handleLoadTemplate(props.template)
    }, [])

    const handleLoadTemplate = async (temp) => {
        let fonts = []

        const template = _cloneDeep(temp)

        template.layers.forEach((object) => {
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
    
        let tempWidth = template.frame.width
        let tempHeight = template.frame.height
       
        template.frame.width = parseInt(tempWidth)
        template.frame.height = parseInt(tempHeight)
    
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