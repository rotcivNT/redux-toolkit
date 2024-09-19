/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from "@/libs/todo/api";
import { Todo } from "@/types/todo.type";
import { useState } from "react";
import LoadingIndicator from "./Loading";

export default function TodoList() {
  const { data = [], isLoading } = useGetTodosQuery();

  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string>("");
  const [editText, setEditText] = useState("");

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const onAddTodo = async (todo: string) => {
    const payload: Omit<Todo, "id"> = {
      completed: false,
      todo,
    };
    setNewTodo("");
    await addTodo(payload);
  };

  const onUpdateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    setEditText("");
    await updateTodo({ id, updatedFields });
  };

  const onDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          My Todo List
        </h1>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddTodo(newTodo)}
            className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => onAddTodo(newTodo)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Add
          </button>
        </div>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <ul className="space-y-2 max-h-[500px] overflow-auto">
              {[...data].reverse().map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-center bg-gray-50 p-3 rounded-md transition-all duration-300 ${
                    todo.completed ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) =>
                      onUpdateTodo(todo.id, { completed: e.target.checked })
                    }
                    className="mr-3 form-checkbox h-5 w-5 text-purple-500 rounded focus:ring-purple-400"
                  />
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => onUpdateTodo(todo.id, { todo: editText })}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        onUpdateTodo(todo.id, { todo: editText })
                      }
                      className="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-grow ${
                        todo.completed ? "line-through" : ""
                      }`}
                      onDoubleClick={() => startEditing(todo.id, todo.todo)}
                    >
                      {todo.todo}
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            {data.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No tasks yet. Add one above!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
