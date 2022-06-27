import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

// Creating Context
const AuthContext = React.createContext({
  token: "", // Determines which user is logged in
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// Calculating Remaining time in Miliseconds
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime(); // Get current time in Miliseconds
  const adjExpirationTime = new Date(expirationTime).getTime(); // Get expiration time in Miliseconds

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

// to get localStorage status for { useEffect }
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 6000) {
    localStorage.removeItem("token");
    localStorage.removeItem("espirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

// Providing Context data to {props.children}
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;

  if (tokenData) {
    // Token ("null") if not exist, else "contextValue" will contain an existing token which will keep User logged in
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; // not not false (true)

  // useCallback() => prevent child {useEffect} to rereder again and again without need
  const logoutHandler = useCallback(() => {
    setToken(null);
    // .removeItem() => Receives ('keyName')
    localStorage.removeItem("token"); // token = login session
    localStorage.removeItem("expirationTime"); // Clear localStorage time

    // Clear Timer in logout
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token); // Receives ("keyName", data)
    localStorage.setItem("expirationTime", expirationTime); // Storing Expiration Time (FireBase default value: 1hr)

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  // Check timer
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
