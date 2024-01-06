import React, { useState, useEffect } from "react";
import { ref, push, remove, onValue, update, set} from 'firebase/database';
import { db } from "../dbconfig/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { MdOutlineDelete } from 'react-icons/md';
import { IoMdAddCircle } from 'react-icons/io';
import { Modal } from "bootstrap";
import { FcCheckmark } from 'react-icons/fc';
export default function Schedules({ state }) {
    const [schedule, setSchedule] = useState('');
    const [time, setTime] = useState('');
    const [Schedules, setSchedules] = useState([]);
    const [subjectTime, setSubjectTime] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [deptCount, setDeptCount] = useState(null);
    const [modal, setModal] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalRef, setModalRef] = useState(null);
    const [pushState, setPushState] = useState(null);
    const [inputState, setInputState] = useState(null);
    const [input, setInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [schoolYear, setSchoolYear] = useState('');
    const [schoolYearDAta, setSchoolYearData] = useState([]);
    const nav = useNavigate();
    const dbref = {schoolYear: ref(db, 'School Year'), time: ref(db, 'Subject Time'), schedule: ref(db, 'Subject Schedules'), departments: ref(db, 'Subjects') };
    //const timeRef = ref(db, 'Time');
    //const scheduleRef = ref(db, 'Schedule');
    //const departments = ref(db, 'Subjects');
    //schedules
    useEffect(() => {
        const fetchSchedules = () => {
            onValue(dbref.schedule, (scheduleSnap) => {
                const scheduleData = scheduleSnap.val();
                if (scheduleData) {
                    const scheduleArray = Object.values(scheduleData);
                    setSchedules(scheduleArray);
                } else {
                    setSchedules([]);
                }
            });
        }
        fetchSchedules();
        return () => {
            onValue(dbref.schedule, () => { });
        }
    }, []);
    //time
    useEffect(() => {
        const fetchTime = () => {
            onValue(dbref.time, (timeSnap) => {
                const timeData = timeSnap.val();
                if (timeData) {
                    const timeArray = Object.values(timeData);
                    setSubjectTime(timeArray);
                } else {
                    setSubjectTime([]);
                }
            });
        }
        fetchTime();
        return () => {
            onValue(dbref.time, () => { });
        }
    }, []);
    //departments
    useEffect(() => {
        const fetchDepartments = () => {
            onValue(dbref.departments, (departmentSnap) => {
                const departmentData = departmentSnap.val();
                if (departmentData) {
                    const departmentArray = Object.entries(departmentData).map(([key, value]) => ({ key, ...value }));
                    setDepartments(departmentArray);
                    //deptCount should stay kay basin magamit for future and stuff
                    setDeptCount(departmentArray.length);
                } else {
                    setDepartments([]);
                }
            });
        }
        fetchDepartments();
        return () => {
            onValue(dbref.departments, () => { });
        }
    }, []);
    const addNew = (modalTitle, node) => {
        const addNew = new Modal(document.getElementById('addNew'));
        addNew.show();
        setModal(addNew);
        setModalTitle(modalTitle);
        setModalRef(node);
    }
    const handleAdd = async () => {
        const nodeKey = input.trim();
        const nodeRef = ref(db, `${modalRef}/${nodeKey}`);
    
        await set(nodeRef, input); // Assuming you have a property named 'text' in your data structure
    
        console.log('Custom Department Key:', nodeKey);
        setInput('');
    
        if (modal) {
            modal.hide();
        }
    };
    const handleDelete = (e) =>{
        console.log(e);
    }
    const handleDepartmentChange = (event) => {
        const newSelectedDepartment = event.target.value;
        setSelectedDepartment(newSelectedDepartment);
        nav(`/Department?department=${newSelectedDepartment}`, { state });
      };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-4 p-3">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Departments</div>
                            <div className="card-title">
                                {pushState && <div className="alert alert-success alert-dismissible lead text-center">New Department Added <FcCheckmark className="mb-2" /></div>}
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-stripped">
                                {/* <thead>
                                        <tr>
                                            <th>header</th>
                                        </tr>
                                    </thead> */}
                                <tbody>
                                    {departments.map((department) => (
                                        <tr key={department.key}>
                                            <td>{department.key}</td>
                                            <td>
                                                <button className="btn btn-danger" onClick={()=>handleDelete(department)}>
                                                    Delete<MdOutlineDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary p-2" onClick={() => { addNew('Department', 'Subjects') }}>Add New<IoMdAddCircle /></button>
                        </div>
                    </div>
                </div>
                <div className="col-4 p-3">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Subject Schedules</div>
                            <div className="card-title">
                            {pushState && <div className="alert alert-success alert-dismissible lead text-center">New Department Added <FcCheckmark className="mb-2" /></div>}
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-stripped">
                                <thead>
                                    <tr>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Schedules.map((sched) => (
                                        <tr key={sched.key}>
                                            <td>{sched}</td>
                                            <td>
                                                <button className="btn btn-danger">
                                                    Delete<MdOutlineDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary" onClick={() => { addNew('Subject Schedules', 'Subject Schedules') }}>Add New Subject Schedule<IoMdAddCircle /></button>
                        </div>
                    </div>
                </div>
                <div className="col-4 p-3">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Subject Time</div>
                            <div className="card-title">
                            {pushState && <div className="alert alert-success alert-dismissible lead text-center">New Department Added <FcCheckmark className="mb-2" /></div>}
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-stripped">
                                <thead>
                                    <tr>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectTime.map((subTime) => (
                                        <tr key={subTime.key}>
                                            <td>{subTime}</td>
                                            <td>
                                                <button className="btn btn-danger">
                                                    Delete<MdOutlineDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary" onClick={() => { addNew('Subject Time', 'Subject Time') }}>Add New Time<IoMdAddCircle /></button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="addNew" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title">Add New {modalTitle}</div>
                        </div>
                        <div className="modal-body">
                            <input className="form-control" value={input} onChange={(e) => { setInput(e.target.value) }} placeholder={`Add New ${modalTitle}`} type="text" name="" id="" />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
                            <button className="btn btn-primary" onClick={handleAdd}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}