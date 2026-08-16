import { NavLink } from "react-router-dom";
import { useState } from "react";
import { SquareMenu } from 'lucide-react';
import { SquareX } from 'lucide-react';

export default function Navbar() {
   const [open, setOpen] = useState(false);

  return (
    <>
        <button
          className={`navbar-toggle ${open && "open"}`}
          onClick={() => setOpen(!open)}
        >
          <SquareMenu/>
        </button>

         {open && (
          <div
            className="navbar-backdrop"
            onClick={() => setOpen(false)}
          />
          )}

    <nav className={`navbar ${open ? "open" : ""}`}>

      <button onClick={() => setOpen(false)} style={{background:"transparent", borderColor:"transparent"}}>
        <SquareX/>
      </button>

      <NavLink to="/home">Home</NavLink>
      <NavLink to="/home">Previous Sessions</NavLink>
      <NavLink to="/home">Account</NavLink>
      <NavLink to="/home">Setting</NavLink>
    </nav>
    </>
  );
}