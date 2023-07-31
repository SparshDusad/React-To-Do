import React, { useState, useEffect } from 'react';
import './App.css';
import { FaRegSquare, FaCheckSquare, FaPencilAlt } from 'react-icons/fa';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState(-1);
  const [editingTaskText, setEditingTaskText] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editingTaskText;
    setTasks(updatedTasks);
    setEditingTaskIndex(-1); // Reset editingTaskIndex to stop editing mode
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editingTaskIndex !== -1) {
        handleEditTask(editingTaskIndex);
      } else {
        handleAddTask();
      }
    }
  };

  return (
    <div className="App">
      <div className="todo-container">
        <h1 className="title">To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your task here..."
          />
          <button onClick={handleAddTask}>Add</button>
        </div>
        <ul className="task-list">
          {tasks.map((taskItem, index) => (
            <li key={index} className={`task-item ${taskItem.completed ? 'completed' : ''}`}>
              <div className="checkbox-container" onClick={() => handleToggleComplete(index)}>
                {taskItem.completed ? <FaCheckSquare /> : <FaRegSquare />}
              </div>
              {editingTaskIndex === index ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editingTaskText}
                  onChange={(e) => setEditingTaskText(e.target.value)}
                  onBlur={() => handleEditTask(index)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              ) : (
                <span className="task-text">{taskItem.text}</span>
              )}
              <div className="buttons-container">
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditingTaskIndex(index);
                    setEditingTaskText(taskItem.text); // Store the original task text for editing
                  }}
                  disabled={editingTaskIndex !== -1}
                >
                  <FaPencilAlt />
                </button>
                <button className="remove-button" onClick={() => handleRemoveTask(index)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
