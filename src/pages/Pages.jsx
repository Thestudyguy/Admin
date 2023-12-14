import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./login";
import Dashboard from "./dashboard";
import Subjects from "./subjects";
import StudentsAccounts from "../components/StudentsAccounts";
export default function Pages(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/StudentsAccounts" element={<StudentsAccounts />} />
            </Routes>
        </Router>
    );
}