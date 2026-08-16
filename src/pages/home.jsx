import Navbar from "../components/navbar";
import {NavLink} from "react-router-dom";
import {SquarePlus} from 'lucide-react';
import { useState, Link} from "react";



function NewSessionButton(){
    const[menuOpen,setMenuOpen] = useState(false)

    return (
        <div className="new-session-menu">
            <button
                className={`new-session-button ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <SquarePlus />
            </button>

            {menuOpen && (
                <div className="new-session-options">
                <NavLink to="/home">
                    <span>New Live Pratice Session</span>
                    <small>Track your practice in real time</small>
                </NavLink>

                <NavLink to="/manual_session">
                    <span>Add a Manual Session</span>
                    <small>Log a practice session you've already completed</small>
                </NavLink>
                </div>
            )}
        </div>
    )
}


export default function Home(){
    return<>
    <Navbar/>
    <div className="main-content-wrapper">

    <h1 
    style={{position: "fixed",top: "0",left: "11vw",margin: "100", fontSize:"35px"}}>
    Shedder
    </h1>

    <NewSessionButton/>

    

    </div>
    </>
}