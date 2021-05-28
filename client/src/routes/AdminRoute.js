import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../auth/helpers";

function AdminRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() && isAuth().role === "admin" ? (
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

export default AdminRoute;
