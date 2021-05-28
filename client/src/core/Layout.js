import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";

const Layout = ({ children, match, history }) => {
  const userName = isAuth().name || "";

  const isActive = (path) => {
    if (match.path === path) {
      return {
        color: "#000",
      };
    } else {
      return {
        color: "#fff",
      };
    }
  };

  const nav = () => {
    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link to="/" className="nav-link" style={isActive("/")}>
            Home
          </Link>
        </li>

        {!isAuth() ? (
          <Fragment>
            <li className="nav-item">
              <Link
                to="/signin"
                className="nav-link"
                style={isActive("/signin")}
              >
                Signin
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/signup"
                className="nav-link"
                style={isActive("/signup")}
              >
                Signup
              </Link>
            </li>
          </Fragment>
        ) : (
          <Fragment>
            {isAuth().role === "admin" && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className="nav-link"
                  style={isActive("/admin")}
                >
                  {userName}
                </Link>
              </li>
            )}
            {isAuth().role === "subscriber" && (
              <li className="nav-item">
                <Link
                  to="/private"
                  className="nav-link"
                  style={isActive("/private")}
                >
                  {userName}
                </Link>
              </li>
            )}
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: "pointer", color: "#fff" }}
                onClick={() => {
                  signout(() => {
                    history.push("/");
                  });
                }}
              >
                Signout
              </span>
            </li>
          </Fragment>
        )}
      </ul>
    );
  };

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
