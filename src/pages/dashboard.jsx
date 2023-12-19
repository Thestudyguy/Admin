import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { db } from "../dbconfig/firebaseConfig";
import { push, ref, onValue, remove, get, set } from "firebase/database";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const dbref = ref(db, "Instructors");
  const [showModal, setShowModal] = useState(null);
  const [name, Setname] = useState('');
  const [email, Setemail] = useState('');
  const [username, Setusername] = useState('');
  const [password, SetPassword] = useState('');
  const [randomNumber, setRandomNumber] = useState(null);
  const [department, setDepartment] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [DeleteKey, setDeleteKey] = useState(null);
  const [InstructorSubjects, setInstructorsSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectToRemove, setSubjectToRemove] = useState(null);
  const [subjectEdit, setSubjectEdit] = useState({
    SubjectCode: '',
    SubjectDescription: '',
    SubjectSchedule: '',
    SubjectSemester: '',
    SubjectTerm: '',
    SubjectTime: '',
    PostponeReason: ''
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubjectEdit((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const nav = useNavigate();
  
useEffect(() => {
  const fetchData = () => {
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const instructorArray = Object.entries(data).map(([key, value]) => ({
          key,
          ...value,
        }));
        setInstructors(instructorArray);
      } else {
        setInstructors([]);
      }
    });
  };
  fetchData();

  return () => {
    onValue(dbref, () => {});
  };
}, []);


  const generateRandomNumber = (e) => {
    e.preventDefault();
    const newRandomNumber = Math.floor(Math.random() * 1000000);
    //const newRandomNumber1 = Math.floor(Math.random() * 10000);
    //const randomID = Math.floor(newRandomNumber + newRandomNumber1);
    setRandomNumber(newRandomNumber);
  };

  const pushdata = async () => {
    if (username.trim() === '' || password.trim() === '' || name.trim() === '' || email.trim() === '' || department.trim() === '', randomNumber === null) {
      setFormSubmitted(true);
      return;
    }
  
   await push(dbref, {
      ID: randomNumber,
      Instructor: name,
      Email: email,
      Department: department,
      UserName: username,
      Password: password
    })
      .then(() => {
        setRandomNumber(null);
        Setname('');
        Setemail('');
        setDepartment('');
        Setusername('');
        SetPassword('');
        setFormSubmitted(false);
        if (showModal) {
          showModal.hide();
          const success = new Modal(document.getElementById('success'));
          success.show();
          setTimeout(() => {
            success.hide();
          }, 1500);
        }
      })
      .catch((error) => {
        console.error('Error pushing data:', error);
        const errorModal = new Modal(document.getElementById('error'));
        const errorContent = document.getElementById('errorContent');
        errorContent.textContent = `Error: ${error.message || 'Unknown error'}`;
        errorModal.show();
      });
  };
  const newInstuctorModal = () => {
    const newInstructor = new Modal(document.getElementById('create'));
    newInstructor.show();
    setShowModal(newInstructor);
  };

  const handleViewClick = (instructor) => {
    setSelectedInstructor(instructor);
    const subjectRef = ref(db, `Instructors/${instructor.key}/Subjects`);
    console.log(instructor.Instructor);
    get(subjectRef).then((subjectSnapshot) => {
      const subjects = subjectSnapshot.val();
      console.log("Subjects from Firebase:", subjects);
  
      if (subjects) {
        const subjectArray = Object.entries(subjects).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        console.log("Mapped Subject Array:", subjectArray);
        setInstructorsSubjects(subjectArray);
      } else {
        console.log("No subjects available.");
        setInstructorsSubjects([]);
      }
  
      const view = new Modal(document.getElementById('view'));
      view.show();
      setShowModal(view);
      setSelectedInstructor(instructor);
    });
  };
  


const handleDeleteClick = (instructor) => {
  setDeleteKey(instructor.key);
  setSelectedInstructor(instructor);
  const deleteModal = new Modal(document.getElementById('delete'));
  deleteModal.show();
  setShowModal(deleteModal);
};

const deleteKey = async () => {
  if (!DeleteKey) {
    console.error('No instructor selected for deletion');
    return;
  }

  const deleteRef = ref(db, `Instructors/${DeleteKey}`);
  console.log(DeleteKey);
  console.log(deleteRef);

  try {
    await remove(deleteRef);
    console.log('Instructor deleted successfully');
    
    if (showModal) {
      showModal.hide();
      const successDelete = new Modal(document.getElementById('successDelete'));
      successDelete.show();
      setTimeout(() => {
        successDelete.hide();
      }, 1500);
    }
  } catch (error) {
    console.error('Error deleting instructor:', error);
    const errorModal = new Modal(document.getElementById('error'));
    const errorContent = document.getElementById('errorContent');
    errorContent.textContent = `Error: ${error.message || 'Unknown error'}`;
    errorModal.show();
  }
};
const filteredInstructors = instructors.filter((instructor) =>
instructor.Instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
instructor.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
instructor.ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
instructor.Department.toLowerCase().includes(searchTerm.toLowerCase())
);
const removeSubjectModal = (subject) =>{
  setSubjectToRemove(subject);
  if(showModal){
    showModal.hide();
    const modaltoRemove = new Modal(document.getElementById('RemoveModal'));
    modaltoRemove.show();
    setShowModal(modaltoRemove);
  }
}
const RemoveSubjectSchedule = async () => {
  const removeref = ref(db, `Instructors/${selectedInstructor.key}/Subjects/${subjectToRemove.id}`);
  try {
    await remove(removeref).then(()=>{
      if(showModal){
        showModal.hide();
        const modal = new Modal(document.getElementById('subjectDelete'));
        modal.show();
        setShowModal(modal);
        setTimeout(() => {
          modal.hide();
        }, 1500);
      }
    })
  } catch (error) {
    
  }
}
const editInstructorsSubject = (subject) => {
  console.log('yawaw thesis',selectedInstructor.key, 'subject key', subject.id);
  setSubjectEdit(subject);
  if(showModal){
    showModal.hide();
    const editModal = new Modal(document.getElementById('editSubjectModal'));
    editModal.show();
    setShowModal(editModal);
  }
}
const EditSubject = async () =>{
  console.log('yawaw thesis',selectedInstructor.key, 'subject key', subjectEdit.id);
  const editSubjectSchedule = ref(db, `Instructors/${selectedInstructor.key}/Subjects/${subjectEdit.id}`);
  const updatedSubject = {
    SubjectCode: subjectEdit.SubjectCode,
    SubjectDescription: subjectEdit.SubjectDescription,
    SubjectSchedule: subjectEdit.SubjectSchedule,
    SubjectSemester: subjectEdit.SubjectSemester,
    SubjectTerm: subjectEdit.SubjectTerm,
    SubjectTime: subjectEdit.SubjectTime,
    PostponeReason: subjectEdit.PostponeReason,
  }
  console.log({...subjectEdit});
  try {
    await set(editSubjectSchedule, updatedSubject).then(()=>{
      if(showModal){
        showModal.hide();
        const modaledit = new Modal(document.getElementById('successEdit'));
        modaledit.show();
        setShowModal(modaledit);
        setTimeout(() => {
          modaledit.hide();
        }, 1500);
      }
    })
  } catch (error) {
    if(showModal){
      console.error('something went wrong', error);
      const Error = document.getElementById('errorContent');
      Error.innerText = 'Something went wrong editing the Subject';
      const errorModal = new Modal(document.getElementById('error'));
      errorModal.show();
      showModal.hide();
    }

  }
}
const subjects = (e) =>{
  nav('/subjects');
}
const StudentsAccounts = (e) =>{
  nav('/StudentsAccounts');
}
const bsba = (e) =>{
 nav('/bsba'); 
}
const bshm = (e) =>{
  nav('/bshm'); 
 }
 const bscrim = (e) =>{
  nav('/crim'); 
 }
 const btvted = (e) =>{
  nav('/btvted'); 
 }
 const seniorhigh = (e) =>{
  nav('/seniorhigh'); 
 }
  return (
    <div className="bg-success container-fluid p-5" id="dashboard">
      <div className="col">
        <div className="row">
          <ul>
            <li><button className="btn btn-transparent" onClick={StudentsAccounts}>Students Accounts</button></li>
            <li><button className="btn btn-success text-dark" onClick={subjects}>BSIT</button></li>
            <li><button className="btn btn-success text-dark" onClick={bsba}>BSBA</button></li>
            <li><button className="btn btn-success text-dark" onClick={bshm}>BSHM/HRM</button></li>
            <li><button className="btn btn-success text-dark" onClick={bscrim}>BSCRIM</button></li>
            <li><button className="btn btn-success text-dark" onClick={btvted}>BTVTED</button></li>
            <li><button className="btn btn-success text-dark" onClick={seniorhigh}>Senior High</button></li>
          </ul>
        </div>
        <div className="">
          <button className="btn btn-primary mb-3" onClick={newInstuctorModal}>
            New+
          </button>
        </div>
        <div className="row" id="row">
          <div className="">
            <div className="card">
              <div className="card-header">
                 <input placeholder="Search..." className="form-control" type="search" name="searchInstructor" id="search" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>
              </div>
              <div className="card-body">
                <table  className="table table-striped text-uppercase">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Instructor</th>
                  <th scope="col">Email</th>
                  <th scope="col">Department</th>
                  <th scope="col">Schedule</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
              {filteredInstructors.map((instructor)=>(
                  <tr key={instructor.ID}>
                    <td>{instructor.ID}</td>
                    <td>{instructor.Instructor}</td>
                    <td>{instructor.Email}</td>
                    <td>{instructor.Department}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewClick(instructor)}
                      >
                        View Details
                      </button>
                    </td>
                    <td>
                      {/* <button className="btn btn-success">Edit</button> */}
                      <button className="btn btn-danger" onClick={() => handleDeleteClick(instructor)}>
                        Delete
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div id="create" className="modal fade text-uppercase" data-bs-backdrop="static" tabIndex="-1" role="dialog">
  <div className="modal-dialog modal-dialog-centered d-flex align-items-center justify-content-center">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Add New Instructor</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body text-light">
      <form action="" className="my-3">
      <div className="id">
        <input
          type="text"
          name="randomNumberInput"
          value={randomNumber !== null ? randomNumber : ''}
          disabled
          id=""
          className={`form-control ${formSubmitted && randomNumber === null ? 'border border-danger' : ''}`}
        />
        <button className="btn btn-primary ms-2" onClick={generateRandomNumber}>
          ID
        </button>
      </div>

      <input
        type="text"
        className={`form-control ${formSubmitted && name.trim() === '' ? 'border border-danger' : ''} mt-3`}
        name="fullname"
        id=""
        placeholder="Full Name"
        value={name}
        onChange={(e) => Setname(e.target.value)}
      />

      <input
        type="email"
        className={`form-control ${formSubmitted && email.trim() === '' ? 'border border-danger' : ''} mt-3`}
        name="email"
        id=""
        placeholder="Email"
        value={email}
        onChange={(e) => Setemail(e.target.value)}
      />

      <select
        name="department"
        className={`form-control ${formSubmitted && department.trim() === '' ? 'border border-danger' : ''} mt-3`}
        id=""
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="" disabled hidden>
          Select Department
        </option>
        <option value="BSIT">BSIT</option>
        <option value="BSCRIM">BSCRIM</option>
        <option value="BSBA">BSBA</option>
        <option value="BSHM">BSHM</option>
        <option value="BTVTED">BTVTED</option>
        <option value="Senior High">Senior High</option>
      </select>
      <hr />
      <label htmlFor="" className="text-dark">T-mobile Account</label>
      <input
        type="text"
        className={`form-control ${formSubmitted && username.trim() === '' ? 'border border-danger' : ''} mt-3`}
        name="username"
        id=""
        placeholder="Username"
        value={username}
        onChange={(e) => Setusername(e.target.value)}
      />
      <input
        type="text"
        className={`form-control ${formSubmitted && password.trim() === '' ? 'border border-danger' : ''} mt-3`}
        name="password"
        id=""
        placeholder="Password"
        value={password}
        onChange={(e) => SetPassword(e.target.value)}
      />
    </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={pushdata}>
          Save changes
        </button>
      </div>
    </div>
  </div>
</div>

     <div id="view" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog modal-dialog-centered modal-xl">
    <div className="modal-content" style={{width: 'fit-content'}}>
      <div className="modal-header">
      <h5 className="modal-title">{selectedInstructor?.Instructor}'s Schedule</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body text-dark">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Description</th>
              <th>Subject Schedule</th>
              <th>Subject Semester</th>
              <th>Subject Term</th>
              <th>Subject Time</th>
              <th>Postponed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {InstructorSubjects && InstructorSubjects.length > 0 ? (
    InstructorSubjects.map((subs) => (
      <tr key={subs.key}>
        <td>{subs.SubjectCode}</td>
        <td>{subs.SubjectDescription}</td>
        <td>{subs.SubjectSchedule}</td>
        <td>{subs.SubjectSemester}</td>
        <td>{subs.SubjectTerm}</td>
        <td>{subs.SubjectTime}</td>
        <td>{subs.PostponeReason}</td>
        <td>
          <button className="btn btn-success" onClick={() => editInstructorsSubject(subs)}>Edit</button>
          <button className="btn btn-danger" onClick={()=>removeSubjectModal(subs)}>Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6">No data available</td>
    </tr>
  )}
          </tbody>
        </table>
        <div className="modal-footer mt-3">
          <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="RemoveModal" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <div className="modal-title lead">Remove Subject from Instructor's Schedule</div>
      </div>
      <div className="modal-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <td>Subject Code</td>
              <td>Subject Description</td>
              <td>Subject Schedule</td>
              <td>Subject Semester</td>
              <td>Subject Term</td>
              <td>Subject Time</td>
            </tr>
          </thead>
          <tbody>
            <td>{subjectToRemove?.SubjectCode}</td>
            <td>{subjectToRemove?.SubjectDescription}</td>
            <td>{subjectToRemove?.SubjectSchedule}</td>
            <td>{subjectToRemove?.SubjectSemester}</td>
            <td>{subjectToRemove?.SubjectTerm}</td>
            <td>{subjectToRemove?.SubjectTime}</td>
          </tbody>
        </table>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
        <button className="btn btn-danger" onClick={RemoveSubjectSchedule}>Remove</button>
      </div>
    </div>
  </div>
</div>
<div id="success" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body lead text-success">
        <center>New Instructor Added</center>
      </div>
    </div>
  </div>
</div>
<div id="successDelete" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body lead text-success">
        <center>Instructor Deleted</center>
      </div>
    </div>
  </div>
</div>
<div id="successEdit" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body h5 text-success">
        <center>Subject edited</center>
      </div>
    </div>
  </div>
</div>
<div id="error" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body text-dark h5">
      <p id="errorContent"></p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
      </div>
    </div>
  </div>
</div>
<div id="subjectDelete" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body lead dark">
      <p id="errorContent" className="text-center">Subject removed from instructors schedule</p>
      </div>
    </div>
  </div>
</div>
      <div id="delete" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-dark lead">
              Are you sure you want to delete <b>{selectedInstructor?.Instructor}?</b> <br /> Deleting the instructor's record will also delete the instructor's schedule
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-danger" onClick={deleteKey}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="editSubjectModal" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Edit Subject</div>
            </div>
            <div className="modal-body lead dark">
              <form action="">
                <input value={subjectEdit.SubjectCode} className="form-control mb-2" type="text" name="SubjectCode" id=""  onChange={handleChange}/>
                <input value={subjectEdit.SubjectDescription} className="form-control mb-2" type="text" name="SubjectDescription" id=""  onChange={handleChange}/>
                <select className="form-control mb-2" name="SubjectSemester" id="" onChange={handleChange}>
                <option defaultValue='' selected value={subjectEdit.SubjectSemester} hidden>{subjectEdit.SubjectSemester}</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                </select>
                <select className="form-control mb-2" name="SubjectTerm" id="" onChange={handleChange}>
                  <option defaultValue='' selected value={subjectEdit.SubjectTerm} hidden>{subjectEdit.SubjectTerm}</option>
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                </select>
                <select className="form-control mb-2" name="SubjectSchedule" id="" onChange={handleChange}>
                  <option defaultValue='' selected value={subjectEdit.SubjectSchedule} hidden>{subjectEdit.SubjectSchedule}</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wedsnday">Wedsnday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Monday-Wednsday-Friday">Monday-Wednsday-Friday</option>
                  <option value="Monday-Tuesday">Monday-Tuesday</option>
                </select>
                <select className="form-control mb-2" name="SubjectTime" id="" onChange={handleChange}>
                  <option selected value={subjectEdit.SubjectTime} hidden>{subjectEdit.SubjectTime}</option>
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
                <input className="form-control mb-2" value={subjectEdit.PostponeReason} onChange={handleChange} type="text" name="PostponeReason" id="" />
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={EditSubject}>Save Changes</button>
              <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}