import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";

export default function Dashboard() {
  const navigate = useNavigate();
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, uname, password);
      const user = userCredential.user;
      console.log("User created:", user);
      setPassword('');
      setUname('');
      const modal = new Modal(document.getElementById('successModal'));
      modal.show();
    } catch (error) {
      console.error("Error creating user:", error);
      const Errormodal = new Modal(document.getElementById('errorModal'));
      Errormodal.show();
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    
    }
  };

  return (
    <div className="jumbotron-fluid bg-danger" id="dashboard">
      <div className="item-wrapper">
        <form onSubmit={handleCreateUser}>
          <input
            value={uname}
            onChange={(e) => setUname(e.target.value)}
            type="text"
            placeholder="username or email"
            name="uname"
            id="uname"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
            name="password"
            id="password"
          />
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
        <button onClick={handleLogout} className="btn btn-primary">
          Logout
        </button>
        <div className="bg-secondary p-5">lorem ipsum dolor sit amet</div>
        <div className="bg-light p-5">lorem ipsum dolor sit amet</div>
      </div>
      <div id="successModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog ">
    <div class="modal-content bg-success">
      <div class="modal-body text-light">
        <center>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
           User created 
        </center>
       
      </div>
    </div>
  </div>
</div>

<div id="errorModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content bg-danger">
      <div class="modal-body text-light">
        <center>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
          Error creating user. Check fields for errors   
        </center>
        
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
