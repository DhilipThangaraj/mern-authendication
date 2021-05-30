/**
 * @summary - The files especially used for saving the token and user details when the signin happens.
 */

import cookie from "js-cookie";

//set in cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

//remove from cookie
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

//get from cookie such as stored token and will be useful when we need to make request to server with token.

export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
  return "";
};

//set in localstorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

//remove from localstorage
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

//access user details from localstorage - isAuth equals to getLocalStorageUserDetails.Basically checking the user
//as authentic user or not

export const isAuth = (key) => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      }
    } else {
      return false;
    }
  }
};

//authendicate user by passing data to cookie and localstorage during signin

export const authendicate = (response, next) => {
  console.log("AUTHENTICATE HEPLER ON SIGNIN RESPONSE");
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

//Signout functionality

export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};

//Update the user details in Local storage when profile update page gets submitted

export const updateUser = (response, next) => {
  console.log("UPDATE USER IN LOCAL STORAGE", response);

  if (typeof window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
