import React, { useEffect, useRef } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
function Signin({ user, setUser }) {
  const navigate = useNavigate();
  const ref = useRef()
  useEffect(()=>{
    ref.current.focus()
  }, [])
  const handleClick = () =>{
    navigate('/search')
  }

  return (
    <div className="main">
      <div className="container">
        <p>Welcome to Vega6-task</p>
        <div className="form">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            ref={ref}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <button onClick={handleClick}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
