import Provider from "./Provider"
import Container from "./Container"
import DesignEditor from "~/views/DesignEditor"
import 'gestalt/dist/gestalt.css';
<<<<<<< HEAD
import "./styles/styles.css"
=======
// import "./styles/styles.css"
>>>>>>> ca8c6eb7f741db14284047e169eb194712f677e3

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