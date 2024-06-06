import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import About from './pages/About';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);


  const checkColor = (description: string) => {
  switch (description) {
    case "Open":
      return "white";
    case "Complete":
      return "green";
    case "In Progress":
      return "green";
    case "Overdue":
      return "red";
    default:
      return "white"; 
  }};

  const changeStatus = (status: string) => {
    switch (status){
      case "":
        return "Open";
      case "Open":
        return "In Progress";
      case "In Progress":
        return "Complete";
      case "Complete":
        return "Overdue";
      case "Overdue":
        return "Open";
      default:
      return "Open"; 
    }};

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  
  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content")});
  }
  
  return (
        
    <Authenticator>
      {({ signOut, user }) => (
      
    <main>
         <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>


     <h2>{user?.signInDetails?.loginId}'s todos</h2>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (

          <li 
            onClick={() => todo.status = changeStatus(todo.status ?? "")}
            style={{ backgroundColor: checkColor(todo.status ?? "Open") }}
            key={todo.id}>
            {todo.content} <b>[{todo.value}]</b>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button> 
          </li>
          
        ))}
      </ul>
      
      <div>
        🥳 Try creating a new todo. Bryan thinks it works.
        <br />
        
      </div>
                <button onClick={signOut}>Sign out</button>
    </main>
        
      )}
    </Authenticator>
  );
}

export default App;
