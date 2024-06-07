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
    <div>
      <h2>Tasks</h2>
      <button onClick={createTodo}>+ new</button>
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
  );
};

export default TodoList