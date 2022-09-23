import ReactDOM from "react-dom/client"
import Provider from "./Provider"
import Container from "./Container"
import DesignEditor from "~/views/DesignEditor"

import "./styles/styles.css"

const Editor = () => {
    return (
        <Provider>
            <Container>
                <DesignEditor />
            </Container>
        </Provider>
    )
}

export default Editor