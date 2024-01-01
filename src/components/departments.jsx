import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ref, push, set, remove, onValue, get } from 'firebase/database';
import { db } from "../dbconfig/firebaseConfig";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
export default function Departments() {
    const nav = useNavigate();
    const location = useLocation();
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectDescription, setSubjectDescription] = useState('');
    const [subjectSemester, setSubjectSemester] = useState('');
    const [subjectTerm, setSubjectTerm] = useState('');
    const [subjectKey, setSubjectKey] = useState(null);
    const [departmens, setDepartment] = useState([]);
    const [subjectSchedule, setsubjectSchedule] = useState('');
    const [subjectTime, setsubjecTime] = useState('');
    const [modal, setModal] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [subjectIsAssigned, setSubjectIsAssigned] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [subjectToPush, setSubjectToPush] = useState({
        subjectkey: null,
        subjectcode: '',
        subjectdescription: '',
        subjectsemester: '',
        subjectterm: '',
        subjectschedule: '',
        subjecttime: '',
      });
    const department = new URLSearchParams(location.search).get("department");
    useEffect(() => {
        //console.log("Selected Department:", department);
        // Your other logic here
    }, [department]);
    const dbref = ref(db, `Subjects/${department}`);
    const instructorRef = ref(db, 'Instructors');
    useEffect(()=>{
        const fetchInstructors = () =>{
            onValue(instructorRef,(instructorsSnap)=>{
                const instructors = instructorsSnap.val();
                if(instructors){
                    const instructorsArray = Object.entries(instructors).map(([key, value])=>({
                        key, ...value
                    }));
                    setInstructors(instructorsArray);
                }else{
                    setInstructors([]);
                }
            });
        }
        fetchInstructors();
        return()=>{
            onValue(instructorRef,()=>{});
        }
    }, [])
    useEffect(() => {
        const fetchData = () => {
            onValue(dbref, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const subjectsArray = Object.entries(data).map(([key, value]) => ({
                        key,
                        ...value,
                    }));
                    setSubjects(subjectsArray);
                } else {
                    setSubjects([]);
                }
            });
        };
        fetchData();
        return () => {
            onValue(dbref, () => { });
        };
    }, []);
    const filteredSubjects = subjects && subjects.filter(
        subject =>
            (subject.SubjectCode && subject.SubjectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (subject.SubjectDescription && subject.SubjectDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (subject.SubjectSemester && subject.SubjectSemester.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (subject.SubjectTerm && subject.SubjectTerm.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (subject.SubjectSchedule && subject.SubjectSchedule.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (subject.SubjectTime && subject.SubjectTime.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const addNewSubject = () => {
        const addNewSUbject = new Modal(document.getElementById('addNewSubject'));
        addNewSUbject.show();
        setModal(addNewSUbject);
    }
    const Submit = async (e) => {
        e.preventDefault();
        setSubjectKey(e);
        if (
            subjectTime.trim() === '' ||
            subjectSchedule.trim() === '' ||
            subjectCode.trim() === '' ||
            subjectDescription.trim() === '' ||
            subjectSemester.trim() === '' ||
            subjectTerm.trim() === ''
        ) {
            setFormSubmitted(true);
            setTimeout(() => {
                setFormSubmitted(false);
            }, 1500);
            return;
        }
        try {
            await push(dbref, {
                SubjectCode: subjectCode,
                SubjectDescription: subjectDescription,
                SubjectSemester: subjectSemester,
                SubjectTerm: subjectTerm,
                SubjectSchedule: subjectSchedule,
                SubjectTime: subjectTime,
                PostponeReason: ''
            });
            setSubjectCode('');
            setSubjectDescription('');
            setSubjectSemester('');
            setSubjectTerm('');
            setsubjectSchedule('');
            setsubjecTime('');
            setFormSubmitted(false);
            if(modal){
                modal.hide();
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleHistory = () => {
        nav(-1);
      }
      const Instructor = (subject) => {
        console.log('Clicked Subject:', subject.SubjectCode, subject.SubjectDescription, subject.SubjectSchedule, subject.SubjectTime);
        const instructorModal = new Modal(document.getElementById('instructors'));
        instructorModal.show();
        setModal(instructorModal);
        setSubjectToPush(subject);
        setSubjectKey(subject.key);
      }
      const AssignSubject = async (selectedInstructor) => {
        setSelectedInstructor(selectedInstructor);
    
        try {
            const pushSubjectRef = ref(db, `Instructors/${selectedInstructor.key}/Subjects/${subjectKey}`);
    
            // Check if the subject is already assigned to the instructor
            const existingAssignment = await get(pushSubjectRef);
            if (existingAssignment.exists()) {
                console.log('Subject is already assigned to the instructor.');
                setSubjectIsAssigned(true);
            } else {
                await set(pushSubjectRef, {
                    SubjectCode: subjectToPush?.SubjectCode,
                    SubjectDescription: subjectToPush?.SubjectDescription,
                    SubjectSemester: subjectToPush?.SubjectSemester,
                    SubjectTerm: subjectToPush?.SubjectTerm,
                    SubjectSchedule: subjectToPush?.SubjectSchedule,
                    SubjectTime: subjectToPush?.SubjectTime,
                }).then((e) => {
                    const assignment = new Modal(document.getElementById('Assignment'));
                    assignment.show();
                    if (modal) {
                        modal.hide();
                    }
                    setTimeout(() => {
                        assignment.hide();
                    }, 1500);
                })
                .catch((eror) => {
                    console.error(eror);
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="container-fluid p-5">
            <button className="btn btn-secondary my-2" onClick={handleHistory}>
        <GoArrowLeft className="mb-1" />
      </button>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <span>
                            <b>{department}</b>
                        </span><br />
                        <input className="mx-3 form-control" type="search" name="" id="" placeholder="Search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value) }} />
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Description</th>
                                <th>Subject Semester</th>
                                <th>Subject Term</th>
                                <th>Subject Schedule</th>
                                <th style={{ paddingLeft: '50px', paddingRight: '70px' }}>Subject Time</th>
                                <th className="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(
                                filteredSubjects.map(subject => (
                                    <tr key={subject.key} id="td">
                                        <td>{subject.SubjectCode}</td>
                                        <td>{subject.SubjectDescription}</td>
                                        <td>{subject.SubjectSemester}</td>
                                        <td>{subject.SubjectTerm}</td>
                                        <td>{subject.SubjectSchedule}</td>
                                        <td>{subject.SubjectTime}</td>
                                        <td className="button">
                                        <button
                            className="btn btn-success text-light mx-3"
                            onClick={() => {
                              Instructor(subject);
                            }}
                          >
                            Assign
                          </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary" onClick={addNewSubject}>
                        Add New Subject
                    </button>
                </div>
            </div>
            <div id="addNewSubject" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title h4">New Subject to {department}</div>
                        </div>
                        <form action="" onSubmit={Submit} className="form-control p-3 g-5">
                            <input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectCode.trim() === '' ? 'border border-danger' : ''}`} placeholder="Subject Code" type="text" name="" id="" />
                            <input value={subjectDescription} onChange={(e) => setSubjectDescription(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectDescription.trim() === '' ? 'border border-danger' : ''}`} placeholder="Subject Description" type="text" name="" id="" />
                            <select name="" className={`form-control my-3 ${formSubmitted && subjectSemester.trim() === '' ? 'border border-danger' : ''}`} value={subjectSemester} onChange={(e) => setSubjectSemester(e.target.value)} id="">
                                <option defaultValue='' selected hidden>Select Semester</option>
                                <option value="1st Semester">1st Semester</option>
                                <option value="2nd Semester">2nd Semester</option>
                            </select>
                            <select name="" className={`form-control my-3 ${formSubmitted && subjectTerm.trim() === '' ? 'border border-danger' : ''}`} value={subjectTerm} onChange={(e) => setSubjectTerm(e.target.value)} id="">
                                <option defaultValue='' selected hidden>Select Term</option>
                                <option value="1st Term">1st Term</option>
                                <option value="2nd Term">2nd Term</option>
                            </select>
                            <select name="" className={`form-control my-3 ${formSubmitted && subjectSchedule.trim() === '' ? 'border border-danger' : ''}`} value={subjectSchedule} onChange={(e) => setsubjectSchedule(e.target.value)} id="">
                                <option defaultValue='' selected hidden>Select Schedule</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wedsnday">Wedsnday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Monday-Wednsday-Friday">Monday-Wednsday-Friday</option>
                                <option value="Monday-Tuesday">Monday-Tuesday</option>
                            </select>
                            <select name="" id="" className={`form-control my-3 ${formSubmitted && subjectTime.trim() === '' ? 'border border-danger' : ''}`} value={subjectTime} onChange={(e) => setsubjecTime(e.target.value)}>
                                <option value="" selected hidden>Select Time</option>
                                <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
                                <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
                                <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
                                <option value="7:00 PM - 9:00 PM">7:00 PM - 9:00 PM</option>
                                <option value="8:30 AM - 10:30 AM">8:30 AM - 10:30 AM</option>
                                <option value="10:30 AM - 12:00 PM">10:30 AM - 12:00 PM</option>
                                <option value="1:30 PM - 3:30 PM">1:30 PM - 3:30 PM</option>
                                <option value="3:30 PM - 5:30 PM">3:30 PM - 5:30 PM</option>
                                <option value="5:30 PM - 7:30 PM">5:30 PM - 7:30 PM</option>
                                <option value="7:30 PM - 9:30 PM">7:30 PM - 9:30 PM</option>
                                <option value="8:00 AM - 12:00 PM">8:00 AM - 12:00 PM</option>
                                <option value="1:00 PM - 5:00 PM">1:00 PM - 5:00 PM</option>
                            </select>
                        </form>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button className="btn btn-primary" onClick={Submit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="instructors" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content" style={{ width: 'fit-content' }}>
            <div className="modal-header">
              <div className="text-dark text-uppercase h5">Assign Subject: <span className="text-primary h5"></span> </div>
            </div>
            <div className="modal-body text-success">
              <center className="text-success">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <td>Instructor</td>
                      <td>Email</td>
                      <td>Department</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                  {instructors.map((instructors) => {
                      if (instructors.Department === `${department}`) {
                        return (
                          <tr key={instructors.key}>
                            <td>{instructors.Instructor}</td>
                            <td>{instructors.Email}</td>
                            <td>{instructors.Department}</td>
                            <td>
                                {subjectIsAssigned && <button className="btn btn-success text-light mx-3" onClick={() => AssignSubject(instructors)}>Assign</button>}
                              
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </center>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" data-bs-dismiss="modal">Close</button></div>
          </div>
        </div>
      </div>
        </div>
    );
}
