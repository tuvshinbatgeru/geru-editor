import React from "react"
import useDesignEditorPages from "~/hooks/useDesignEditorScenes"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import { nanoid } from "nanoid"
import { getDefaultTemplate } from "~/constants/design-editor"
import { useEditor } from "@layerhub-io/react"
import { IScene } from "@layerhub-io/types"

export default function () {
  const scenes = useDesignEditorPages()
  const { setScenes, setCurrentScene, currentScene, setCurrentDesign, currentDesign } = React.useContext(DesignEditorContext)
  const editor = useEditor()

  // React.useEffect(() => {
  //   if (editor && scenes && currentScene) {
  //     const isCurrentSceneLoaded = scenes.find((s) => s.id === currentScene?.id)
  //     if (!isCurrentSceneLoaded) {
  //       setCurrentScene(scenes[0])
  //     }
  //   }
  // }, [editor, scenes, currentScene])

  React.useEffect(() => {
    if (editor) {
      if (currentScene) {
        updateCurrentScene(currentScene)
      } else {
        const defaultTemplate = getDefaultTemplate({
          width: 1200,
          height: 1200,
        })
        setCurrentDesign({
          id: nanoid(),
          frame: defaultTemplate.frame,
          metadata: {},
          name: "Untitled Design",
          preview: "",
          scenes: [],
          type: "GRAPHIC",
        })
        editor.scene
          .importFromJSON(defaultTemplate)
          .then(() => {
            const initialDesign = editor.scene.exportToJSON() as any
            editor.renderer.render(initialDesign).then((data) => {
              setCurrentScene({ ...initialDesign, preview: data })
              setScenes([{ ...initialDesign, preview: data }])
            })
          })
          .catch(console.log)
      }
    }
  }, [editor, currentScene])

  const updateCurrentScene = React.useCallback(
    async (design: IScene) => {
      await editor.scene.importFromJSON(design)
    },
    [editor, currentScene]
  )

  // const addScene = React.useCallback(async () => {
  //   setCurrentPreview("")

  //   const updatedTemplate = editor.scene.exportToJSON()
  //   const updatedPreview = await editor.renderer.render(updatedTemplate)

  //   const updatedPages = scenes.map((p) => {
  //     if (p.id === updatedTemplate.id) {
  //       return { ...updatedTemplate, preview: updatedPreview }
  //     }
  //     return p
  //   })

  //   const defaultTemplate = getDefaultTemplate(currentDesign.frame)
  //   const newPreview = await editor.renderer.render(defaultTemplate)
  //   const newPage = { ...defaultTemplate, id: nanoid(), preview: newPreview } as any
  //   const newPages = [...updatedPages, newPage] as any[]
  //   setScenes(newPages)
  //   setCurrentScene(newPage)
  // }, [scenes, currentDesign])

  // const changePage = React.useCallback(
  //   async (page: any) => {
  //     setCurrentPreview("")
  //     if (editor) {
  //       const updatedTemplate = editor.scene.exportToJSON()
  //       const updatedPreview = await editor.renderer.render(updatedTemplate)

  //       const updatedPages = scenes.map((p) => {
  //         if (p.id === updatedTemplate.id) {
  //           return { ...updatedTemplate, preview: updatedPreview }
  //         }
  //         return p
  //       }) as any[]

  //       setScenes(updatedPages)
  //       setCurrentScene(page)
  //     }
  //   },
  //   [editor, scenes, currentScene]
  // )

  return null
}
