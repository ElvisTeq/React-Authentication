import React, { useState } from "react";

// Creating Context
const AuthContext = React.createContext({
  token: "", // Determines which user is logged in
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// Providing Context data to {props.children}
export const AuthContextProvider = (props) => {
  // Get Token ("null") if not exist, else "contextValue" will contain an existing token which will keep User logged in
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; // not not false (true)

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token); // Receives ("keyName", data)
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token"); // Receives ('keyName')
  };

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
