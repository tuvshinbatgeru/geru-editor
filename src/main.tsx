import ReactDOM from "react-dom/client"
import Provider from "./Provider"
import Container from "./Container"
import DesignEditor from "~/views/DesignEditor"
import 'gestalt/dist/gestalt.css';
import "./styles/styles.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <Container>
      <DesignEditor />
    </Container>
  </Provider>
)