import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Modal } from "bootstrap";
export default function StudentsAccounts(){
    const [modal, setModal] = useState(null);
    //const [studentFirstName, setStudentFirstName] = useState('');
    //const [studentLastName, setStudentLastName] = useState('');
    //const [studentEmail, setStudentEmail] = useState('');
    //const [studentDepartment, setStudentDepartment] = useState('');
    //const [studentUserName, setStudentUserName] = useState('');
    //const [studentPassword, setStudentPassword] = useState('');

    const newStudent = (e) => {
        const StudentModal = new Modal(document.getElementById('NewStudent'));
        StudentModal.show();
        setModal(StudentModal);
    }
    const CreateNewStudent = (e) =>{
        if(modal){
            modal.hide();
            const success = new Modal(document.getElementById('success'));
            success.show();
            setTimeout(() => {
            success.hide();   
            }, 1500);
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
                        <input type="text" placeholder="Firt Name" className="form-control mt-3" name="" id="" />
                        <input type="text" placeholder="Last Name" className="form-control mt-3" name="" id="" />
                        <input type="text" placeholder="Email" className="form-control mt-3" name="" id="" />
                        <select name="Department" className="form-control mt-3" id="">
                            <option value="" hidden selected>Select Department</option>
                            <option value="BSIT">BSIT</option>
                            <option value="BSBA">BSBA</option>
                            <option value="BSHM">BSHM</option>
                            <option value="BTVTED">BTVTED</option>
                            <option value="BSCRIM">BSCRIM</option>
                            <option value="Senior High">Senior High</option>
                        </select>
                        <input type="text" placeholder="User Name" className="form-control mt-3" name="" id="" />
                        <input type="text" placeholder="Password" className="form-control mt-3" name="" id="" />
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