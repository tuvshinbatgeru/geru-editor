import {  SIZE } from "baseui/button"
import React from "react"
import { textComponents } from "~/constants/editor"
import { useStyletron } from "styletron-react"
import { useEditor } from "@layerhub-io/react"
import { FontItem } from "~/interfaces/common"
import { loadFonts } from "~/utils/fonts"
import { IStaticText } from "@layerhub-io/types"
import { nanoid } from "nanoid"
import { Block } from "baseui/block"

import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { SAMPLE_FONTS } from "~/constants/editor"
import { Button } from "gestalt"
import { groupBy } from "lodash"
import {TapArea, Box} from "gestalt"
import useAppContext from "~/hooks/useAppContext"
export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const [css] = useStyletron()
  const [commonFonts, setCommonFonts] = React.useState<any[]>([])
  const { setActiveSubMenu } = useAppContext()
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

  const addComponent = async (component: any) => {
    if (editor) {
      const fontItemsList: FontItem[] = []
      if (component.objects) {
        component.objects.forEach((object: any) => {
          if (object.type === "StaticText" || object.type === "DynamicText") {
            fontItemsList.push({
              name: object.fontFamily,
              url: object.fontURL,
            })
          }
        })
        const filteredFonts = fontItemsList.filter((f) => !!f.url)
        await loadFonts(filteredFonts)
      } else {
        if (component.type === "StaticText" || component.type === "DynamicText") {
          fontItemsList.push({
            name: component.fontFamily,
            url: component.fontURL,
          })
          await loadFonts(fontItemsList)
        }
      }
      editor.objects.add(component)
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

  const AddNewFonts = async (font) => {
    console.log("font",font)
    if (editor) {
      const new_font: FontItem = {
        name: font.full_name,
        url: font.url,
      }
      await loadFonts([new_font])
      const options = {
        id: nanoid(),
        type: "StaticText",
        width: 420,
        text: "Add some text",
        fontSize: 92,
        fontFamily: font.family,
        textAlign: "center",
        fontStyle: "normal",
        fontURL: font.url,
        fill: "#333333",
        metadata: {},
      }
      editor.objects.add<IStaticText>(options)
    }
  }
  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Scrollable>
        <Block padding={"0 1.5rem"}>
          <Button
            onClick={addObject}
            text="Add text"
            color="red"
            iconEnd="add"
          />

          {/*<Block
            $style={{
              paddingTop: "0.5rem",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
            }}
          >
            {[...textComponents].map((tc) => (
              <TextComponentItem onClick={addComponent} key={tc.id} component={tc} />
            ))}
          </Block>*/}
           
        </Block>
        <div style={{
            display: 'grid',
            gap: '0.5rem',
           
          }}>
            {commonFonts.map(font => (
              <TapArea key={font.name} tapStyle="compress" onTap={() => AddNewFonts(font)}>
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

interface TextComponent {
  id: string
  metadata: {
    preview: string
  }
}
function TextComponentItem({ component, onClick }: { component: any; onClick: (option: any) => void }) {
  const [css] = useStyletron()
  return (
    <div
      onClick={() => onClick(component.layers[0])}
      className={css({
        position: "relative",
        height: "84px",
        background: "#f8f8fb",
        cursor: "pointer",
        padding: "12px",
        borderRadius: "8px",
        overflow: "hidden",
        "::before:hover": {
          opacity: 1,
        },
      })}
    >
      <div
        className={css({
          backgroundImage: `linear-gradient(to bottom,
          rgba(0, 0, 0, 0) 0,
          rgba(0, 0, 0, 0.006) 8.1%,
          rgba(0, 0, 0, 0.022) 15.5%,
          rgba(0, 0, 0, 0.047) 22.5%,
          rgba(0, 0, 0, 0.079) 29%,
          rgba(0, 0, 0, 0.117) 35.3%,
          rgba(0, 0, 0, 0.158) 41.2%,
          rgba(0, 0, 0, 0.203) 47.1%,
          rgba(0, 0, 0, 0.247) 52.9%,
          rgba(0, 0, 0, 0.292) 58.8%,
          rgba(0, 0, 0, 0.333) 64.7%,
          rgba(0, 0, 0, 0.371) 71%,
          rgba(0, 0, 0, 0.403) 77.5%,
          rgba(0, 0, 0, 0.428) 84.5%,
          rgba(0, 0, 0, 0.444) 91.9%,
          rgba(0, 0, 0, 0.45) 100%)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          height: "100%",
          width: "100%",
          ":hover": {
            opacity: 1,
          },
        })}
      ></div>
      <img
        src={component.preview}
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          verticalAlign: "middle",
        })}
      />
    </div>
  )
}
