import React from 'react';
import { BrowserRouter as Router, Route,  Link, Routes } from 'react-router-dom';
import mssqldb from'./asset/mssqldb.png';

// Define your components
const Home = () => <h1>Home</h1>;
const About = () => <h1>About</h1>;
const Contact = () => <h1>Contact</h1>;


const Navbar = () => {
  

  
   return (
<div>
  <h2>Welcome to the Home Screen!</h2>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img src={mssqldb} alt="Image Description" />
    <div style={{ textAlign: 'center' }}>
        <button className="link-button" >
          <Link to="/dashboard" className="link-text">
            Go to Dashboard
          </Link>
        </button>
    </div>
  </div>
</div>
    );
  };
  
  export default Navbar;