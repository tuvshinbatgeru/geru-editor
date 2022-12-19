import { useStyletron } from "baseui"
import { BASE_ITEMS } from "~/constants/app-options"

import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useAppContext from "~/hooks/useAppContext"
import Scrollable from "~/components/Scrollable"
import PanelItem from './PanelItem'

import { styled } from "baseui"
import { useTranslation } from "react-i18next"
import { Box, IconButton, Text, Modal, TapArea, FixedZIndex } from "gestalt"
import { useMediaQuery } from 'react-responsive'
import Icon from "geru-components/dist/Icon"
import { colors } from 'geru-components/dist/utils'

const Container = styled("div", (props) => ({
  width: "80px",
  backgroundColor: props.$theme.colors.primary100,
  display: "flex",
}))

function PanelsList() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const { activePanel, activeSubMenu, setActiveSubMenu, isShowMobileModal, setIsShowMobileModal } = useAppContext()
  const { t } = useTranslation("editor")
  const PANEL_ITEMS = BASE_ITEMS

  const ZINDEX = new FixedZIndex(1)

  if(isTabletOrMobile) {
    return (
      <Box display='flex' zIndex={ZINDEX} position='relative'>
        <div style={{
          position: 'fixed',
          bottom: 0,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 8,
          paddingRight: 8,
        }}>
          <IconButton 
            size="lg"
            icon='add'
            bgColor="red"
            accessibilityLabel='Model button'
            onClick={() => setIsShowMobileModal(!isShowMobileModal)}
          />
        </div>

        {
          activeSubMenu && (
            <Modal
              accessibilityModalLabel='Modal'
              onDismiss={() => setActiveSubMenu("")}
              // align='center'
            >
                <Box position='fixed' display='flex' direction='column' bottom height="30%" width='100%' left>
                  <div style={{ position: 'absolute', top: -50, left: 0, right: 0 }}>
                    <Box display="flex" justifyContent='center'>
                      <IconButton
                        accessibilityLabel="close"
                        icon="cancel"
                        size='md'
                        bgColor="transparentDarkGray"
                        onClick={() => setActiveSubMenu("")}
                      />
                    </Box>
                  </div>
                  <Box flex="grow">
                    <PanelItem />
                  </Box>
                </Box>
            </Modal>
          )
        }

        {
          isShowMobileModal && (
            <Modal
              accessibilityModalLabel='Modal'
              onDismiss={() => setIsShowMobileModal(!isShowMobileModal)}
            >
                <Box position='fixed' display='flex' direction='column' bottom height="80%" width='100%' left>
                  <div style={{ position: 'absolute', top: -50, left: 0, right: 0 }}>
                    <Box display="flex" justifyContent='center'>
                      <IconButton
                        accessibilityLabel="close"
                        icon="cancel"
                        size='md'
                        bgColor="transparentDarkGray"
                        onClick={() => setIsShowMobileModal(false)}
                      />
                    </Box>
                  </div>
                  <Box flex="grow">
                    <PanelItem />
                  </Box>
                  <Box direction='row' display='flex' justifyContent='center' overflow="scrollX">
                    {
                      PANEL_ITEMS.map(panelListItem => (
                        <PanelListItem
                          label={t(`panels.panelsList.${panelListItem.id}`)}
                          name={panelListItem.name}
                          key={panelListItem.name}
                          icon={panelListItem.icon}
                          activePanel={activePanel}
                        />
                      ))
                    }
                  </Box>
                </Box>
            </Modal>
          )
        }
      </Box>
    )
  }
  
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
    
    const { setActivePanel, setActiveSubMenu } = useAppContext()
    const setIsSidebarOpen = useSetIsSidebarOpen()
    const [css, theme] = useStyletron()
    const selected = name === activePanel
    // @ts-ignore
    return (
        <TapArea
          tapStyle="compress"
          onTap={() => {
            // editor.deselect()
            setIsSidebarOpen(true)
            setActivePanel(name)
            setActiveSubMenu("")
          }}
        >
            <div style={{
                backgroundColor: selected ? '#fff' : colors.colorBlack,
                display: 'flex',
                justifyContent: 'center'
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
                        {String(label)}
                    </Text>
                </Box>
            </div>
        
        </TapArea>
    )
}

export default PanelsList
