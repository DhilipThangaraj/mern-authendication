import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Signup from "./auth/Signup";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
