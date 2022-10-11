import Provider from "./Provider"
import Container from "./Container"
import DesignEditor from "~/views/DesignEditor"
import 'gestalt/dist/gestalt.css'
// import "./styles/styles.css"

const Editor = (props) => {
    return (
        <Provider>
            <Container>
                <DesignEditor {...props} />
            </Container>
        </Provider>
    )
}

export default Editor