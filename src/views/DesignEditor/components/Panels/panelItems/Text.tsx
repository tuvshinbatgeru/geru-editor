import React from "react"
import { useEditor } from "@layerhub-io/react"
import { FontItem } from "~/interfaces/common"
import { loadFonts } from "~/utils/fonts"
import { IStaticText } from "@layerhub-io/types"
import { nanoid } from "nanoid"
import { Block } from "baseui/block"

import Scrollable from "~/components/Scrollable"
import ListLoadingPlaceholder from '~/components/ListLoadingPlaceholder'

import { TapArea, Box } from "gestalt"
import useAppContext from "~/hooks/useAppContext"

export default function () {
  const editor = useEditor()
  const [fetching, setFetching] = React.useState(false)
  const [commonFonts, setCommonFonts] = React.useState<any[]>([])
  const { fonts } = useAppContext()

  React.useEffect(() => {
    fetchFonts()
  }, [fonts])

  const fetchFonts = async () => {
    if(fonts.length == 0) return
    setFetching(true)
    await loadFonts(fonts)
    setCommonFonts(fonts)
    setFetching(false)
  } 

  const AddNewFonts = async (font) => {
    if (editor) {
      const new_font: FontItem = {
        name: font.postscript_name,
        url: font.url,
      }

      await loadFonts([new_font])

      const options = {
        id: nanoid(),
        type: "StaticText",
        width: 420,
        text: "Add Text",
        fontSize: 92,
        fontFamily: font.postscript_name,
        textAlign: "center",
        fontStyle: "normal",
        fontURL: font.url,
        fill: "#000",
        metadata: {},
      }
      editor.objects.add<IStaticText>(options)
    }
  }
  
  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Scrollable>
        <div style={{
            display: 'grid',
            gap: '0.5rem',
           
          }}>
            { fetching && <ListLoadingPlaceholder /> }

            {commonFonts.map(font => (
              <TapArea key={font.name} tapStyle="compress" onTap={() => AddNewFonts(font)}>
                <Box paddingX={4} smPaddingX={4} mdPaddingX={4} lgPaddingX={4} >
                  <Box padding={2} borderStyle='sm'>
                     <div style={{
                        display: 'flex',
                        paddingLeft: '1rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        fontSize: '20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontFamily: font.postscript_name
                    }}>
                      <span style={{ color: "#fff" }}>{font.postscript_name}</span>
                    </div>
                  </Box>
                </Box>
              </TapArea>
            ))}
          </div>
      </Scrollable>
    </Block>
  )
}