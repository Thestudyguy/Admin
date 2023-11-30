import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { db } from "../dbconfig/firebaseConfig";
import { push, ref, onValue, remove } from "firebase/database";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const nav = useNavigate();
const handleToggleCollapse = () => {
  setIsCollapsed(!isCollapsed);
};
useEffect(() => {
  const fetchData = () => {
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const instructorArray = Object.values(data);
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
  const view = new Modal(document.getElementById('view'));
  view.show();
  setSelectedInstructor(instructor);
};
const handleDeleteClick = (instructor) => {
  setSelectedInstructor(instructor);
  const deleteModal = new Modal(document.getElementById('delete'));
  deleteModal.show();
};

const handleDelete = () => {
  const instructorId = selectedInstructor?.ID;

  if (!instructorId) {
    console.error("Invalid instructor ID");
    return;
  }

  const instructorRef = ref(db, `Instructors/${instructorId}`);
  remove(instructorRef)
    .then(() => {
      console.log("Instructor deleted successfully");
      setInstructors((prevInstructors) =>
        prevInstructors.filter((instructor) => instructor.ID !== instructorId)
      );
      const deleteModal = new Modal(document.getElementById('delete'));
      deleteModal.hide();
    })
    .catch((error) => {
      console.error("Error deleting instructor:", error);
    });
};
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
          <button className="btn btn-primary" onClick={newInstuctorModal}>
            New+
          </button>
        </div>
        <div className="row" id="row">
          <div className="">
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
              {instructors.map((instructor) => (
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
      <button className="btn btn-success">Edit</button>
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
      <div id="create" className="modal fade text-uppercase" tabIndex="-1" role="dialog">
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
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
      <h5 className="modal-title">{selectedInstructor?.Instructor}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body text-light">
        <div className="content" style={{ display: 'flex', flexDirection: 'column', fontWeight: '700', gap: '30px' }}>
          <span className="text-dark">ID: {selectedInstructor?.ID}</span>
          <span className="text-dark text-uppercase">Instructor: {selectedInstructor?.Instructor}</span>
          <span className="text-dark">Email: {selectedInstructor?.Email}</span>
          <span className="text-dark">Department: {selectedInstructor?.Department}</span>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleToggleCollapse}
            data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"
          >
            View Schedule
          </button>
          <div className={`collapse ${isCollapsed ? 'show' : ''}`} id="collapseExample">
            <div className="card card-body text-dark">
              <table className="table table-stripped">
              </table>
            </div>
          </div>
        </div>
        <div className="modal-footer">
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
        Are you sure you want to delete {selectedInstructor?.Instructor}? <br /> Deleting the instructor's record will also delete the instructor's schedule
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
  Delete
</button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}