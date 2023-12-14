import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import { ref, push, onValue, remove } from "firebase/database";
import { db } from "../dbconfig/firebaseConfig";
import "../styles/style.css";
export default function BSIT(){
return(
  <div className="container-fluid">
    <div className="card">
      <div className="card-title">BSIT</div>
    </div>
  </div>
);  
}