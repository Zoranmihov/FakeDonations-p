import { BrowserRouter, Route, Switch } from "react-router-dom";

//Components
import Home from "./components/Home";
import ForgotPass from "./components/ForgotPass";
import ResetPass from "./components/ResetPass";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
     <Switch>
     <Route path="/" component={Home} exact />
     <Route path="/recover" component={ForgotPass} exact />
     <Route path="/reset/:id" component={ResetPass} exact />
     <Route component={NotFound} />    
     </Switch>
    </BrowserRouter>
  );
}

export default App;
