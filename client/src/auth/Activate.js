import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
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
    console.log("**************", token);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { token },
    })
      .then((response) => {
        console.log("SIGNIN SUCCESS", response);
        //Save the response (user and token) in localStorage/cookie
        setValues({
          ...values,
          email: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(`Hey ${response.data.user.name},Welcome back`);
      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => {
    return (
      <div>
        <h1 className="p-5 text-center">
          Hey {name}, Ready to activate account
        </h1>
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
