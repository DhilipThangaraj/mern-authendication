import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  const { name, token, show } = values;

  useEffect(() => {
    let token = match.params.token;

    if (token) {
      //decoding the token
      let { name } = jwt.decode(token);
      let userName = name ? name : "";
      setValues({ ...values, userName, token });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log("ACCOUNT ACTIVATION SUCCESS", response);
        setValues({
          ...values,
          show: false,
        });
        toast.success(`${response.data.message}`);
      })
      .catch((error) => {
        console.log("ACCOUNT ACTIVATION ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => {
    return (
      <div className="text-center">
        <h1 className="p-5">Hey {name}, Ready to activate account</h1>
        <button className="btn btn-outline-primary" onClick={handleSubmit}>
          Activate Account
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        {activationLink()}
      </div>
    </Layout>
  );
};

export default Activate;
