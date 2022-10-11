import GraphicEditor from "./GraphicEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Preview from "./components/Preview"

function DesignEditor(props) {
  const { displayPreview, setDisplayPreview } = useDesignEditorContext()

  return (
    <>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}
      <GraphicEditor {...props} />
    </>
  )
}

export default DesignEditor
