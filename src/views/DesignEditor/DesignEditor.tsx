import useEditorType from "~/hooks/useEditorType"
import GraphicEditor from "./GraphicEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Preview from "./components/Preview"
import ContextMenu from "./components/ContextMenu"

function DesignEditor() {
  const editorType = useEditorType()
  const { displayPreview, setDisplayPreview } = useDesignEditorContext()

  return (
    <>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}
      
      {/* {
        {
          NONE: <SelectEditor />,
          PRESENTATION: <PresentationEditor />,
          VIDEO: <VideoEditor />,
          GRAPHIC: <GraphicEditor />,
        }[editorType]
      } */}

      <GraphicEditor />
    </>
  )
}

export default DesignEditor
