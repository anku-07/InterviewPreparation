// import React, { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// const TodoList = () => {
//     let [todos, setTodos] = useState([{ task: "sample", id: uuidv4() }]);
//     let [newTodo, setNewTodo] = useState("");

//     // add
//     let addTask = () => {
//         if (newTodo.trim() !== "") {
//             setTodos((prevTodos) => {
//                 return [...prevTodos, { task: newTodo, id: uuidv4() }];
//             });
//             setNewTodo("");
//         }
//     };

//     let taskHandler = (event) => {
//         setNewTodo(event.target.value);
//     };

//     // delete
//     let deleteTodo = (id) => {
//         setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
//     };

//     // edit

//     let editHandler = ()

//     return (
//         <div>
//             <h4>Todo List</h4>
//             <input type="text" placeholder="Add a task" value={newTodo} onChange={taskHandler} />
//             <button onClick={addTask}>Add</button>
//             <br /> <br /><br />
//             <hr />
//             <h4>Task</h4>
//             <ul>
//                 {todos.map((todo) => (
//                     <li key={todo.id}>
//                         <span>{todo.task}</span>
//                         &nbsp;&nbsp;&nbsp;
//                         <button onClick={() => deleteTodo(todo.id)}>Delete</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default TodoList;

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
    let [todos, setTodos] = useState([{ task: "sample", id: uuidv4() }]);
    let [newTodo, setNewTodo] = useState("");
    let [isEditing, setIsEditing] = useState(false);
    let [currentTodo, setCurrentTodo] = useState({});

    let addTask = () => {
        if (newTodo.trim() !== "") {
            setTodos((prevTodos) => {
                return [...prevTodos, { task: newTodo, id: uuidv4() }];
            });
            setNewTodo("");
        }
    };

    let taskHandler = (event) => {
        setNewTodo(event.target.value);
    };

    let deleteTodo = (id) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    let editTodo = (todo) => {
        setIsEditing(true);
        setNewTodo(todo.task);
        setCurrentTodo(todo);
    };

    let updateTask = () => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === currentTodo.id ? { ...todo, task: newTodo } : todo
            )
        );
        setNewTodo("");
        setIsEditing(false);
        setCurrentTodo({});
    };

    return (
        <div>
            <h4>Todo List</h4>
            <input
                type="text"
                placeholder="Add a task"
                value={newTodo}
                onChange={taskHandler}
            />
            <button onClick={isEditing ? updateTask : addTask}>
                {isEditing ? "Update" : "Add"}
            </button>
            <br /> <br /><br />
            <hr />
            <h4>Task</h4>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <span>{todo.task}</span>
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={() => editTodo(todo)}>Edit</button>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
