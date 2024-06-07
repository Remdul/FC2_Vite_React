import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
const client = generateClient<Schema>();

const TodoList = () => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => subscription.unsubscribe(); // Cleanup the subscription on unmount
  }, []);

  const checkColor = (description: string) => {
    switch (description) {
      case "Open":
        return "white";
      case "Complete":
        return "green";
      case "In Progress":
        return "yellow"; // Changed to "yellow" to differentiate from "Complete"
      case "Overdue":
        return "red";
      default:
        return "grey"; // Default color
    }
  };

  const changeStatus = (status: string) => {
    switch (status) {
      case "Open":
        return "In Progress";
      case "In Progress":
        return "Complete";
      case "Complete":
        return "Overdue";
      case "Overdue":
        return "Open";
      default:
        return "Open"; // Default status
    }
  };

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }
  
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await client.models.Todo.create({ content, status: "Open", value: 1 });
    setContent('');
  };
  
  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content, status: "Open", value: 1 });
    }
  }

  function handleTodoClick(id: string) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, status: changeStatus(todo.status ?? "Open") }
          : todo
      )
    );
  }

  return (
      
      <div className="home-container">
      <h2 className="home-title">Tasks</h2>
      <div className="home-content">


      <button onClick={createTodo}>+ new</button>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter new todo..."
        />
        <button type="submit">Add Todo</button>
      </form>
      
      
      
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => handleTodoClick(todo.id)}
            style={{ backgroundColor: checkColor(todo.status ?? "Open") }}
            key={todo.id}
          >
            {todo.content}
            <br />
            [{todo.value}]
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the parent click event
                deleteTodo(todo.id);
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default TodoList