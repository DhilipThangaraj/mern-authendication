import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../auth/helpers";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    ></Route>
  );
}

export default PrivateRoute;
