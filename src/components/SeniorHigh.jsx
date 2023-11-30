import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import { ref, push, onValue, remove } from "firebase/database";
import { db } from "../dbconfig/firebaseConfig";
import "../styles/style.css";
export default function SeniorHigh(){
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectDescription, setSubjectDescription] = useState('');
    const [subjectSemester, setSubjectSemester] = useState('');
    const [subjectTerm, setSubjectTerm] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [intructors, setInstructors] = useState(null);
    const [subjectKey, setSubjectKey] = useState(null);
    const [departmens, setDepartment] = useState([]);
    const [subjectSchedule, setsubjectSchedule] = useState('');
    const [subjectTime, setsubjecTime] = useState('');
    const [modal, setModal] = useState(null);
    const [modalDelete, setModalDelete] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const dbref = ref(db, "Subjects/BSIT");
    const ins = ref(db, 'Instructors/');
    useEffect(() => {
      const bsitModal = new Modal(document.getElementById('BSIT'));
      bsitModal._element.addEventListener('hidden.bs.modal', () => {
          setSubjectCode('');
          setSubjectDescription('');
          setSubjectSemester('');
          setSubjectTerm('');
          setsubjectSchedule('');
          setsubjecTime('');
      });
      return () => {
          bsitModal._element.removeEventListener('hidden.bs.modal', () => {
          });
      };
  }, []);
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
      onValue(dbref, () => {});
    };
  }, []);
  
  useEffect(() => {
    const fetchData = () => {
      onValue(ins, (snapshot) => {
        const datains = snapshot.val();
        if (datains) {
          const insArray = Object.entries(datains).map(([key, value]) => ({
            key,
            ...value,
          }));
          setDepartment(insArray);
        } else {
          setDepartment([]);
        }
      });
    };
    
    fetchData();

    return () => {
      onValue(ins, () => {});
    };
  }, []);
    const BSIT = () => {
        const bsit = new Modal(document.getElementById('BSIT'));
        bsit.show();
        setModal(bsit);
    }
    
    const Submit = async (e) => {
      e.preventDefault();
      
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
              SubjectTime: subjectTime
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
            const success = new Modal(document.getElementById('success'));
            success.show();
            setTimeout(() => {
                success.hide();
            }, 1500);
          }
      } catch (error) {
          const err = new Modal(document.getElementById('error'));
          const errorContent = document.getElementById('errorContent');
          errorContent.textContent = `Error: ${error.message || 'Unknown error'}`;
          err.show();
      }
  };
  
    const ViewInstructors = (subject) => {
        const Instructors = new Modal(document.getElementById('Instructors'));
        Instructors.show();
        setInstructors(subject);
      };
      
      const ConfirmationModal = (subject) => {
        const deleteModal = new Modal(document.getElementById('deleteModal'));
        deleteModal.show();
        setInstructors(subject);
        setSubjectKey(subject.key);
      };
      const deleteSubject = () => {
        if (!subjectKey) {
            console.error("Subject key is not defined");
            return;
        }
        const deleteModal = new Modal(document.getElementById('deleteModal'));
        deleteModal.show();
        setModalDelete(deleteModal);
    
        const subjectRef = ref(db, `Subjects/BSIT/${subjectKey}`);
        remove(subjectRef)
            .then(() => {
                const deleteInfo = document.getElementById('deleteID');
                deleteInfo.textContent = "Subject Deleted";
                setTimeout(() => {
                  //see how fucked up my programming? dili ma close ang delete modal so i have to manually remove the back drop haha 
                    deleteModal.hide();
                    const modalBackdrop = document.querySelector('.modal-backdrop');
                    if (modalBackdrop) {
                        modalBackdrop.parentNode.removeChild(modalBackdrop);
                    }
                }, 2000);
                const successModal = new Modal(document.getElementById('successDelete'));
                successModal.show();
                setTimeout(() => {
                    successModal.hide();
                    const modalBackdrop = document.querySelector('.modal-backdrop');
                    if (modalBackdrop) {
                        modalBackdrop.parentNode.removeChild(modalBackdrop);
                    }
    
                }, 1500);
            })
            .catch((error) => {
                const deleteInfo = document.getElementById('deleteID');
                deleteInfo.textContent = `Error: ${error.message || 'Unknown error'}`;
                deleteModal.hide();
                const errorModal = new Modal(document.getElementById('error'));
                errorModal.show();
                setTimeout(() => {
                    errorModal.hide();
                    const modalBackdrop = document.querySelector('.modal-backdrop');
                    if (modalBackdrop) {
                        modalBackdrop.parentNode.removeChild(modalBackdrop);
                    }
    
                }, 1500);
            });
    };
    
      const Instructor = (subject) => {
        console.log('Clicked Subject:', subject.SubjectCode, subject.SubjectDescription, subject.SubjectSchedule, subject.SubjectTime);
        const instructorModal = new Modal(document.getElementById('instructors'));
        instructorModal.show();
        setInstructors(subject);
      }
      const AssignSubject = (selectedInstructor) => {
        if (selectedInstructor) {
          console.log('selected instructor', selectedInstructor.Instructor, selectedInstructor.key);
          setSelectedInstructor(selectedInstructor);
        } else {
          console.error('Selected instructor is undefined.');
        }
      }
      
    return(
        <div className="container-fluid" id="subjects">
                <div className="row">
                  <div className="col-md-10 col-xl-6 col-lg-6 g-5">
                    <div className="card">
                      <div className="card-header">
                      <div className="card-title">
                        <span>
                          <b>BSIT</b>
                        </span>
                      </div>
                      </div>
                      <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Subject Code</th>
                                        <th>Subject Description</th>
                                        <th>Subject Semester</th>
                                        <th>Subject Term</th>
                                        <th>Subject Schedule</th>
                                        <th style={{paddingLeft: '50px', paddingRight: '70px'}}>Subject Time</th>
                                        <th className="actions">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="no-data">No data</td>
                                        </tr>
                                    ) : (
                                        subjects.map((subject) => (
                                            <tr key={subject.key} id="td">
                                                <td>{subject.SubjectCode}</td>
                                                <td>{subject.SubjectDescription}</td>
                                                <td>{subject.SubjectSemester}</td>
                                                <td>{subject.SubjectTerm}</td>
                                                <td>{subject.SubjectSchedule}</td>
                                                <td>{subject.SubjectTime}</td>
                                                <td className="button">
                                                    <button className="btn btn-success text-light mx-3" onClick={() => { Instructor(subject) }}>Assign</button>
                                                    <button className="btn btn-primary" onClick={() => { ViewInstructors(subject) }}>View</button>
                                                    <button className="btn btn-danger mx-3" onClick={() => { ConfirmationModal(subject) }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                      <div className="card-footer">
                        <button className="btn btn-primary" onClick={BSIT}>
                          New
                        </button>
                      </div>
                    </div>
                    </div>
                    
                </div>
                <div id="BSIT" className="modal fade" tabIndex="-1" role="dialog">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <div className="modal-title h4">New Subject to BSIT</div>
                      </div>
                      <form action="" onSubmit={Submit} className="form-control p-3 g-5">
                        <input value={subjectCode} onChange={(e)=>setSubjectCode(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectCode.trim() === '' ? 'border border-danger': ''}`} placeholder="Subject Code" type="text" name="" id="" />
                        <input value={subjectDescription} onChange={(e)=>setSubjectDescription(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectDescription.trim() === '' ? 'border border-danger': ''}`} placeholder="Subject Description" type="text" name="" id="" />
                        {/**<input value={subjectSemester} onChange={(e)=>setSubjectSemester(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectSemester.trim() === '' ? 'border border-danger': ''}`} placeholder="Subject Semester" type="text" name="" id="" /> 
                        <input value={subjectTerm} onChange={(e)=>setSubjectTerm(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectTerm.trim() === '' ? 'border border-danger': ''}`} placeholder="Subject Term" type="text" name="" id="" />*/}
                        <select name="" className={`form-control my-3 ${formSubmitted && subjectSemester.trim() === '' ? 'border border-danger': ''}`} value={subjectSemester} onChange={(e)=>setSubjectSemester(e.target.value)} id="">
                          <option defaultValue='' selected hidden>Select Semester</option>
                          <option value="1st Semester">1st Semester</option>
                          <option value="2nd Semester">2nd Semester</option>
                        </select>
                        <select name="" className={`form-control my-3 ${formSubmitted && subjectTerm.trim() === '' ? 'border border-danger': ''}`} value={subjectTerm} onChange={(e)=>setSubjectTerm(e.target.value)} id="">
                          <option defaultValue='' selected hidden>Select Term</option>
                          <option value="1st Term">1st Term</option>
                          <option value="2nd Term">2nd Term</option>
                        </select>
                        <select name="" className={`form-control my-3 ${formSubmitted && subjectSchedule.trim() === '' ? 'border border-danger': ''}`} value={subjectSchedule} onChange={(e)=>setsubjectSchedule(e.target.value)} id="">
                          <option defaultValue='' selected hidden>Select Schedule</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wedsnday">Wedsnday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                        {/**
                        <input className={`form-control my-3 ${formSubmitted && subjectTime.trim() === '' || formSubmitted &&  subjectTime.trim() === '00:00 AM - 00:00 AM' || formSubmitted &&  subjectTime.trim() === '00:00 PM - 00:00 PM' ? 'border border-danger': ''}`} value={subjectTime} onChange={handleChange} type="text" name="" placeholder="Type Time e.g 8:00 AM - 10:00 AM" id="" />
                         * 
                         */}
                        <select name="" id="" className={`form-control my-3 ${formSubmitted && subjectTime.trim() === '' ? 'border border-danger': ''}`} value={subjectTime} onChange={(e) => setsubjecTime(e.target.value)}>
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
                <div id="success" className="modal fade" tabIndex="-1" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-body text-success">
                        <center className="text-success h4">New Subject added</center>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="successDelete" className="modal fade" tabIndex="-1" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-body text-success">
                        <center className="text-success h4">Subject Deleted</center>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="error" className="modal fade" tabIndex="-1" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-body text-success">
                        <center className="text-danger h4"><p id="errorContent"></p></center>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="Instructors" className="modal fade p-5" tabIndex="-1" role="dialog">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title h5">Subject: {intructors?.SubjectCode}</div>
                        </div>
                      <div className="modal-body text-success">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <td scope="col">Subject Code</td>
                                    <td scope="col">Subject Desciption</td>
                                    <td scope="col">Subject Semester</td>
                                    <td scope="col">Subject Term</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td scope="col"><b>{intructors?.SubjectCode}</b></td>
                                    <td scope="col"><b>{intructors?.SubjectDescription}</b></td>
                                    <td scope="col"><b>{intructors?.SubjectSemester}</b></td>
                                    <td scope="col"><b>{intructors?.SubjectTerm}</b></td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    <div className="modal-footer"><button className="btn btn-secondary" data-bs-dismiss="modal">Close</button></div>
                    </div>
                  </div>
                </div>
                <div id="deleteModal" className="modal fade" tabIndex="-1" role="dialog">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{width: 'fit-content'}}>
                      <div className="modal-body text-success">
                        <center className="text-danger h5 text-uppercase" id="deleteID">Are you sure you want to delete Subject?</center><br />
                        <center>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <td scope="col">Subject Code</td>
                                    <td scope="col">Subject Desciption</td>
                                    <td scope="col">Subject Semester</td>
                                    <td scope="col">Subject Term</td>
                                    <td style={{paddingLeft: '50px', paddingRight: '70px'}} scope="col" className="time-cell">Subject Time</td>
                                    <td scope="col">Subject Schedule</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><b>{intructors?.SubjectCode}</b></td>
                                    <td><b>{intructors?.SubjectDescription}</b></td>
                                    <td><b>{intructors?.SubjectSemester}</b></td>
                                    <td><b>{intructors?.SubjectTerm}</b></td>
                                    <td className="time-cell"><b>{intructors?.SubjectTime}</b></td>
                                    <td><b>{intructors?.SubjectSchedule}</b></td>
                                </tr>
                            </tbody>
                        </table>
                        </center>
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button className="btn btn-danger" onClick={deleteSubject}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="instructors" className="modal fade" tabIndex="-1" role="dialog">
                  <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content" style={{width: 'fit-content'}}>
                      <div className="modal-header">
                        <div className="text-dark text-uppercase h5">Assign Subject: <span className="text-primary h5">{intructors?.SubjectCode} {intructors?.SubjectDescription}</span> </div>
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
                              {departmens.map((ins) => {
                                if (ins.Department === 'BSIT') {
                                  return (
                                    <tr key={ins.key}>
                                      <td>{ins.Instructor}</td>
                                      <td>{ins.Email}</td>
                                      <td>{ins.Department}</td>
                                      <td>
                                      <button className="btn btn-success text-light mx-3" onClick={() => AssignSubject(ins)}>Assign</button>
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