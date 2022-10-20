import { useContextMenuRequest, useEditor } from "@layerhub-io/react"
import { useStyletron } from "baseui"
import axios from 'axios'
import { useEffect, useState } from 'react'
import BringToFront from "~/components/Icons/BringToFront"
import Delete from "~/components/Icons/Delete"
import Duplicate from "~/components/Icons/Duplicate"
import Elements from "~/components/Icons/Elements"
import Templates from "~/components/Icons/Templates"
import Locked from "~/components/Icons/Locked"
import Paste from "~/components/Icons/Paste"
import SendToBack from "~/components/Icons/SendToBack"
import Unlocked from "~/components/Icons/Unlocked"
import useAppContext from "~/hooks/useAppContext"
import { getBase64 } from "../../utils/helper"
import { Box, Spinner, FixedZIndex } from 'gestalt'
import { HeaderText } from 'geru-components'
//import { backgroundRemove } from "../../utils/services"
function ContextMenu() {
  const { backgroundRemove , setBackgroundRemove} = useAppContext()

  const contextMenuRequest = useContextMenuRequest()
//  const [isBackgroundRemove, setIsBackgroundRemove] = useState(false)
  const editor = useEditor()
  const handleAsComponentHandler = async () => {
    if (editor) {
      const component: any = await editor.scene.exportAsComponent()
      if (component) {
        console.log({ component })
      }
    }
  }
  console.log("0. -- false",backgroundRemove);
  const backgroundRemove1 = async () => {
    //setIsBackgroundRemove(true)
    setBackgroundRemove(true)
    console.log("1. -- true",backgroundRemove)
    if (editor) {
        const component: any = await editor.scene.exportAsComponent()
        if (component) {
            //setTimeout(() => {
            //    setBackgroundRemove(false)
            //}, 3000);
            //setBackgroundRemove(true)
            //console.log( component.src)
            let imageSrc = component.src
            let user_id = "62837571527f65326bb4fec4"
            getBase64(imageSrc, user_id)
            .then(async function (rs) {
                let result = await rs
                console.log("result",result)
                //setBackgroundRemove(false)
            }).catch((err)=>{
                console.log(err)
                setBackgroundRemove(false)
            }).then(()=> {
                setBackgroundRemove(false)
            })
            
        }
        //setIsBackgroundRemove(false)
        //setBackgroundRemove(true)

        console.log("2. -- false",backgroundRemove)
    }
  }
  if (!contextMenuRequest || !contextMenuRequest.target) {
    return <></>
  }

  if (contextMenuRequest.target.type === "Background") {
    return (
      <>
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0",
          }}
        >
          <ContextMenuItem
            disabled={true}
            onClick={() => {
              editor.objects.copy()
              editor.cancelContextMenu()
            }}
            icon="Duplicate"
            label="copy"
          >
            <Duplicate size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              editor.objects.paste()
              editor.cancelContextMenu()
            }}
            icon="Paste"
            label="paste"
          >
            <Paste size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            disabled={true}
            onClick={() => {
              editor.objects.remove()
              editor.cancelContextMenu()
            }}
            icon="Delete"
            label="delete"
          >
            <Delete size={24} />
          </ContextMenuItem>
        </div>
      </>
    )
  }
//  console.log("2",backgroundRemove);

  const zIndex = new FixedZIndex(99)
  return (
    <>
      {!contextMenuRequest.target.locked ? (
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0",
          }}
        >
          <ContextMenuItem
            onClick={() => {
              editor.objects.copy()
              editor.cancelContextMenu()
            }}
            icon="Duplicate"
            label="copy"
          >
            <Duplicate size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              editor.objects.paste()
              editor.cancelContextMenu()
            }}
            icon="Paste"
            label="paste"
          >
            <Paste size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              editor.objects.remove()
              editor.cancelContextMenu()
            }}
            icon="Delete"
            label="delete"
          >
            <Delete size={24} />
          </ContextMenuItem>
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              editor.objects.bringForward()
              editor.cancelContextMenu()
            }}
            icon="Forward"
            label="bring forward"
          >
            <BringToFront size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              editor.objects.sendBackwards()
              editor.cancelContextMenu()
            }}
            icon="Backward"
            label="send backward"
          >
            <SendToBack size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              handleAsComponentHandler()
              editor.cancelContextMenu()
            }}
            icon="Elements"
            label="Save as component"
          >
            <Elements size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
                backgroundRemove1()
                editor.cancelContextMenu()
            }}
            icon="Templates"
            label="Background remove"
          >
            <Templates size={24} />
          </ContextMenuItem>
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              editor.objects.lock()
              editor.cancelContextMenu()
            }}
            icon="Locked"
            label="lock"
          >
            <Locked size={24} />
          </ContextMenuItem>
        </div>
      ) : (
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0",
          }}
        >
          <ContextMenuItem
            onClick={() => {
              editor.objects.unlock()
              editor.cancelContextMenu()
            }}
            icon="Unlocked"
            label="unlock"
          >
            <Unlocked size={24} />
          </ContextMenuItem>
         {!isBackgroundRemove && ( <Box position="absolute" left top height="100%" width="100%"
            zIndex={zIndex}
            display='flex'
            alignItems="center"
            direction='column'
            justifyContent="center"
            dangerouslySetInlineStyle={{
                __style: {
                    backgroundColor:'rgba(0,0,30,0.4)',
                    backdropFilter: 'blur(10px)',
                    opacity: 1
                }
            }}
        >
            <HeaderText color='white'>
                Creating your work of art hold on a bit ...
            </HeaderText>
            <Box height={12} />
            <Box color='light' rounding='circle' padding={1}> 
                <Spinner accessibilityLabel='loading' show={true} />
            </Box>
        </Box>)}
        </div>
      )}
    </>
  )
}

function ContextMenuItem({
  label,
  onClick,
  children,
  disabled = false,
}: {
  icon: string
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  const [css] = useStyletron()
  return (
    <div
      onClick={onClick}
      className={css({
        display: "flex",
        height: "42px",
        alignItems: "center",
        padding: "0 1rem",
        gap: "1rem",
        cursor: "pointer",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.4 : 1,
        ":hover": {
          backgroundColor: "rgba(0,0,0,0.075)",
        },
      })}
    >
      {children} {label}
        
    </div>
  )
}

export default ContextMenu
