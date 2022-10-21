import { Block } from "baseui/block"
import Common from "./Common"
import Flip from "./Shared/Flip"

export default function (props) {
  const { has_common = false, has_toolbox = false } = props

  return (
    <Block
      $style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: has_toolbox ? "space-between" : "flex-end",
      }}
    >
      {
        has_toolbox && <Block><Flip /></Block>
      }
      
      { has_common && <Common /> }
    </Block>
  )
}
