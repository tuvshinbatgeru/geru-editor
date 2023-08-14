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
  const { setActiveSubMenu, fonts } = useAppContext()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const [commonFonts, setCommonFonts] = React.useState<any[]>([])
  const [css] = useStyletron()
  const editor = useEditor()
  
  const addObject = async (font) => {
    if (editor) {
      await loadFonts([font])
      editor.objects.update({
        fontFamily: font.name
      })
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
            {fonts.map(font => (
              <TapArea key={font.name} tapStyle="compress" onTap={() => addObject(font)}>
                <Box paddingX={4} smPaddingX={4} mdPaddingX={4} lgPaddingX={4} >
                  <Box padding={2} borderStyle="raisedTopShadow">
                    <div style={{
                        display: 'flex',
                        paddingLeft: '1rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        fontSize: '20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontFamily: font.name
                    }}>
                      <span style={{ color: "#fff" }}>{font.name}</span>
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
