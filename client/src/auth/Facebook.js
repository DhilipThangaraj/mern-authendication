import React from "react";
import axios from "axios";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Facebook = ({ informParent = (f) => f }) => {
  const responseFacebook = (response) => {
    console.log(response);

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/facebook-login`,
      data: { userID: response.userID, accessToken: response.accessToken },
    })
      .then((res) => {
        console.log("FACEBOOK SIGNIN SUCCESS", res);
        //Inform Parent Component
        informParent(res);
      })
      .catch((error) => {
        console.log("FACEBOOK SIGNIN ERROR", error);
      });
  };

  return (
    <div className="pb-3">
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            style={{ background: "#00FFFF", color: "red" }}
            onClick={renderProps.onClick}
            className="btn btn-danger btn-lg btn-block"
          >
            <i className="fab fa-facebook pr-2"></i>
            &nbsp; Login with facebook
          </button>
        )}
      />
    </div>
  );
};

export default Facebook;
