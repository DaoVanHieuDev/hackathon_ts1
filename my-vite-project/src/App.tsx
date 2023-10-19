import React, { useState, useEffect } from "react";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const base_API = "http://localhost:3000/api/v1/todo";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(base_API);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${base_API}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleCompleted = async (id: number, completed: boolean) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);

      if (todoToUpdate) {
        await axios.put(`${base_API}/${id}`, {
          ...todoToUpdate,
          completed: !completed,
        });

        fetchTodos();
      }
    } catch (error) {
      console.error("Error updating todo completion:", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        await axios.post(base_API, { title: newTodo, completed: false });
        setNewTodo("");
        fetchTodos();
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  return (
    <div className="bg-red-400 text-center mx-auto w-1/3 mt-10 text-white">
      <div className="w-full text-white">
        <h1 className="text-4xl text-white">Todo List</h1>
        <p className="text-sm text-white">
          Get things done, one item at a time
        </p>

        <ul className="text-white text-left mt-10 text-center">
          {todos.map((todo) => (
            <li key={todo.id}>
              <span
                className="mx-12"
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                onClick={() => toggleCompleted(todo.id, todo.completed)}
              >
                {todo.title}
              </span>
              <input
                className="rounded border-1 mx-2 border-inherit p-2 px-3 my-2"
                type="checkbox"
                id={`item${todo.id}`}
                name={`item${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleCompleted(todo.id, todo.completed)}
              />
              <i
                className="bx bxs-trash-alt text-lg"
                onClick={() => deleteTodo(todo.id)}
              ></i>
            </li>
          ))}
        </ul>

        <p className="text-sm text-white mt-7">ADD TO THE TODOLIST</p>
        <input
          type="text"
          placeholder="Enter item"
          className="rounded text-black border-1 border-inherit p-2 px-3 my-2"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          type="button"
          className="text-white p-2 mx-3 border-dashed border rounded-md"
          onClick={addTodo}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default App;
