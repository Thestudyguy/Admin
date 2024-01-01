import React from "react";
import BSBA from "../components/BSBA";
import BSCRIM from "../components/BSCRIM";
import BSTVTED from "../components/BTVTED";
import BSHM from "../components/HRM";
import SeniorHigh from "../components/SeniorHigh";
import BSIT from "../components/BSIT";
function Departments(){
    return(
        <div className="container-fluid" id="subjects" >
            <div className="row" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <BSIT></BSIT>
            <BSBA></BSBA>
            <BSCRIM></BSCRIM>
            <BSTVTED></BSTVTED>
            <BSHM></BSHM>
            <SeniorHigh></SeniorHigh>
            </div>
        </div>
    );
}