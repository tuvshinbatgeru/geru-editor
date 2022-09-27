import { useStyletron } from "baseui"
import { BASE_ITEMS, VIDEO_PANEL_ITEMS } from "~/constants/app-options"
import useAppContext from "~/hooks/useAppContext"
import { styled } from "baseui"
import Icons from "~/components/Icons"
import { useTranslation } from "react-i18next"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useEditorType from "~/hooks/useEditorType"
import Scrollable from "~/components/Scrollable"
import { Block } from "baseui/block"
import { Text, Box, Flex, Heading } from 'gestalt';

const Container = styled("div", (props) => ({
  width: "80px",
//  backgroundColor: props.$theme.colors.primary100,
  backgroundColor: "orange",
  display: "flex",
}))

function PanelsList() {
  const { activePanel } = useAppContext()
  const { t } = useTranslation("editor")
  const editorType = useEditorType()
  const PANEL_ITEMS = editorType === "VIDEO" ? VIDEO_PANEL_ITEMS : BASE_ITEMS
  return (
    <Container>
      <Scrollable autoHide={true}>
        {PANEL_ITEMS.map((panelListItem) => (
          <PanelListItem
            label={t(`panels.panelsList.${panelListItem.id}`)}
            name={panelListItem.name}
            key={panelListItem.name}
            icon={panelListItem.name}
            activePanel={activePanel}
          />
        ))}
      </Scrollable>
    </Container>
  )
}

function PanelListItem({ label, icon, activePanel, name }: any) {
  const { setActivePanel } = useAppContext()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const [css, theme] = useStyletron()
  // @ts-ignore
  const Icon = Icons[icon]
  return (
    <Block
      id={"EditorPanelList"}
      onClick={() => {
        setIsSidebarOpen(true)
        setActivePanel(name)
      }}
      $style={{
        width: "80px",
        height: "80px",
        //paddingLeft: "20px",
        //paddingRight: "20px",
        //backgroundColor: name === activePanel ? theme.colors.white : theme.colors.primary100,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: "Uber Move Text",
        fontWeight: 500,
        fontSize: "0.8rem",
        userSelect: "none",
        transition: "all 0.5s",
        gap: "0.1rem",
        ":hover": {
          cursor: "pointer",
          backgroundColor: "red",
          transition: "all 1s",
        },
      }}
    >
     {/*<Box>*/}
        
        <div><Icon size={24} color="white" /></div>
        {label}
        
      {/*</Box>*/}
    </Block>
  )
}

export default PanelsList
