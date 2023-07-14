import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

//const process = window.require('electron').process;

//const { ipcRenderer } = window.require('electron');
// const fs = electron.remote.require('fs');
// const ipcRenderer  = electron.ipcRenderer;
//import { ipcRenderer } from 'electron';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
// const SendUrDta=()=>{
//   console.log("inside SendUrDta");
//   var data={'username':username,'password':password};
//   let ipcRenderer;
// if (window && window.require) {
//   const { ipcRenderer: electronIpcRenderer } = window.require('electron');
//   ipcRenderer = electronIpcRenderer;
// }

// // Usage example
// if (ipcRenderer) {
//   // Use ipcRenderer here
//   console.log("success");
//   ipcRenderer.send('dataFromReact', data);
// }

// }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Perform login authentication logic here
    // You can send username and password to an API or perform any other validation
    // For simplicity, let's just log the values to the console
    console.log('Username:', username);
    console.log('Password:', password);
    var data={'username':username,'password':password};
    window.electron.send('dataFromReact',data);
    window.electron.receive('query-result',(e,args)=>{
      console.log('data:', e);
      navigate('/Navbar');
    });
   
  //console.log(window.require);
// if (window && window.require) {
//   console.log('inside if block');
//   const { ipcRenderer: electronIpcRenderer } = window.require('electron');
//   ipcRenderer = electronIpcRenderer;
// }

// Usage example
// if (ipcRenderer) {
//   // Use ipcRenderer here
//ipcRenderer.send('dataFromReact', data);
//   console.log("success");
//   ipcRenderer.send('dataFromReact', data);
//}
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
