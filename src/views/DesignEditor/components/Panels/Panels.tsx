import { Fragment } from 'react'
import PanelItem from "./PanelItem"
import PanelsList from "./PanelsList"
import { useMediaQuery } from 'react-responsive'

function Panels() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  return (
    <>
      <PanelsList />
      {
        !isTabletOrMobile && (<PanelItem />)
      }
    </>
  )
}

export default Panels
