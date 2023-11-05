import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./login";
import Dashboard from "./dashboard";
export default function Pages(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}