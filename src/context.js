import React, { useState, useContext, useEffect } from 'react'
import { useCallback } from 'react'
import jwtDecode from 'jwt-decode'


const AppContext = React.createContext()

const AppProvider = ({ children }) => {

    // Login States

    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedin, setLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')
  const signinUrl = 'http://localhost:8000/login'
  const signinProdUrl = "https://fastapi-bagheera.herokuapp.com/login"
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });


// Sidebar States

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// Sidebar Handlers

const openSidebar = () => {
  setIsSidebarOpen(true);
};
const closeSidebar = () => {
  setIsSidebarOpen(false);
};


// logout handler

const handleLogout = () => {
    console.log("inside handleLogout");
    setLoggedIn(false);
    localStorage.clear();
    window.location.reload();
    window.location.replace('https://bagheerapost.com')
    //  window.location.replace('http://localhost:3000')
  };

const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

//   login handlers

const handleLogin = async (e) => {
    e.preventDefault();

    var details = {
      username: username,
      password: password,
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch(signinProdUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
      }
    );
    const data = await response.json();
    if (response.status === 200){
      setPassword("");
      setUsername("");
      setLoggedIn(true);
      localStorage.setItem('accessToken',data.access_token)
      localStorage.setItem("user_id", jwtDecode(data.access_token).user_id)
      localStorage.setItem("loggedin",true)
      window.location.reload()
    }else{ 
        showAlert(true, 'danger', 'invalid credentials');
      }
  };

    return(<AppContext.Provider
    value={{
      alert,
      isSidebarOpen,
      openSidebar,
      closeSidebar,
        username,
        password,
        handleLogin,
        setPassword,
        setUsername,
        loggedin,
        handleLogout
    }}
    
    >
          {children}
        </AppContext.Provider>)
}
export const useGlobalContext = () => {
    return useContext(AppContext)
  }

export { AppContext, AppProvider }