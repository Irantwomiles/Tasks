import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

function App() {
  
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const getData = () => {

    let result = ipcRenderer.sendSync('getTasks', {date: new Date()});

    if(result === null || typeof result === 'undefined') {
      setTasks([]);
      setLoading(false);
      return;
    }

    setTasks(result);
    setLoading(false);

  }

  const updateTaskStatus = (task) => {
    let result = ipcRenderer.sendSync('updateTask', task);

    setTasks(result);
  }

  const handleStatus = (task) => {
    updateTaskStatus(task);
  }

  const renderStatusButton = (task) => {

    if(task === null || typeof task === 'undefined') return <button>NULL</button>;

    if(task.completed) return <button className="done" onClick={() => {handleStatus(task)}}>DONE</button>; 

    return <button className="unfinished" onClick={() => {handleStatus(task)}}>UNFINISHED</button>;

  }

  useEffect(() => {

    getData();

  }, [])

  return (
    <div className="App">

      <div>
        <Link to="/add">Add</Link>
      </div>

      <div>
        <button>View All</button>
      </div>

      {
        tasks.map((task) => (
          <div key={task._id} className="task-wrapper">
            <div className="task-name">
              <p>{task.name.toUpperCase()}</p>
            </div>
            <div className="task-date">
              <p>{task.date}</p>
            </div>
            <div className="task-status">
              { renderStatusButton(task) }
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default App;
