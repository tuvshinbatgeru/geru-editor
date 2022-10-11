import React from "react"
import { useEditor } from "@layerhub-io/react"
import { Box, TapArea, Icon, Text, Spinner, FixedZIndex } from 'gestalt'
import { HeaderText } from 'geru-components'
import { resizeImage } from '~/views/DesignEditor/utils/helper'

export default function () {
  const editor = useEditor()
  const [is_saving, setIsSaving] = React.useState(false)
  const fetching = false

  const zIndex = new FixedZIndex(99)

  const makeDownloadTemplate = async () => {
    const template = editor.scene.exportToJSON()
    template.layers = template.layers.filter((layer) => layer.id != 'background')

    const image = (await editor.renderer.render(template)) as string

    const resized = (await resizeImage(image, 1000, 1000)) as string

    const a = document.createElement("a")
    // a.href = image
    a.href = resized
    
    a.download = "image.png"
    a.click()
  }

  return (
    // @ts-ignore
    <Box width='100%' display="flex" justifyContent="end" alignItems="center" paddingX={6}>
          <TapArea tapStyle="compress" fullWidth={false}>
              <Box color='dark' paddingY={2} paddingX={4} justifyContent='center' alignItems='center'  display='flex'>
                <Icon 
                    icon="download"
                    accessibilityLabel="save"
                    size={16}
                    color='light'
                    // bgColor="darkGray"
                />
                <Box width={8} />
                <Text color='light' weight='bold' align='center' overflow='noWrap'>{fetching ? "Saving ..." : "Save template"}</Text>
              </Box>
          </TapArea>
          <Box width={8} />
          <TapArea tapStyle="compress" fullWidth={false} onTap={makeDownloadTemplate}>
              <Box color='primary' paddingY={2} paddingX={4} justifyContent='center' alignItems='center' display='flex'>
                  <Icon 
                      icon="check-circle"
                      accessibilityLabel="save"
                      size={16}
                      color='light'
                      // size={}
                  />
                  <Box width={8} />
                  <Text color='light' weight='bold' align='center'>Done</Text>
              </Box>
          </TapArea>
          
          {
            is_saving && (
              <Box position="absolute" left top height="100%" width="100%"
                  zIndex={zIndex}
                  display='flex'
                  alignItems="center"
                  direction='column'
                  justifyContent="center"
                  dangerouslySetInlineStyle={{
                      __style: {
                          backgroundColor:'rgba(0,0,30,0.4)',
                          backdropFilter: 'blur(10px)',
                          opacity: 1
                      }
                  }}
              >
                <HeaderText color='white'>
                    Creating your work of art hold on a bit ...
                </HeaderText>
                <Box height={12} />
                <Box color='light' rounding='circle' padding={1}> 
                    <Spinner accessibilityLabel='loading' show={true} />
                </Box>
              </Box>
            )
          }
    </Box>
  )
}
