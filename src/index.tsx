import Provider from "./Provider"
import Container from "./Container"
import DesignEditor from "~/views/DesignEditor"
<<<<<<< HEAD
import 'gestalt/dist/gestalt.css';
import "./styles/styles.css"
=======

// import "./styles/styles.css"
>>>>>>> fd7b8ee336609db9b80e369f30028c750ccb07a6

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