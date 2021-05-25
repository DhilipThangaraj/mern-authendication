import React, { Fragment } from "react";

const Layout = ({ children }) => {
  const nav = () => {
    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <a href="/" className="text-light nav-link">
            Home
          </a>
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
