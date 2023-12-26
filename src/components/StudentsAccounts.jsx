import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Modal } from "bootstrap";
import { db } from "../dbconfig/firebaseConfig";
import { ref, push, onValue, remove } from "firebase/database";
export default function StudentsAccounts() {
    const [modal, setModal] = useState(null);
    const [studentFirstName, setStudentFirstName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentDepartment, setStudentDepartment] = useState('');
    const [studentUserName, setStudentUserName] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [student, setStudents] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [search, setSearch] = useState('');
    const [account, setAccount] = useState(null);
    const [searchStudent, setSearchStudent] = useState('');
    const dbref = ref(db, 'Student Accounts/');
    useEffect(() => {
        onValue(dbref, (snapshot) => {
            const studentSnapshot = snapshot.val();
            if (studentSnapshot) {
                const studentData = Object.entries(studentSnapshot).map(([key, value]) => ({
                    key, ...value
                }));
                setStudents(studentData);
            } else {
                setStudents([]);
            }
            return onValue(dbref, () => { }, []);
        });
    }, []);
    const newStudent = (e) => {
        const StudentModal = new Modal(document.getElementById('NewStudent'));
        StudentModal.show();
        setModal(StudentModal);
    }
    const CreateNewStudent = async (e) => {
        e.preventDefault();
        if(studentFirstName.trim() == ''||  studentLastName.trim() == ''|| studentEmail.trim() == ''|| studentDepartment.trim() == ''|| studentUserName.trim() == ''|| studentPassword.trim() == ''){
            setFormSubmitted(true);
            setTimeout(() => {
            setFormSubmitted(false);
            }, 1500);
        }
        else{
            try {

            await push(dbref, {
                FirstName: studentFirstName,
                LastName: studentLastName,
                Email: studentEmail,
                Department: studentDepartment,
                UserName: studentUserName,
                Password: studentPassword
            }).then(() => {
                setStudentFirstName('');
                setStudentLastName('');
                setStudentEmail('');
                setStudentDepartment('');
                setStudentUserName('');
                setStudentPassword('');
                if (modal) {
                    modal.hide();
                    const success = new Modal(document.getElementById('success'));
                    success.show();
                    setTimeout(() => {
                        success.hide();
                    }, 1500);
                }
            })
        } catch (error) {
        }
        }
    }
    const deleteStudentAccount = (student) => {
        setAccount(student);
        const modalDelete = new Modal(document.getElementById('modalDelete'));
        modalDelete.show();
        setModal(modalDelete);
    }
    const handleDelete = async () => {
        const removeRef = ref(db, `Student Accounts/${account.key}`);
        remove(removeRef).then(() => {
            if (modal) {
                modal.hide();
                const deleted = new Modal(document.getElementById('deleted'));
                deleted.show();
                setTimeout(() => {
                    deleted.hide();
                }, 1500);
            }

        })
    }

    const SearchStudent = student.filter((students) => 
    students.FirstName.toLowerCase().includes(searchStudent.toLowerCase()) ||
    students.LastName.toLowerCase().includes(searchStudent.toLowerCase()) ||
    students.Email.toLowerCase().includes(searchStudent.toLowerCase()) ||
    students.UserName.toLowerCase().includes(searchStudent.toLowerCase())
    )
    return (
        <div className="container-fluid">
            <div className="container p-5">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Students Accounts</div>
                    </div>
                    <input type="search" placeholder="Search..." value={searchStudent} onChange={(e)=>setSearchStudent(e.target.value)} name="search" className="form-control" id="" />
                    <div className="card-body">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Firt Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>User Name</th>
                                    <th>Password</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SearchStudent.map((students) => (
                                    <tr key={students.key}>
                                        <td>{students.FirstName}</td>
                                        <td>{students.LastName}</td>
                                        <td>{students.Email}</td>
                                        <td>{students.Department}</td>
                                        <td>{students.UserName}</td>
                                        <td>{students.Password}</td>
                                        <td><button className="btn btn-danger" onClick={() => deleteStudentAccount(students)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={newStudent}>New</button>
                    </div>
                </div>
            </div>
            <div id="NewStudent" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header lead">
                            Add new student
                        </div>
                        <div className="modal-body lead">
                            <form action="">
                                <input className={`form-control my-3 ${formSubmitted && studentFirstName.trim() === '' ? 'border border-danger': ''}`}  type="text" value={studentFirstName} onChange={(e) => { setStudentFirstName(e.target.value) }} placeholder="Firt Name" name="" id="" />
                                <input type="text"  className={`form-control my-3 ${formSubmitted && studentLastName.trim() === '' ? 'border border-danger': ''}`}  value={studentLastName} onChange={(e) => { setStudentLastName(e.target.value) }} placeholder="Last Name" name="" id="" />
                                <input type="text" className={`form-control my-3 ${formSubmitted && studentEmail.trim() === '' ? 'border border-danger': ''}`}  value={studentEmail} onChange={(e) => { setStudentEmail(e.target.value) }} placeholder="Email" name="" id="" />
                                <select name="Department" className={`form-control my-3 ${formSubmitted && studentDepartment.trim() === '' ? 'border border-danger': ''}`}  id="" value={studentDepartment} onChange={(e) => { setStudentDepartment(e.target.value) }} >
                                    <option value="" hidden selected>Select Department</option>
                                    <option value="BSIT">BSIT</option>
                                    <option value="BSBA">BSBA</option>
                                    <option value="BSHM">BSHM</option>
                                    <option value="BTVTED">BTVTED</option>
                                    <option value="BSCRIM">BSCRIM</option>
                                    <option value="Senior High">Senior High</option>
                                </select>
                                <hr />
                                <span className="lead">T-mobile Account</span>
                                <input type="text" className={`form-control my-3 ${formSubmitted && studentUserName.trim() === '' ? 'border border-danger': ''}`}  value={studentUserName} onChange={(e) => { setStudentUserName(e.target.value) }} placeholder="User Name" name="" id="" />
                                <input type="text" className={`form-control my-3 ${formSubmitted && studentPassword.trim() === '' ? 'border border-danger': ''}`}  value={studentPassword} onChange={(e) => { setStudentPassword(e.target.value) }} placeholder="Password" name="" id="" />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button className="btn btn-primary" onClick={CreateNewStudent}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="success" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body lead text-success">
                            <center>New Student Added</center>
                        </div>
                    </div>
                </div>
            </div>
            <div id="modalDelete" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title">
                                <center>
                                    Are you sure you want to delete this Student?
                                </center>
                            </div>
                        </div>
                        <div className="modal-body lead text-dark">
                            <center>Delete <span className="text-danger h5">{account?.FirstName}'s</span> Account</center>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="deleted" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body h5 text-success">
                            <center>Student Account Deleted</center>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}