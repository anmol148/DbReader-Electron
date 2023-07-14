import logo from './logo.svg';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './login';
import Navbar from './NavBar';
import DashboardPage from './DashboardPage';
import Sidebar from './Sidebar';
import DataUpdated from './DataUpdated'
function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/DataUpdated" element={<DataUpdated />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
