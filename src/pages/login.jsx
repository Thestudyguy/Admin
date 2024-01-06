import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import image from "../images/undraw_hello_re_3evm.svg";
import { db } from "../dbconfig/firebaseConfig";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      //console.log("User state changed:", user);
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  
    return () => unsubscribe();
  }, [auth]);
  


  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      //console.log("Logging in...");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setLoginStatus("Login successful");
    } catch (error) {
      //console.error("Error logging in: ", error);
      setLoading(false);
      setLoginStatus("Login failed. Invalid username or password");
      setTimeout(() => {
        setLoginStatus(null);
      }, 3000);
    }
  };
useEffect(() => {
  if (isAuthenticated && loginStatus === "Login successful") {
    nav("/admin");
  }
}, [isAuthenticated, loginStatus, nav]);
  

  return (
    <div className="jumbotron-fluid" id="login">
      <div className="container-fluid" id="containerLogin">
        <div className="items">TimeMinder</div>
        <div className="items">
          <img src={image} alt="Your Image" />
        </div>
      </div>
      <div className="container">
        <div className="container-fluid" id="loginCreds">
          <div className="card">
            <span className="h1 text-uppercase">Welcome</span>
            <br />

            <form onSubmit={handleFormSubmit}>
              <input
                placeholder="Email"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                placeholder="Password"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Log In
              </button>
            </form>
            {loading && <div className="loader text-light">Loading...</div>}
            {loginStatus && (
              <div className={`alert mt-3 ${loginStatus === "Login successful" ? "alert-success" : "alert-danger"}`}>
                <p>{loginStatus}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
