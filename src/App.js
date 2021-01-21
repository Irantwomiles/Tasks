import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

function App() {
  
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  let history = useHistory();

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
    console.log("clicked", task);
  }

  useEffect(() => {

    getData();

  }, [])

  return (
    <div className="App">

      <div>
        <button className="new-button" onClick={() => {history.push('/add')}}>NEW</button>
      </div>

      {

        tasks.length === 0 ?

        <p id="no-tasks">THERE ARE NO TASKS TODAY.</p>
        :
        
        tasks.map((task) => (
          <div key={task._id} className={task.completed ? "task-wrapper task-wrapper-radius-finished" : "task-wrapper task-wrapper-radius-unfinished"} onClick={() => {handleStatus(task)}}>
            <div className="task-name">
              <p>{task.name.toUpperCase()}</p>
            </div>
            <div className="task-date">
              <p>{task.date}</p>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default App;
