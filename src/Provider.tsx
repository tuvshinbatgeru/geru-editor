import React from "react"
import { Provider as ScenifyProvider } from "@layerhub-io/react"
import { Client as Styletron } from "styletron-engine-atomic"
import { Provider as StyletronProvider } from "styletron-react"
import { BaseProvider, LightTheme } from "baseui"
import { AppProvider } from "./contexts/AppContext"
import { DesignEditorProvider } from "./contexts/DesignEditor"
import { I18nextProvider } from "react-i18next"
import i18next from "i18next"
import 'gestalt/dist/gestalt.css';
import "./translations"

const engine = new Styletron()

export default function ({ children }: { children: React.ReactNode }) {
  return (
      <DesignEditorProvider>
        <AppProvider>
          <ScenifyProvider>
            <StyletronProvider value={engine}>
              <BaseProvider theme={LightTheme}>
                <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
              </BaseProvider>
            </StyletronProvider>
          </ScenifyProvider>
        </AppProvider>
      </DesignEditorProvider>
  )
}
