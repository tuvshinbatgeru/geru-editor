import React from "react"
import useAppContext from "~/hooks/useAppContext"
import panelItems from "./panelItems"
import useIsSidebarOpen from "~/hooks/useIsSidebarOpen"
import { Block } from "baseui/block"
import { styled } from 'baseui'
import { useMediaQuery } from 'react-responsive'

const Container = styled('div', props => ({
    background: '#1B1927',
    width: '360px',
    flex: 'none',
    boxShadow: '1px 0px 1px rgba(0, 0, 0, 0.15)',
    borderRight: "2px solid #d7d8e3",
    display: "flex",
    transition: "ease width 0.1s",
    overflow: "hidden"
}))

const MobileContainer = styled('div', props => ({
    background: '#1B1927',
    height: '100%',
    width: '100%',
    display: 'flex',
    boxShadow: '1px 0px 1px rgba(0, 0, 0, 0.15)',
}))

interface State {
    panel: string
}

function PanelsList() {
    const [state, setState] = React.useState<State>({ panel: "Text" })
    const { activePanel, activeSubMenu } = useAppContext()
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    React.useEffect(() => {
        setState({ panel: activePanel })
    }, [activePanel])

    React.useEffect(() => {
        if (activeSubMenu) {
            setState({ panel: activeSubMenu })
        } else {
            setState({ panel: activePanel })
        }
    }, [activeSubMenu])

    // @ts-ignore
    const Component = panelItems[state.panel]
// 
    // alert(state.panel)

    if(isTabletOrMobile) {
        return <MobileContainer>{Component && <Component />}</MobileContainer>
    }
    
    return <Container>{Component && <Component />}</Container>
}

export default PanelsList
