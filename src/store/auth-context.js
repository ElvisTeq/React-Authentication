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
  const [token, setToken] = useState(null);

  const userIsLoggedIn = !!token; // not not false (true)

  const loginHandler = (token) => {
    setToken(token);
  };

  const logoutHandler = () => {
    setToken(null);
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
