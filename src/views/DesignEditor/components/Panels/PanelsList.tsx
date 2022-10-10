import { useStyletron } from "baseui"
import { BASE_ITEMS } from "~/constants/app-options"
import useAppContext from "~/hooks/useAppContext"
import { styled } from "baseui"
import Icons from "~/components/Icons"
import { useTranslation } from "react-i18next"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useEditorType from "~/hooks/useEditorType"
import Scrollable from "~/components/Scrollable"
import { Block } from "baseui/block"
import { Box, Flex ,Text} from "gestalt"
import { useMediaQuery } from 'react-responsive'
import {Icon, Colors} from "geru-components"
import { colors } from 'geru-components/dist/utils'

const Container = styled("div", (props) => ({
  width: "80px",
  backgroundColor: props.$theme.colors.primary100,
  display: "flex",
}))

function PanelsList() {
  const { activePanel } = useAppContext()
  const { t } = useTranslation("editor")
  const PANEL_ITEMS = BASE_ITEMS
  
  return (
    <Container>
      <Scrollable autoHide={true}>
        {PANEL_ITEMS.map((panelListItem) => (
          <PanelListItem
            label={t(`panels.panelsList.${panelListItem.id}`)}
            name={panelListItem.name}
            key={panelListItem.name}
            icon={panelListItem.icon}
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
    const selected = name === activePanel
    // @ts-ignore
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
            backgroundColor: name === activePanel ? "white" : theme.colors.primary100,
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
            backgroundColor: theme.colors.white,
            transition: "all 1s",
            },
        }}
        >
        <div style={{
            backgroundColor: selected ? '#fff' : colors.colorBlack
        }}>
            <Box 
                display='flex'
                minHeight={90} 
                minWidth={80}
                maxHeight={120} 
                maxWidth={100}
                direction='column'
                justifyContent='center'
                alignItems='center'
            >
            <div style={{ height: 8 }} />

            <Icon size={24} color={selected ? 'black' : 'white'} icon={icon} />
            <div style={{ height: 4 }} />
                <Text size='200' color={selected ? 'dark' : 'light'}>
                    {label}
                </Text>
            </Box>
        </div>
        
        </Block>
    )
}

export default PanelsList
