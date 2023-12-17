import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./login";
import Dashboard from "./dashboard";
import Subjects from "./subjects";
import StudentsAccounts from "../components/StudentsAccounts";
import BSHM from "../components/HRM";
import BSBA from "../components/BSBA";
import BSCRIM from "../components/BSCRIM";
import BSTVTED from "../components/BTVTED";
import SeniorHigh from "../components/SeniorHigh";
export default function Pages(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/bshm" element={<BSHM />} />
                <Route path="/crim" element={<BSCRIM />} />
                <Route path="/bsba" element={<BSBA />} />
                <Route path="/btvted" element={<BSTVTED />} />
                <Route path="/StudentsAccounts" element={<StudentsAccounts />} />
                <Route path="/seniorhigh" element={<SeniorHigh />} />
            </Routes>
        </Router>
    );
}