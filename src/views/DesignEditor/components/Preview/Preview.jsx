import React from "react"
import { Text, Box, Spinner, FixedZIndex } from 'gestalt'
import useAppContext from "~/hooks/useAppContext"
import { useEditor } from "@layerhub-io/react"
import { resizeImage, AreaOfRectangle } from '~/views/DesignEditor/utils/helper'
import _cloneDeep from 'lodash/cloneDeep'

const Preview = (props) => {
  const { onSuccessCallback = () => {} } = props
  const editor = useEditor()
  const { isSaving, setIsSaving, backgroundColor, referral_template_id, template_collaborations } = useAppContext()
  if(!isSaving) return null

  const makePreview = React.useCallback(async () => {
    if (isSaving) {
        const template = editor.scene.exportToJSON()
        const { layers } = template
        const { width, height } = layers[0]
        let total_area = width * height

        let AFormatPriceTable = [{
            label: 'A5',
            value: 'A5',
            percentage: 0
        }, {
            label: 'A4',
            value: 'A4',
            percentage: 26
        }, {
            label: 'A3',
            value: 'A3',
            percentage: 51
        }]

        //
        let top = width
        let left = height
        let area_width = 0
        let area_height = 0

        // debugger
        
        layers.filter((layer) => layer.type != 'Background').forEach((layer) => {
            const layerLeft = layer.left >= 0 ? layer.left : 0
            const layerTop = layer.top >= 0 ? layer.top : 0

            if(layerLeft < left) left = layerLeft
            if(layerTop < top) top = layerTop

            area_width += (layer.width * layer.scaleX) + (layer.left >= 0 ? 0 : layer.left)
            area_height += (layer.height * layer.scaleY) + (layer.top >= 0 ? 0 : layer.top)
        })

        

        const total_artwork_area =  Math.ceil(AreaOfRectangle({
            top,
            left,
            width: area_width,
            height: area_height
        }, {
            top: 0,
            left: 0,
            width,
            height
        }))

        let percentage = Math.ceil((100 * total_artwork_area) / total_area)

        let formatRange = AFormatPriceTable.find((cur, index) => {
            if(index == AFormatPriceTable.length - 1) {
                return percentage >= cur.percentage
            }
            
            return percentage >= cur.percentage && percentage < AFormatPriceTable[index + 1].percentage
        })
        
        let rawTemplate = _cloneDeep(template)

        const is_different_background = template.layers.findIndex((layer) => {
            return layer.id == 'background' && String(layer.fill).toUpperCase() != String(`#${String(backgroundColor)}`).toUpperCase()
        })

        if(is_different_background == -1) {
            template.layers = template.layers.filter((layer) => layer.id != 'background')
        }
        
        const image = (await editor.renderer.render(template))
        const resized = await resizeImage(image, 1400, 1400)

        // alert(JSON.stringify(formatRange))

        // alert(referral_template_id)

        onSuccessCallback({
            image: resized,
            json: rawTemplate,
            formatRange,
            referral_template_id,
            template_collaborations
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
      </Box>
  )
}

export default Preview