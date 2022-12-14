import React from "react"
import { Box, Spinner, FixedZIndex } from 'gestalt'
import { HeaderText } from 'geru-components'
import useAppContext from "~/hooks/useAppContext"
import { useEditor } from "@layerhub-io/react"
import { resizeImage } from '~/views/DesignEditor/utils/helper'
import _cloneDeep from 'lodash/cloneDeep'

const Preview = (props) => {
  const { onSuccessCallback = () => {} } = props
  const editor = useEditor()
  const { isSaving, setIsSaving, backgroundColor } = useAppContext()
  if(!isSaving) return null

  const makePreview = React.useCallback(async () => {
    if (isSaving) {
        const template = editor.scene.exportToJSON()
        let rawTemplate = _cloneDeep(template)

        const is_different_background = template.layers.findIndex((layer) => {
            return layer.id == 'background' && String(layer.fill).toUpperCase() != String(`#${String(backgroundColor)}`).toUpperCase()
        })

        if(is_different_background == -1) {
            template.layers = template.layers.filter((layer) => layer.id != 'background')
        }
        
        const image = (await editor.renderer.render(template))
        const resized = await resizeImage(image, 1400, 1400)

        onSuccessCallback({
            image: resized,
            json: rawTemplate,
        })

        setIsSaving(false)
    }
  }, [isSaving])

  React.useEffect(() => {
    makePreview()
  }, [isSaving])

  const zIndex = new FixedZIndex(99)

  return (
      <Box position="absolute" left top height="100%" width="100%"
          zIndex={zIndex}
          display='flex'
          alignItems="center"
          direction='column'
          paddingX={4}
          justifyContent="center"
          dangerouslySetInlineStyle={{
              __style: {
                  backgroundColor:'rgba(0,0,30,0.4)',
                  backdropFilter: 'blur(10px)',
                  opacity: 1
              }
          }}
      >
          <HeaderText color='white' align='center'>
              Creating your work of art hold on a bit ...
          </HeaderText>
          <Box height={12} />
          <Box color='light' rounding='circle' padding={1}> 
              <Spinner accessibilityLabel='loading' show={true} />
          </Box>
      </Box>
  )
}

export default Preview