import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import About from './pages/About';
import Home from './pages/Home';
import TodoList from './pages/TodoList'; // Import the new TodoList component
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const client = generateClient<Schema>();

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <Router>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/todos">Tasks</Link></li> {/* Add the link to the TodoList page */}
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/todos" element={<TodoList />} /> {/* Add the route for TodoList */}
            </Routes>
          </Router>
          <div>
            <button onClick={signOut}>Sign out</button>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;