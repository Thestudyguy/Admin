import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import errorImage from '../images/undraw_feeling_blue_-4-b7q.svg';
import "../styles/style.css";
export default function ErrorPage() {
    const nav = useNavigate();
    const handleGoBack = () => {
        nav(-1);
    };
    return (
        <div className="container-fluid p-5" id="error">
            <div className="container">
                <div className="p-3">
                    <span className="h3">Something went wrong, please reload the page</span>
                </div>
                <div className="">
                    <img src={errorImage} alt="" width='50' />
                </div>
                <div className="">
                    <button className="btn btn-primary" onClick={handleGoBack}>
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
}
