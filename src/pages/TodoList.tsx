import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
const client = generateClient<Schema>();

const TodoList = () => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [value, setValue] = useState<number>(1); // Initialize value state with 1

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

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }
  
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await client.models.Todo.create({ content, status: "Open", value }); // Include value in todo creation
    setContent('');
    setValue(1); // Reset value after todo creation
  };

    const handleStatusChange = async (id: string, newStatus: string) => {
      try {
        await client.models.Todo.update({ id, status: newStatus });
        // If the update is successful, update the todo status locally
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, status: newStatus } : todo
          )
        );
      } catch (error) {
        console.error('Error updating todo status:', error);
      }
    };


  return (
      
      <div className="home-container">
      <h2 className="home-title">Tasks</h2>
      <div className="home-content">

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter new todo..."
          />
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            placeholder="Enter value..."
          />
          <button type="submit">Add Todo</button>
        </form>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{ backgroundColor: checkColor(todo.status ?? "Open") }}
              >
                {todo.content}
                <br />
                Merits: {todo.value}
                <button onClick={() => handleStatusChange(todo.id, 'In Progress')}>S</button>
                <button onClick={() => handleStatusChange(todo.id, 'Complete')}>C</button>
                <button onClick={() => handleStatusChange(todo.id, 'Overdue')}>O</button>
                <button onClick={() => handleTodoClick(todo.id)}>X</button>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default TodoList



