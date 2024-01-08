import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ref, push, set, remove, onValue, get } from 'firebase/database';
import { db } from "../dbconfig/firebaseConfig";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import {FaEdit} from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import {VscArrowSmallUp, VscArrowUp} from 'react-icons/vsc';
import {FcReuse} from 'react-icons/fc';
export default function Departments() {
    const nav = useNavigate();
    const location = useLocation();
  const [availableSchedule, setAvailableSchedule] = useState([]);
  const [availableTime, setAvailableTime] = useState([]);
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
    const [subjectState, setSubjectState] = useState(null);
    const [subjectSchedules, setSubjectSchedules] = useState([]);
    const [time, SetTime] = useState([]);
    const [schoolYear, setSubjectSchoolYear] = useState([]);
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
    const timeRef = ref(db, 'Subject Time');
    const schedRef = ref(db, 'Subject Schedules');
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
    }, []);
    useEffect(()=>{
        const fetchTime = () =>{
          onValue(timeRef,(timeSnap)=>{
            const timeData = timeSnap.val();
            if(timeData){
              const timeArray = Object.entries(timeData).map(([key, value])=>({key, ...value}));
              setAvailableTime(timeArray);
            }else{
              setAvailableTime([]);
            }
          });
        }
        fetchTime();
        return () =>{onValue(timeRef,()=>{});}
      },[]);
      //prevent time options infinite loop also optional lang sad 
      //putting the availableTime in the dependancy array in the useEffect will cause it to loop infinitely 
      //code below is the solution
      useEffect(() => {
        // this useEffect is optional
        // This code will run whenever availableTime changes
      }, [availableTime]);
    
      useEffect(()=>{
        const fetchSched = () =>{
          onValue(schedRef,(schedSnap)=>{
            const schedData = schedSnap.val();
            if(schedData){
              const schedArray = Object.entries(schedData).map(([key, value])=>({key, ...value}));
              setAvailableSchedule(schedArray);
            }else{
              setAvailableSchedule([]);
            }
          });
        }
        fetchSched();
        return () =>{onValue(schedRef,()=>{});}
      },[]);
      useEffect(()=>{},[setAvailableSchedule]);
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
      const Instructor = async (subject) => {
        console.log('Clicked Subject:', subject.SubjectCode, subject.SubjectDescription, subject.SubjectSchedule, subject.SubjectTime);
    
        const instructorModal = new Modal(document.getElementById('instructors'));
        instructorModal.show();
        setModal(instructorModal);
        setSubjectToPush(subject);
        setSubjectKey(subject.key);
    
        //try {
        //    for (const instructor of instructors) {
        //        const subRef = ref(db, `Instructors/${instructor.key}/Subjects/${subjectKey}`);
        //        const isSubjectExists = await get(subRef);
    //
        //        if (isSubjectExists.exists()) {
        //            setSubjectIsAssigned(true);
        //            return;
        //        }
        //    }
    //
        //    setSubjectIsAssigned(false);
        //} catch (error) {
        //    console.error(error);
        //}
    };
    
    
      const AssignSubject = async (selectedInstructor) => {
        setSelectedInstructor(selectedInstructor);
        //console.log({ ...subjectToPush });
            try {
            const pushSubjectRef = ref(db, `Instructors/${selectedInstructor.key}/Subjects/${subjectKey}`);
            const existingAssignment = await get(pushSubjectRef);
            if (existingAssignment.exists()) {
                console.log('Subject is already assigned to the instructor.');
                setSubjectIsAssigned(true);
                setSubjectState(null);                    
                setTimeout(() => {
                    setSubjectIsAssigned(null);
                }, 5000);
            } else {
                await set(pushSubjectRef, {
                    SubjectCode: subjectToPush?.SubjectCode,
                    SubjectDescription: subjectToPush?.SubjectDescription,
                    SubjectSemester: subjectToPush?.SubjectSemester,
                    SubjectTerm: subjectToPush?.SubjectTerm,
                    SubjectSchedule: subjectToPush?.SubjectSchedule,
                    SubjectTime: subjectToPush?.SubjectTime,
                }).then((e) => {
                    setSubjectIsAssigned(null);
                    setSubjectState(true);
                    setTimeout(() => {    
                    setSubjectState(null);                    
                }, 5000);
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const editSubject = (subject) => {
        const editModal = new Modal(document.getElementById('editModal'));
        editModal.show();
        setModal(editModal);
        setSubjectToPush({
            subjectkey: subject.key,
            subjectcode: '',
            subjectdescription: '',
            subjectsemester: '',
            subjectterm: '',
            subjectschedule: '',
            subjecttime: '',
        });
        setSubjectKey(subject.key);
      }
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
                            Assign <VscArrowUp />
                          </button>
                          <button className="btn btn-primary" onClick={() => {
                            editSubject(subject);
                          }}>Edit <b><FaEdit className="mb-1"/></b></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary" onClick={addNewSubject}>
                        Add New Subject<IoMdAddCircle className="m-1"/>
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
                                <option defaultValue=''hidden>Select Schedule</option>
                                            {availableSchedule.map((sched)=>(
                                <option value={sched.key}>{sched.key}</option>
                            ))}
                            </select>
                            <select name="" id="" className={`form-control my-3 ${formSubmitted && subjectTime.trim() === '' ? 'border border-danger' : ''}`} value={subjectTime} onChange={(e) => setsubjecTime(e.target.value)}>
                                <option value=""hidden>Select Time</option>
                                            {availableTime.map((time)=>(
                                <option value={time.key}>{time.key}</option>
                            ))}
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
              <div className="text-dark text-uppercase h5">Assign Subject: <span className="text-primary h5">{subjectToPush?.SubjectCode} {subjectToPush?.SubjectDescription}</span> </div>
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
                      if (instructors.Department === department) {
                        return (
                          <tr key={instructors.key}>
                            <td>{instructors.Instructor}</td>
                            <td>{instructors.Email}</td>
                            <td>{instructors.Department}</td>
                            <td>
                               <button className="btn btn-success text-light mx-3" onClick={() => AssignSubject(instructors)}>Assign</button>
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
                {subjectIsAssigned && <div className="alert alert-danger alert-dismissible lead">Subject is Already assigned to the selected Instructor <p className="text-uppercase">{selectedInstructor.Instructor}</p></div>}
                {subjectState && <div className="alert alert-success alert-dismissible lead">Subject assigned to Instructor <p className="text-uppercase">{selectedInstructor.Instructor}</p></div>}
              </center>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" data-bs-dismiss="modal">Close</button></div>
          </div>
        </div>
      </div>
        </div>
    );
}
