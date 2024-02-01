import { useState } from "react";

function Time({ time, selectTime }) {
    return (
        <div onClick={(e) => selectTime(e.target)} className="time">
            {time}
        </div>
    );
}

function Home() {
    var [times, setTimes] = useState([]);
    var [error, setError] = useState("");
    var selected_time = "N/A";

    var timeComponents = times.map((child, index) => {
        return <Time key={index} time={child} selectTime={selectTime}></Time>;
    });
    if (timeComponents.length === 0) {
        timeComponents = <Time time="N/A" selectTime={selectTime}></Time>;
    }

    async function getAvailableTimes() {
        setError("");
        selected_time = "N/A";
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
            console.log("Post successful:", data);
            setTimes(data);
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
        const date = document.getElementById("date").value;
        const time = selected_time;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        console.log({
            date: date,
            time: time,
            name: name,
            email: email,
        });

        setError("");
        try {
            const response = await fetch(`http://localhost:8080/api/bookAppointment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: date,
                    time: time,
                    name: name,
                    email: email,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setError("Booked appointment!");
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

    function selectTime(element) {
        let time_container = document.getElementById("available_times");
        for (var child of time_container.children) {
            child.className = "time";
        }
        if (element.textContent !== "N/A") element.className = "time selected";

        selected_time = element.textContent;
    }

    return (
        <div className="center">
            <h1>Book appointment</h1>
            <label>Name</label>
            <input id="name"></input>
            <label>Email</label>
            <input id="email" type="email"></input>
            <label>Date</label>
            <input id="date" onChange={() => getAvailableTimes()} type="date"></input>
            <label>Available times:</label>
            <div id="available_times">{timeComponents}</div>

            <div onClick={() => submit()}>Submit</div>

            <div id="error">{error}</div>
        </div>
    );
}

export default Home;
