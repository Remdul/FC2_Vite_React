import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import About from './pages/About';
import Home from './pages/Home';
import Profile from './pages/Profile'; 
import TodoList from './pages/TodoList';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="main-container">
          <Router>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/todos">Tasks</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/todos" element={<TodoList />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Router>
          <div>
            <button onClick={signOut}>Sign out</button>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;