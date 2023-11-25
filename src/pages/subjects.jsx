import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import { ref, push, onValue, remove } from "firebase/database";
import { db } from "../dbconfig/firebaseConfig";
export default function Subjects(){
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectDescription, setSubjectDescription] = useState('');
    const [subjectSemester, setSubjectSemester] = useState('');
    const [subjectTerm, setSubjectTerm] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [intructors, setInstructors] = useState(null);
    const [subjectKey, setSubjectKey] = useState(null);
    const dbref = ref(db, "Subjects/BSIT");
    
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
    const BSIT = () => {
        const bsit = new Modal(document.getElementById('BSIT'));
        bsit.show();
    }
    
    const Submit = async (e) =>{
        e.preventDefault();
        if(subjectCode.trim() === '' || subjectDescription.trim() === '' || subjectSemester.trim() === '' || subjectTerm.trim() === ''){
            setFormSubmitted(true);
            return;
        }
       await push(dbref, {SubjectCode: subjectCode, SubjectDescription: subjectDescription, SubjectSemester: subjectSemester, SubjectTerm: subjectTerm})
       .then(()=>{
        setSubjectCode('');
        setSubjectDescription('');
        setSubjectSemester('');
        setSubjectTerm('');
        setFormSubmitted(false);
        const bsit = new Modal(document.getElementById('BSIT'));
        const success = new Modal(document.getElementById('success'));
        bsit.hide();
        success.show();
        setTimeout(() => {
        success.hide();
        }, 1500);
       }).catch((error)=>{
        const err = new Modal(document.getElementById('error'));
        const errorContent = document.getElementById('errorContent');
        errorContent.textContent = `Error: ${error.message || 'Unknown error'}`;
        err.show();
       })
    }
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
    
        const subjectRef = ref(db, `Subjects/BSIT/${subjectKey}`);
        remove(subjectRef)
          .then(() => {
            const deleteInfo = document.getElementById('deleteID');
            deleteInfo.textContent = "Subject Deleted";
            const deleteModal = new Modal(document.getElementById('deleteModal'));
            setTimeout(() => {

                
                deleteModal.hide();
            }, 2000);
          })
          .catch((error) => {
            const deleteInfo = document.getElementById('deleteID');
            deleteInfo.textContent = `Error: ${error.message || 'Unknown error'}`;
          });
      };
      
    return(
        <div className="container-fluid">
                <div className="row">
                    <div className="col-6 g-5">
                    <div className="card">
                      <div className="card-title">
                        <span>
                          <b>BSIT</b>
                        </span>
                      </div>
                      <div className="card-body">
                        <table className="table table-stripped">
                          <thead>
                            <tr>
                              <th>Subject Code</th>
                              <th>Subject Description</th>
                              <th>Subject Semester</th>
                              <th>Subject Term</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                          {subjects.map((subject) => (
                              <tr key={subject.key}>
                                <td>{subject.SubjectCode}</td>
                                <td>{subject.SubjectDescription}</td>
                                <td>{subject.SubjectSemester}</td>
                                <td>{subject.SubjectTerm}</td>
                                <td>
                                  <button className="btn btn-primary" onClick={() => { ViewInstructors(subject) }}>View</button>
                                  <button className="btn btn-danger mx-3" onClick={() => { ConfirmationModal(subject) }}>Delete</button>
                                </td>
                              </tr>
                            ))}
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
                    <div className="col-6 g-5">
                        <div className="card">
                            <div className="card-title">
                                <span><b>BSCRIM</b></span>
                            </div>
                            <div className="card-body">
                                <table className="table table-stripped">
                                <thead>
                                    <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Description</th>
                                    <th>Subject Semester</th>
                                    <th>Subject Term</th>
                                    <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>IT101</td>
                                    <td>Introduction to Computing</td>
                                    <td>1st Semester</td>
                                    <td>1st Term</td>
                                    <td><button className="btn btn-primary">View</button></td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary">New</button>
                            </div>
                            </div>
                    </div>
                    <div className="col-6 g-5">
                        <div className="card">
                            <div className="card-title">
                                <span><b>BSHM</b></span>
                            </div>
                            <div className="card-body">
                                <table className="table table-stripped">
                                <thead>
                                    <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Description</th>
                                    <th>Subject Semester</th>
                                    <th>Subject Term</th>
                                    <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>IT101</td>
                                    <td>Introduction to Computing</td>
                                    <td>1st Semester</td>
                                    <td>1st Term</td>
                                    <td><button className="btn btn-primary">View</button></td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary">New</button>
                            </div>
                            </div>
                    </div>
                    <div className="col-6 g-5">
                        <div className="card">
                            <div className="card-title">
                                <span><b>BSBA</b></span>
                            </div>
                            <div className="card-body">
                                <table className="table table-stripped">
                                <thead>
                                    <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Description</th>
                                    <th>Subject Semester</th>
                                    <th>Subject Term</th>
                                    <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>IT101</td>
                                    <td>Introduction to Computing</td>
                                    <td>1st Semester</td>
                                    <td>1st Term</td>
                                    <td><button className="btn btn-primary">View</button></td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary">New</button>
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
                        <input value={subjectSemester} onChange={(e)=>setSubjectSemester(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectSemester.trim() === '' ? 'border border-danger': ''}`} placeholder="Subject Semester" type="text" name="" id="" />
                        <input value={subjectTerm} onChange={(e)=>setSubjectTerm(e.target.value)} className={`form-control my-3 ${formSubmitted && subjectTerm.trim() === '' ? 'border border-danger': ''}`} placeholder="Subject Term" type="text" name="" id="" />
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
                    <div className="modal-content">
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
                        </center>
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button className="btn btn-danger" onClick={deleteSubject}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
    );
}