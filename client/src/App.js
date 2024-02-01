import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
    useEffect(() => {
        import("./app.css").catch((error) => {
            console.error("Error loading CSS file:", error);
        });
    }, []);

    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Home />}></Route>
                    <Route path="/admin" element={<Admin />}></Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
