import { useStyletron } from "baseui"
import { BASE_ITEMS } from "~/constants/app-options"

import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useAppContext from "~/hooks/useAppContext"
import Scrollable from "~/components/Scrollable"
import PanelItem from './PanelItem'

import { styled } from "baseui"
import { useTranslation } from "react-i18next"
import { Box, IconButton, Icon as GestaltIcon, Layer, Text, Modal, TapArea, FixedZIndex } from "gestalt"
import { useMediaQuery } from 'react-responsive'
import Icon from "geru-components/dist/Icon"
import { colors } from 'geru-components/dist/utils'

const Container = styled("div", (props) => ({
  width: "80px",
  backgroundColor: "#191919",
  display: "flex",
  height: "100%"
}))

function PanelsList() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const { activePanel, activeSubMenu, setActiveSubMenu, isShowMobileModal, setIsShowMobileModal, ignoreAppOptions } = useAppContext()
  const { t } = useTranslation("editor")
  
  let PANEL_ITEMS = BASE_ITEMS.filter((item) => {
    return !ignoreAppOptions.includes(item.id)
  })

  const ZINDEX = new FixedZIndex(1)
  const ModalZINDEX = new FixedZIndex(3)

  if(isTabletOrMobile) {
    return (
      <Box display='flex' zIndex={ZINDEX} height={70} position="fixed" bottom>
        <div style={{
          position: 'absolute',
          bottom: 0,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 8,
          paddingRight: 8,
        }}>
          <TapArea tapStyle="compress" onTap={() => setIsShowMobileModal(!isShowMobileModal)}>
            <Box color="brand" height={48} width={48} rounding="circle" 
              display="flex" 
              justifyContent="center" 
              wrap
              alignItems="center" 
              alignContent="center"
              alignSelf="center"
            >
              <GestaltIcon 
                icon="add"
                color="light"
                accessibilityLabel="Add"
              />
            </Box>
          </TapArea>
          {/* <IconButton 
            size="lg"
            icon='add'
            bgColor="red"
            // bgC
            accessibilityLabel='Model button'
            onClick={() => setIsShowMobileModal(!isShowMobileModal)}
          /> */}
        </div>

        {
          activeSubMenu && (
            <Modal
              accessibilityModalLabel='Modal'
              onDismiss={() => setActiveSubMenu("")}
              padding="none"
              // align='center'
            >
                <Box position='fixed' display='flex' direction='column' bottom height="50%" width='100%' left>
                  <div style={{ position: 'absolute', top: -50, left: 0, right: 0 }}>
                     <Box display="flex" justifyContent="center">
                        <TapArea fullWidth={false} tapStyle="compress" onTap={() => setActiveSubMenu("")}>
                          <Box 
                            display="flex" 
                            justifyContent='center' 
                            alignContent="center"
                            height={48}
                            wrap
                            width={48} 
                            rounding="circle"
                            color="transparentDarkGray"
                          >
                            <GestaltIcon 
                              icon="cancel"
                              accessibilityLabel="close"
                              color="light"
                            />
                          </Box>
                        </TapArea>
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
            <Layer zIndex={ModalZINDEX}>
              <Modal
                accessibilityModalLabel='Modal'
                onDismiss={() => setIsShowMobileModal(!isShowMobileModal)}
              >
                  <Box position='fixed' display='flex' direction='column' bottom height="80%" width='100%' left>
                    <div style={{ position: 'absolute', top: -54, left: 0, right: 0, zIndex: 3, }}>
                      <Box display="flex" justifyContent="center">
                        <TapArea fullWidth={false} tapStyle="compress" onTap={() => setIsShowMobileModal(false)}>
                          <Box 
                            display="flex" 
                            justifyContent='center' 
                            alignContent="center"
                            height={48}
                            wrap
                            width={48} 
                            rounding="circle"
                            color="transparentDarkGray"
                          >
                            <GestaltIcon 
                              icon="cancel"
                              accessibilityLabel="close"
                              color="light"
                            />
                          </Box>
                        </TapArea>
                      </Box>
                    </div>
                    <Box flex="grow">
                      <PanelItem />
                    </Box>
                    <Box direction='row' display='flex' overflow="scrollX">
                      {
                        PANEL_ITEMS.map((panelListItem, index) => (
                          <PanelListItem
                            label={panelListItem.label}
                            name={panelListItem.name}
                            key={index}
                            icon={panelListItem.icon}
                            activePanel={activePanel}
                          />
                        ))
                      }
                    </Box>
                  </Box>
              </Modal>
            </Layer>
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
            label={panelListItem.label}
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
          // fullHeight
          onTap={() => {
            // editor.deselect()
            setIsSidebarOpen(true)
            setActivePanel(name)
            setActiveSubMenu("")
          }}
        >
            <div style={{
                backgroundColor: selected ? '#242424' : "#191919",
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Box 
                    display='flex'
                    minHeight={90}
                    width={80}
                    direction='column'
                    justifyContent='center'
                >
                  <Box display="flex" justifyContent="center">
                    <Icon size={24} color={'white'} icon={icon} />
                  </Box>
                  <div style={{ height: 4 }} />
                    {
                      String(label).split(" ").map((str) => (
                        <Text align="center" size='200' key={str} color={'light'}>
                            {String(str)}
                        </Text>
                      ))    
                    }
                </Box>
            </div>
        
        </TapArea>
    )
}

export default PanelsList
