import React from 'react'
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import Preview from './components/Preview'
import AssetLoading from './components/AssetLoading'
import ActiveObjectToolbox from './components/ActiveObjectToolbox'
import EditorContainer from "./components/EditorContainer"

function GraphicEditor(props) {
  const {
    params = {}
  } = props

  const { onHeaderComponent = () => {}, onSuccessCallback = () => {} } = params

  return (
    <>
      <EditorContainer>
        <Preview onSuccessCallback={onSuccessCallback} />
        <AssetLoading />

        <Panels />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Toolbox />
          <Canvas />
          <ActiveObjectToolbox />
          <Footer />
        </div>
      </EditorContainer>
    </>
  )
}

export default GraphicEditor
