import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { db } from "../dbconfig/firebaseConfig";
import { push, ref, onValue, remove, get } from "firebase/database";
import { Modal } from "bootstrap";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const dbref = ref(db, "Instructors");
  const [showModal, setShowModal] = useState(null);
  const [name, Setname] = useState('');
  const [email, Setemail] = useState('');
  const [randomNumber, setRandomNumber] = useState(null);
  const [department, setDepartment] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [DeleteKey, setDeleteKey] = useState(null);
  const [InstructorSubjects, setInstructorsSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    if (name.trim() === '' || email.trim() === '' || department.trim() === '', randomNumber === null) {
      setFormSubmitted(true);
      return;
    }
  
   await push(dbref, {
      ID: randomNumber,
      Instructor: name,
      Email: email,
      Department: department,
    })
      .then(() => {
        setRandomNumber(null);
        Setname('');
        Setemail('');
        setDepartment('');
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
    const subjectRef = ref(db, `Instructors/${instructor.key}/Subjects`);
    
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
instructor.Instructor.toLowerCase().includes(searchTerm.toLowerCase()),
//instructor.Email.toLowerCase().includes(searchTerm.toLowerCase()),
//instructor.ID.toLowerCase().includes(searchTerm.toLowerCase()),
//instructor.Department.toLowerCase().includes(searchTerm.toLowerCase())
);

const subjects = (e) =>{
  nav('/subjects');
}
  return (
    <div className="bg-success container-fluid p-5" id="dashboard">
      <div className="col">
        <div className="row">
          <ul>
            <li>Accounts</li>
            <li><button className="btn btn-transparent text-dark" onClick={subjects}>Subjects</button></li>
            <li>Accounts</li>
            <li>Accounts</li>
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
                 <input placeholder="Search..." className="form-control" type="search" name="searchInstructor" id="" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>
              </div>
              <div className="card-body">
                <table  className="table table-striped text-uppercase">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
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
        type="text"
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
  <div className="modal-dialog modal-xl">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {InstructorSubjects && InstructorSubjects.length > 0 ? (
    InstructorSubjects.map((subs) => (
      <tr key={subs.id}>
        <td>{subs.SubjectCode}</td>
        <td>{subs.SubjectDescription}</td>
        <td>{subs.SubjectSchedule}</td>
        <td>{subs.SubjectSemester}</td>
        <td>{subs.SubjectTerm}</td>
        <td>{subs.SubjectTime}</td>
        <td>
          <button className="btn btn-success">Edit</button>
          <button className="btn btn-danger">Delete</button>
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
<div id="error" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body text-light">
      <p id="errorContent"></p>
      </div>
    </div>
  </div>
</div>
<div id="delete" className="modal fade" tabIndex="-1" role="dialog">
  <div className="modal-dialog">
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
    </div>
  );
}