import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from 'xlsx';
import { push, ref, onValue, update } from 'firebase/database';
import { GoUpload } from "react-icons/go";
import { db } from "../dbconfig/firebaseConfig";
import { Modal } from "bootstrap";
export default function ImportFiles() {
    const [excelData, setExcelData] = useState(null);
    const [excelFileName, setExcelFileName] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [department, setDepartment] = useState([]);
    const [modal, setModal] = useState(null);
    const [Headers, setHeaders] = useState([]);
    const [AcceptedHeaders, setAcceptedHeaders] = useState('');
    const [subjectToImport, setSubjectToImport] = useState({
        SubjectCode: '',
        SubjectDescription: '',
        SubjectSchedule: '',
        SubjectSemester: '',
        SubjectTerm: '',
        SubjectTime: ''
    })
    const dbref = ref(db, 'Subjects');
    const headers = ref(db, 'Accepted Headers');
    //get all departments
    useEffect(() => {
        const fetchSubjects = () => {
            onValue(dbref, (departmentSnap) => {
                const subjectDepartment = departmentSnap.val();
                if (subjectDepartment) {
                    const subjectArray = Object.entries(subjectDepartment).map(([key, value]) => ({
                        key, ...value
                    }));
                    setDepartment(subjectArray);
                } else {
                    setDepartment([]);
                }
            });
        }
        fetchSubjects();
        return () => {
            onValue(dbref, () => { });
        };
    }, []);
    //get all accepted headers
    useEffect(()=>{
        const fetchAcceptedHeaders = () => {
            onValue(headers,(headersSnapshot)=>{
                const headersData = headersSnapshot.val();
                if(headersData){
                    const headersArray = Object.values(headersData);
                    setHeaders(headersArray);
                }else{
                    setHeaders([]);
                }
            });
        }
        fetchAcceptedHeaders();
        return () =>{
            onValue(headers, ()=>{});
        }
    },[]);
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setExcelFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const headers = jsonData[0];
                if (!areHeadersValid(headers)) {
                    const invalidHeaders = new Modal(document.getElementById('invalidHeaders'));
                    invalidHeaders.show();
                    setExcelData(null);
                    return;
                }
                setExcelData(jsonData);
            };
            reader.readAsBinaryString(file);
        }
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    const importSubject = (row) => {
        setSelectedData(row);
        console.log('selected subject', { ...row });
        const headers = excelData[0];
        if (!areHeadersValid(headers)) {
            alert("Invalid headers. Please make sure the file includes the required headers.");
            return;
        }
        const selectDepartment = new Modal(document.getElementById('selectDepartment'));
        selectDepartment.show();
        setModal(selectDepartment);
    }

    const areHeadersValid = (headers) => {
        return Headers.every(header => headers.includes(header));
    }
    const saveSelectedDepartments = () => {
        const selectedDepartments = Array.from(document.querySelectorAll('input[name="selectedDepartments"]:checked')).map(checkbox => checkbox.value);
        console.log(selectedData[0], selectedData[2]);
        setSubjectToImport({
            SubjectCode: selectedData[0],
            SubjectDescription: selectedData[1],
            SubjectSchedule: selectedData[2],
            SubjectSemester: selectedData[3],
            SubjectTerm: '',
            SubjectTime: ''
        })
        
    }
    const addNewHeader = () =>{
        const addNewHeaderModal = new Modal(document.getElementById('newHeader'));
        addNewHeaderModal.show();
        setModal(addNewHeaderModal);
    }
    const saveNewHeader = () =>{
        try {
            push(headers, AcceptedHeaders).then(()=>{
                console.log('new header created');
                setAcceptedHeaders('');
            })
        } catch (error) {
            
        }
    }
    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="card text-center">
                    <div className="card-content">
                    <div className="card-header">
                        <div className="card-title">
                        <span className="text-dark text-uppercase h5 px-3">Import Files</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div {...getRootProps()} style={{ cursor: "pointer" }}>
                            <input {...getInputProps()} />
                            <p>Excel file here, click here to select one</p>
                        </div>
                        {excelData && (
                            <div className="mt-3">
                                <h5>{excelFileName}</h5>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            {excelData[0].map((header, index) => (
                                                <React.Fragment key={index}>
                                                    <th>{header}</th>
                                                    {index === excelData[0].length - 1 && <th>Action</th>}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {excelData.slice(1).map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <React.Fragment key={cellIndex}>
                                                        <td>{cell}</td>
                                                        {cellIndex === row.length - 1 && (
                                                            <td>
                                                                <button className="btn btn-primary" onClick={() => { importSubject(row) }}>
                                                                    import <GoUpload />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-success text-light">View Accepted File Headers</button>
                        <button className="btn btn-primary" onClick={addNewHeader}>Add new Accepted File Headers</button>
                    </div>
                    </div>
                </div>
            </div>
            <div id="selectDepartment" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-header">
                            <div className="modal-title">Select Department</div>
                        </div>
                        <div className="modal-body text-success">
                            <center>
                                {department.map((subject) => (
                                    <div key={subject.key} className="form-check">
                                        <input
                                            type="checkbox"
                                            id={`department_${subject.key}`}
                                            name="selectedDepartments"
                                            value={subject.key}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={`department_${subject.key}`} className="form-check-label">
                                            {subject.key}
                                        </label>
                                    </div>
                                ))}
                            </center>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss='modal'>Cancel</button>
                            <button className="btn btn-primary" onClick={saveSelectedDepartments}>Save</button>
                        </div>
                </div>
            </div>
            <div id="newHeader" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title">Add new header</div>
                        </div>
                        <div className="modal-body h3 text-dark">
                            <input value={AcceptedHeaders} onChange={(e)=>{setAcceptedHeaders(e.target.value)}} type="text" name="" className="form-control" placeholder="New Accepted Header" id="" />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
                            <button className="btn btn-primary" data-bs-dismiss='modal' onClick={saveNewHeader}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="invalidHeaders" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title">Invalid File</div>
                        </div>
                        <div className="modal-body h3 text-dark">
                            <center>
                                Please check your file. File should include <span className="text-info text-danger text-uppercase">all or any</span> of the <br /> following:  {Headers.map((header) => (
                                    <p key={header} className="text-primary">{header}</p>
                                ))}
                            </center>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss='modal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="ActionModal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title"><p id="modalTitle"></p></div>
                        </div>
                        <div className="modal-body h3 text-dark">
                            <center>
                            <p id="modalBody"></p>
                            </center>
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