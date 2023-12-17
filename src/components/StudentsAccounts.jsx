import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Modal } from "bootstrap";
import { db } from "../dbconfig/firebaseConfig";
import { ref, push, onValue } from "firebase/database";
export default function StudentsAccounts(){
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
    const dbref = ref(db, 'Student Accounts/');
    useEffect(()=>{
        onValue(dbref, (snapshot)=>{
            const studentSnapshot = snapshot.val();
            if(studentSnapshot){
                const studentData = Object.entries(studentSnapshot).map(([key, value])=>({
                    key, ...value
                }));
                setStudents(studentData);
            }else{
                setStudents([]);    
            }
            return onValue(dbref, ()=>{}, []);
        });
    },[]);
    const newStudent = (e) => {
        const StudentModal = new Modal(document.getElementById('NewStudent'));
        StudentModal.show();
        setModal(StudentModal);
    }
    const CreateNewStudent = async (e) =>{
        e.preventDefault();
        try {
            await push(dbref, {
                FirstName: studentFirstName,
                LastName: studentLastName,
                Email: studentEmail,
                Department: studentDepartment,
                UserName: studentUserName,
                Password: studentPassword
            }).then(()=>{
                setStudentFirstName('');
                setStudentLastName('');
                setStudentEmail('');
                setStudentDepartment('');
                setStudentUserName('');
                setStudentPassword('');
                if(modal){
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

    return(
        <div className="container-fluid">
            <div className="container p-5">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Students Accounts</div>
                    </div>
                    <input type="search" placeholder="Search..." name="search" className="form-control" id="" />
                        <div className="card-body">
                            <table className="table table-stripped">
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
                                    <tr>
                                        <td>Lorem, ipsum dolor.</td>
                                        <td>Lorem, ipsum dolor.</td>
                                        <td>Lorem, ipsum dolor.</td>
                                        <td>Lorem, ipsum dolor.</td>
                                        <td>Lorem, ipsum dolor.</td>
                                        <td>Lorem, ipsum dolor.</td>
                                        <td><button className="btn btn-danger">Delete</button></td>
                                    </tr>
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
                        <input type="text" value={studentFirstName} onChange={(e)=>{setStudentFirstName(e.target.value)}} placeholder="Firt Name" className="form-control mt-3" name="" id="" />
                        <input type="text" value={studentLastName}  onChange={(e)=>{setStudentLastName(e.target.value)}} placeholder="Last Name" className="form-control mt-3" name="" id="" />
                        <input type="text" value={studentEmail}  onChange={(e)=>{setStudentEmail(e.target.value)}} placeholder="Email" className="form-control mt-3" name="" id="" />
                        <select name="Department" className="form-control mt-3" id="" value={studentDepartment}  onChange={(e)=>{setStudentDepartment(e.target.value)}} > 
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
                        <input type="text" value={studentUserName}  onChange={(e)=>{setStudentUserName(e.target.value)}} placeholder="User Name" className="form-control mt-3" name="" id="" />
                        <input type="text" value={studentPassword}  onChange={(e)=>{setStudentPassword(e.target.value)}} placeholder="Password" className="form-control mt-3" name="" id="" />
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
        </div>
    );
}