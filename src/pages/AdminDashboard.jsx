import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Dashboard from "./dashboard";
import ImportFiles from "../components/Imports";
import { ref, onValue } from 'firebase/database';
import { db } from "../dbconfig/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import Schedules from "../components/schedules";
import AllSubjects from "../components/allSubjects";
import StudentsAccounts from "../components/StudentsAccounts";
import Departments from "../components/departments";
export default function AdminDashboard({ state }) {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [displayComponent, setDisplayComponent] = useState(<Dashboard />); // Initialize with Dashboard
  const nav = useNavigate();
  const auth = getAuth();
  const deptRef = ref(db, 'Subjects');

  const handleDepartmentChange = (event) => {
    const newSelectedDepartment = event.target.value;
    setSelectedDepartment(newSelectedDepartment);
    nav(`/Department?department=${newSelectedDepartment}`, { state });
  };

  useEffect(() => {
    const fetchedDepartments = () => {
      onValue(deptRef, (deptSnaps) => {
        const deptData = deptSnaps.val();
        if (deptData) {
          const departmentArray = Object.keys(deptData);
          setDepartments(departmentArray);
        } else {
          setDepartments([]);
        }
      });
    };
    fetchedDepartments();
    return () => {
      onValue(deptRef, () => { });
    };
  }, []);

  const Instructors = (e) => {
    setDisplayComponent(<Dashboard />);
  }
  const StudentAccounts = (e) => {
    setDisplayComponent(<StudentsAccounts />);
  };
  const allSubjects = (e) => {
    setDisplayComponent(<AllSubjects />);
  }

  const importFiles = () => {
    setDisplayComponent(<ImportFiles />);
  }

  const displaySchedules = () => {
    setDisplayComponent(<Schedules />);
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      nav("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  const dbref = ref(db, `Subjects/${selectedDepartment}`);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 bg-dark p-3" style={{height: '100vh'}}>
          <nav className="nav flex-column justify-content-start align-items-start">
            <div className="p-3 h3 text-light">
              TimeMinder
            </div>
            <button className="mt-3 nav-link btn btn-secondary mx-1 mb-2 text-light" onClick={Instructors}>Instructors</button>
            <button className="mt-3 nav-link btn btn-secondary mx-1 mb-2 text-light" onClick={StudentAccounts}>Student Accounts</button>
            <button className="mt-3 nav-link btn btn-secondary mb-2 text-light" onClick={allSubjects}>Subjects</button>
            <button className="mt-3 nav-link btn btn-secondary mb-2 text-light" onClick={importFiles}>Import Subjects</button>
            <button className="mt-3 nav-link btn btn-secondary mb-2 text-light" onClick={displaySchedules}>Subject Schedules/Time</button>
            <button className="mt-3 btn btn-dark mx-1 mb-2 text-light" id='logout' onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
              </svg> Log out
            </button>
            <p>
  <button class="btn btn-transparent text-light" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Departments
  </button>
</p>
<div class="collapse" id="collapseExample">
  <div class="card card-body bg-transparent border-0 flex-column justify-content-start align-items-start">
  {departments.map((department) => (
                <button className="btn btn-transparent text-light" key={department} value={department} onClick={handleDepartmentChange}>
                  {department}
                </button>
              ))}
  </div>
</div>

            {/* <select
              className="mx-1 p-1 form-control"
              name="departments"
              id="departments"
              onChange={handleDepartmentChange}
              value={selectedDepartment}
            >
              <option value="" disabled hidden>
                Departments
              </option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select> */}
          </nav>
        </div>
        <div className="col-10 p-3">
          {displayComponent || <Outlet/>}
        </div>
      </div>
    </div>
  );
}
