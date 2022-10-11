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
      editor.objects.add<IStaticText>(options)
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

  const handleFontFamilyChange = async (x: any) => {
    if (editor) {
      const font = {
        name: x.postscript_name,
        url: x.url,
      }
      await loadFonts([font])
      // @ts-ignore
      editor.objects.update<IStaticText>({
        fontFamily: x.postscript_name,
        fontURL: font.url,
      })
    }
  }

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/*<Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ArrowBackOutline size={24} />
          <Block>Choose font</Block>
        </Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>*/}
{/*
      <Block $style={{ padding: "0 1.5rem 1rem" }}>
        <Input
          overrides={{
            Root: {
              style: {
                paddingLeft: "8px",
              },
            },
          }}
          clearable
          onChange={(e) => setQuery((e.target as any).value)}
          placeholder="Search font"
          size={SIZE.compact}
          startEnhancer={<Search size={16} />}
        />
      </Block>*/}

      <Scrollable>
        {/*<div style={{ padding: "0 1.5rem", display: "grid", gap: "0.2rem" }}>
          {commonFonts.map((font, index) => {
            return (
              <div
                key={index}
                onClick={() => handleFontFamilyChange(font)}
                className={css({
                    color: "white",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  ":hover": {
                    backgroundColor: "rgb(245,246,247)",
                  },
                })}
                id={font.id}
              >
                <img src={font.preview} />
              </div>
            )
          })}
        </div>*/}
        <div style={{
            display: 'grid',
            gap: '0.5rem',
           
          }}>
            {commonFonts.map(font => (
              <TapArea key={font.name} tapStyle="compress" onTap={() => addObject(font)}>
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
                            //width: "100%",
                            //height: "100%",
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
