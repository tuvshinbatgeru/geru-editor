import React from "react"
import ArrowBackOutline from "~/components/Icons/ArrowBackOutline"
import Search from "~/components/Icons/Search"
import { Input, SIZE } from "baseui/input"
import useAppContext from "~/hooks/useAppContext"
import { useStyletron } from "baseui"
import { IStaticText } from "@layerhub-io/types"
import { useEditor } from "@layerhub-io/react"
import { loadFonts } from "~/utils/fonts"
import { SAMPLE_FONTS } from "~/constants/editor"
import { groupBy } from "lodash"
import Scrollable from "~/components/Scrollable"
import { Block } from "baseui/block"
import {TapArea, Box} from "gestalt"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { nanoid } from "nanoid"
import { FontItem } from "~/interfaces/common"
import { colors } from 'geru-components/dist/utils'
export default function () {
  const [query, setQuery] = React.useState("")
  const { setActiveSubMenu } = useAppContext()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const [commonFonts, setCommonFonts] = React.useState<any[]>([])
  const [css] = useStyletron()
  const editor = useEditor()
  
  const addObject = async () => {
    if (editor) {
      const font: FontItem = {
        name: "OpenSans-Regular",
        url: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf",
      }

      await loadFonts([font])
      
      const options = {
        id: nanoid(),
        type: "StaticText",
        width: 420,
        text: "Add some text",
        fontSize: 92,
        fontFamily: font.name,
        textAlign: "center",
        fontStyle: "normal",
        fontURL: font.url,
        fill: "#333333",
        metadata: {},
      }
      
      editor.objects.add(options)
    }
  }
  
  React.useEffect(() => {
    const grouped = groupBy(SAMPLE_FONTS, "family")
    const standardFonts = Object.keys(grouped).map((key) => {
      const familyFonts = grouped[key]
      const standardFont = familyFonts.find((familyFont) => familyFont.postscript_name.includes("-Regular"))
      if (standardFont) {
        return standardFont
      }
      return familyFonts[familyFonts.length - 1]
    })
    setCommonFonts(standardFonts)
  }, [])

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Scrollable>
        <div style={{
            display: 'grid',
            gap: '0.5rem',
          }}>
            {commonFonts.map(font => (
              <TapArea key={font.name} tapStyle="compress" onTap={() => addObject()}>
                <Box paddingX={4} smPaddingX={4} mdPaddingX={4} lgPaddingX={4} >
                  <div
                    style={{
                        display: 'flex',
                        paddingLeft: '2rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        fontSize: '50px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: "white",
                        cursor: 'pointer',
                        fontFamily: font.name
                    }}
                  >
                     <img 
                        src={font.preview} 
                        className={css({
                            objectFit: "contain",
                            pointerEvents: "none",
                            verticalAlign: "middle",
                        })}/>
                     
                  </div>
                </Box>
              </TapArea>
            ))}
          </div>
      </Scrollable>
    </Block>
  )
}
