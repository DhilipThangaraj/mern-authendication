import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "../App";
import Signup from "../auth/Signup";
import Signin from "../auth/Signin";
import Activate from "../auth/Activate";
import Private from "../auth/Private";
import PrivateRoute from "../routes/PrivateRoute";
import Admin from "../auth/Admin";
import AdminRoute from "../routes/AdminRoute";
import Forgot from "../auth/Forgot";
import Reset from "../auth/Reset";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/auth/activate/:token" component={Activate} />
        <PrivateRoute exact path="/private" component={Private} />
        <AdminRoute exact path="/admin" component={Admin} />
        <Route exact path="/auth/password/forgot" component={Forgot} />
        <Route exact path="/auth/password/reset/:token" component={Reset} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
