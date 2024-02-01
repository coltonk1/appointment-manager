import { useState } from "react";

function Time({ time }) {
    return <div className="time">{time}</div>;
}

function BookedTime({ name, email, time }) {
    return (
        <div className="bookedTime">
            <div>{time}</div>
            <div>{name}</div>
            <div>{email}</div>
        </div>
    );
}

function Admin() {
    var [error, setError] = useState("");
    var [times, setTimes] = useState(["N/A"]);
    var [bookedTimes, setBookedTimes] = useState([]);

    var timeComponents = times.map((child, index) => {
        return <Time key={index} time={child}></Time>;
    });
    if (timeComponents.length === 0) {
        timeComponents = <Time time="N/A"></Time>;
    }

    var bookedTimeComponents = bookedTimes.map((child, index) => {
        return <BookedTime key={index} name={child.name} email={child.email} time={child.time}></BookedTime>;
    });

    async function getTimes() {
        setError("");
        try {
            const response = await fetch(`http://localhost:8080/api/getAvailableTimes?date='${document.getElementById("date").value}'`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTimes(data);

            const response2 = await fetch(`http://localhost:8080/api/getBookedTimes?date='${document.getElementById("date").value}'`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response2.ok) {
                throw new Error(`HTTP error! Status: ${response2.status}`);
            }

            const data2 = await response2.json();
            setBookedTimes(data2);
        } catch (error) {
            const date = new Date();
            var hours = (date.getHours() % 12).toString();
            if (hours.length === 1) {
                hours = "0" + hours;
            }
            var minutes = date.getMinutes();
            if (minutes.length === 1) {
                minutes = "0" + minutes;
            }
            var seconds = date.getSeconds().toString();
            if (seconds.length === 1) {
                seconds = "0" + seconds;
            }
            const time = hours + ":" + minutes + ":" + seconds;
            setError(error.message + " " + time);
        }
    }

    async function submit() {
        const date = document.getElementById("create_date").value;
        const time = document.getElementById("time").value;

        setError("");
        try {
            const response = await fetch(`http://localhost:8080/api/createAvailableTime`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: date,
                    time: time,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setError("Created appointment!");
        } catch (error) {
            const date = new Date();
            var hours = (date.getHours() % 12).toString();
            if (hours.length === 1) {
                hours = "0" + hours;
            }
            var minutes = date.getMinutes();
            if (minutes.length === 1) {
                minutes = "0" + minutes;
            }
            var seconds = date.getSeconds().toString();
            if (seconds.length === 1) {
                seconds = "0" + seconds;
            }
            const time = hours + ":" + minutes + ":" + seconds;
            setError(error.message + " " + time);
        }
    }
    return (
        <div className="center">
            <div>
                <h1>Find appointments</h1>
                <label>Date:</label>
                <input id="date" type="date" onChange={() => getTimes()}></input>
                <label>Available times:</label>
                <div id="available_times">{timeComponents}</div>
                <label>Booked times:</label>
                <div id="available_times">{bookedTimeComponents}</div>

                <div id="error">{error}</div>
            </div>
            <div>
                <h1>Create appointment time</h1>
                <label>Date:</label>
                <input id="create_date" type="date"></input>
                <label>Time:</label>
                <input id="time" type="time"></input>

                <div onClick={() => submit()}>Submit</div>

                <div id="error">{error}</div>
            </div>
        </div>
    );
}

export default Admin;
