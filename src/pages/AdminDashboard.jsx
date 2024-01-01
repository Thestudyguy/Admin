import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";
import {ref, onValue} from 'firebase/database';
import { db } from "../dbconfig/firebaseConfig";
export default function AdminDashboard({ state }) {
  const [selectedDepartment, setSelectedDepartment] = useState(""); // New state for the selected department
  const [departments, setDepartments] = useState([]);
  const nav = useNavigate();
  const deptRef = ref(db, 'Subjects');
  const handleDepartmentChange = (event) => {
    const newSelectedDepartment = event.target.value;
    setSelectedDepartment(newSelectedDepartment);
    nav(`/Department?department=${newSelectedDepartment}`, { state });
  };
  useEffect(()=>{
    const fetchedDepartmetns = () =>{
        onValue(deptRef, (deptSnaps)=>{
            const deptData = deptSnaps.val();
            if(deptData){
                const departmentArray = Object.keys(deptData);
                setDepartments(departmentArray);
            }else{
                setDepartments([]);
            }
        });
    };
    fetchedDepartmetns();
    return() => {
        onValue(deptRef, ()=>{});
    }
  }, []);
  const dbref = ref(db, `Subjects/${selectedDepartment}`);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 bg-dark p-3">
          <nav className="nav flex-column">
            <div className="nav navbar-brand lead text-light">
                TimeMinder
            </div>
            <a className="nav-link active" href="#">
              Add new Department
            </a>
            <a className="nav-link" href="#">
              Link
            </a>
            <a className="nav-link" href="#">
              Link
            </a>
            <a className="nav-link disabled" href="#">
              Disabled
            </a>
            <select
              className="mx-1 p-1 form-control"
              name="departments"
              id="departments"
              onChange={handleDepartmentChange} // Add onChange handler
              value={selectedDepartment} // Set value based on state
            >
              <option value="" disabled hidden>
                Departments
              </option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </nav>
        </div>
        <div className="col-10 p-3">
            <Dashboard />
        </div>
      </div>
    </div>
  );
}
