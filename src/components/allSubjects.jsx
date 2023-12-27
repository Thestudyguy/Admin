import React, { useState, useEffect } from "react";
import { db } from "../dbconfig/firebaseConfig";
import { onValue, ref, push } from "firebase/database";
import { GoArrowLeft } from 'react-icons/go';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Modal } from "bootstrap";

export default function AllSubjects() {
  const [allSubjects, setAllSubjects] = useState([]);
  const [modal, setModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [formState, setFormState] = useState({
    SubjectCode: '',
    SubjectDescription: '',
    SubjectSemester: '',
    SubjectTerm: '',
    SubjectSchedule: '',
    SubjectTime: '',
    departments: {
      BSIT: false,
      BSBA: false,
      BSHM: false,
      BSCRIM: false,
      BTVTED: false,
      SeniorHigh: false,
    },
  });
  const [instructorLists, setInstructorLists] = useState([]);
  const instructorRef = ref(db, 'Instructors');
  useEffect(() => {
    onValue(instructorRef, (instructorSnaps) => {
      const instructorData = instructorSnaps.val();
      if (instructorData) {
        const instructors = Object.entries(instructorData).map(([key, value]) => ({
          key, ...value
        }));
        setInstructorLists(instructors);
      } else {
        setInstructorLists([]);
      }
      return onValue(instructorRef, () => { }, []);
    }, [])
  }, [])
  const handleCheckboxChange = (department) => {
    setFormState((prevState) => ({
      ...prevState,
      departments: {
        ...prevState.departments,
        [department]: !prevState.departments[department],
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const dataToPush = {
      SubjectCode: formState.SubjectCode,
      SubjectDescription: formState.SubjectDescription,
      SubjectSemester: formState.SubjectSemester,
      SubjectTerm: formState.SubjectTerm,
      SubjectSchedule: formState.SubjectSchedule,
      SubjectTime: formState.SubjectTime,
      departments: {},
    };
    Object.keys(formState.departments).forEach((department) => {
      if (formState.departments[department]) {
        dataToPush.departments[department] = true;
      }
    });

    // Push data to Firebase under each selected department
    Object.keys(dataToPush.departments).forEach(async (department) => {
      const subjectsRef = ref(db, `Subjects/${department}`);
      await push(subjectsRef, dataToPush);
    });

    // Clear the form or perform any other necessary actions
    setFormState({
      SubjectCode: '', // Use the correct capitalization
      SubjectDescription: '',
      SubjectSemester: '',
      SubjectTerm: '',
      SubjectSchedule: '',
      SubjectTime: '',
      departments: {
        BSIT: false,
        BSBA: false,
        BSHM: false,
        BSCRIM: false,
        BTVTED: false,
        SeniorHigh: false,
      },
    });

    // Close the modal if you're using Bootstrap modal
    if (modal) {
      modal.hide();
    }
  };



  const nav = useNavigate();
  useEffect(() => {
    const subjectsRef = ref(db, "Subjects");

    onValue(subjectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const subjectsData = snapshot.val();
        const combinedSubjects = Object.keys(subjectsData).reduce((result, department) => {
          Object.keys(subjectsData[department]).forEach((subjectKey) => {
            result.push({
              department,
              key: subjectKey,
              ...subjectsData[department][subjectKey],
            });
          });
          return result;
        }, []);
        setAllSubjects(combinedSubjects);
      } else {
        setAllSubjects([]);
      }
    });
  }, []);

  const addNewSubject = (e) => {
    e.preventDefault();
    const openNewSubject = new Modal(document.getElementById('newSubject'));
    openNewSubject.show();
    setModal(openNewSubject);
  }

  const handleHistory = () => {
    nav(-1);
  }
  const ViewInstructors = (subject) =>{
      setSelectedSubject(subject);
    const instructorModal = new Modal(document.getElementById('Instructors'));
    instructorModal.show();
  }
  const assignSubject = (instructor) => {
    console.log('Selected Subject:', selectedSubject);
    if (selectedSubject) {
      const subject = selectedSubject.key;
      const dbref = ref(db, `Instructors/${instructor.key}/Subjects`);
      setSelectedInstructor(instructor);
  
      try {
        push(dbref ,{
          PostponeReason: '',
          SubjectCode: selectedSubject.SubjectCode || '',
        SubjectDescription: selectedSubject.SubjectDescription || '',
        SubjectSemester: selectedSubject.SubjectSemester || '',
        SubjectTerm: selectedSubject.SubjectTerm || '',
        SubjectSchedule: selectedSubject.SubjectSchedule || '',
        SubjectTime: selectedSubject.SubjectTime || '',
        })
          .then(() => {
            console.log('Subject added to instructor\'s schedule');
          })
          .catch((error) => {
            console.error('Error adding subject to instructor\'s schedule:', error);
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('selectedSubject is null or undefined');
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSubjects = allSubjects.filter((subject) => {
    const subjectData = `${subject.department} ${subject.SubjectCode} ${subject.SubjectDescription} ${subject.SubjectSchedule} ${subject.SubjectSemester} ${subject.SubjectTerm} ${subject.SubjectTime}`.toLowerCase();
    return subjectData.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container-fluid" id="allSubjects">
      <button className="btn btn-secondary my-2" onClick={handleHistory}>
        <GoArrowLeft className="mb-1" />
      </button>
      <div className="container p-5">
        <div className="card" style={{ resize: 'auto' }}>
          <div className="card-header">
            <div className="card-title">
              <div className="p-2">All Departments Subjects</div>
              <div className="">
                <input
                  type="search"
                  placeholder="Search..."
                  className="form-control"
                  name=""
                  id=""
                  value={searchTerm}
            onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Subject Code</th>
                  <th>Subject Description</th>
                  <th>Subject Schedule</th>
                  <th>Subject Semester</th>
                  <th>Subject Term</th>
                  <th>Subject Time</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
              {filteredSubjects.map((subject) => (
              <tr key={subject.key}>
                <td>{subject.department}</td>
                <td>{subject.SubjectCode}</td>
                <td>{subject.SubjectDescription}</td>
                <td>{subject.SubjectSchedule}</td>
                <td>{subject.SubjectSemester}</td>
                <td>{subject.SubjectTerm}</td>
                <td>{subject.SubjectTime}</td>
                {/* <td>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      ViewInstructors(subject);
                    }}
                  >
                    Assign
                  </button>
                </td> */}
              </tr>
            ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={addNewSubject}>
              New
            </button>
          </div>
        </div>
      </div>
      <div id="newSubject" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="container">
                <span className="lead">Add new subject</span>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={submitForm}>
                <input type="text" value={formState.SubjectCode} onChange={handleInputChange} name="SubjectCode" placeholder="Subject Code" id="" className="form-control mb-2" />
                <input type="text" value={formState.SubjectDescription} onChange={handleInputChange} name="SubjectDescription" placeholder="Subject Description" id="" className="form-control mb-2" />
                <select name="SubjectSemester" value={formState.SubjectSemester} onChange={handleInputChange} id="" className="form-control mb-2">
                  <option value="" hidden>Select Semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                </select>
                <select name="SubjectTerm" value={formState.SubjectTerm} onChange={handleInputChange} id="" className="form-control mb-2">
                  <option value="" hidden>Select Term</option>
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                </select>
                <hr />
                <div className="departments d-flex flex-column">
                  <span className="lead">Select Department</span>
                  {Object.keys(formState.departments).map((department) => (
                    <div className="form-check" key={department.toUpperCase()}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={department}
                        checked={formState.departments[department]}
                        onChange={() => handleCheckboxChange(department)}
                      />
                      <label className="form-check-label" htmlFor={department}>
                        {department.toUpperCase()}
                      </label>
                    </div>
                  ))}
                </div>
                <hr />
                <select name="SubjectSchedule" value={formState.SubjectSchedule} onChange={handleInputChange} id="" className="form-control mb-2">
                  <option value="" hidden>Select Schedule</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Monday-Wednesday-Friday">Monday-Wednesday-Friday</option>
                  <option value="Monday-Tuesday">Monday-Tuesday</option>
                </select>
                <select name="SubjectTime" value={formState.SubjectTime} onChange={handleInputChange} id="" className="form-control mb-2">
                  <option value="" hidden>Select Time</option>
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
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
              <button type="submit" className="btn btn-primary" onClick={submitForm}>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div id="Instructors" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title lead">Assign Subject:<b> {selectedSubject?.SubjectDescription}</b></div>
            </div>
            <div className="modal-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Instructor</th>
                    <th scope="col">Email</th>
                    <th scope="col">Department</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {instructorLists.map(instructors =>(
                        <tr key={instructors.key}>
                          <td>{instructors.Instructor}</td>
                          <td>{instructors.Email}</td>
                          <td>{instructors.Department}</td>
                          <td><button className="btn btn-success" onClick={()=>{assignSubject(instructors)}}>Assign</button></td>
                        </tr>
                    ))}
                </tbody>
              </table>
              <center className="text-danger h4"><p id="errorContent"></p></center>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}