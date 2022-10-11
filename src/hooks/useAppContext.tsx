import { AppContext } from "~/contexts/AppContext"
import { useContext } from "react"

function useAppContext() {
  const {
    isMobile,
    setIsMobile,
    activePanel,
    setActivePanel,
    templates,
    setTemplates,
    shapes,
    setShapes,
    activeSubMenu,
    setActiveSubMenu,
    uploads,
    setUploads,
    currentTemplate,
    setCurrentTemplate,
    backgroundColor,
    setBackgroundColor,
    dimensions,
    setDimensions,
    fonts,
    setFonts,
  } = useContext(AppContext)

  return {
    backgroundColor,
    setBackgroundColor,
    dimensions,
    setDimensions,
    isMobile,
    setIsMobile,
    activePanel,
    setActivePanel,
    templates,
    setTemplates,
    shapes,
    setShapes,
    activeSubMenu,
    setActiveSubMenu,
    uploads,
    setUploads,
    currentTemplate,
    setCurrentTemplate,
    fonts,
    setFonts,
  }
}

export default useAppContext
