import React from "react";
import { useNavigate } from "react-router-dom";

function Middle() {
    const navigate=useNavigate()
  return (
    <>
      <div className="middle d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white text-center p-4">
        <h1 className="fw-bold text-warning">CourseBaazar</h1>
        <p className="text-secondary">
          Sharpen your skills with courses crafted by experts.
        </p>
        <div className="mt-3 d-flex gap-3">
          <button className="btn btn-success px-4 py-2 fw-semibold shadow-sm" onClick={()=>navigate('/courses')}>
            Explore courses
          </button>
          <button className="btn btn-light px-4 py-2 fw-semibold shadow-sm" onClick={()=>navigate('/aboutus')}>
            About Us
          </button>
        </div>
      </div>
    </>
  );
}

export default Middle;
