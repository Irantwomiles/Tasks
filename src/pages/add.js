import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
import "../style.css";

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const Notification = electron.remote.Notification;

function Add() {

    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState(new Date());

    let history = useHistory();

    const handleAdd = () => {
        let response = ipcRenderer.sendSync("addTask", {name: name, date: startDate});
    
        new Notification({
            title: "New Notification",
            body: "This is a new notification from the Task App."
        }).show();

        if(response === null) {
            console.log("error while adding a new task");
            return;
        }

    }

    const handleCancel = () => {
        history.push('/');
    }

    return (
        <div className="add">

            <input className="input-field" onChange={(e) => {setName(e.target.value)}} placeholder="ENTER TASK NAME" value={name}></input>
            <div>
                <DatePicker className="input-field" selected={startDate} onChange={date => {setStartDate(date)}} />
            </div>

            <button className="add-button" onClick={handleAdd}>ADD</button>
            <button className="cancel-button" onClick={handleCancel}>CANCEL</button>
        </div>
    )
}

export default Add