import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const nav = () => {
    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link href="/" className="text-light nav-link">
            Home
          </Link>
        </li>
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

export default Layout;
