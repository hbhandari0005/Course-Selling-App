import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate,useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Offcanvas } from "bootstrap";

function Navbar({ login, setLogin, user, setUser }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); 
  useEffect(() => {
    if (sidebarOpen) {
      const offcanvasElement = document.getElementById("sidebarOffcanvas");
      const bsOffcanvas = new Offcanvas(offcanvasElement);
      bsOffcanvas.show();
      offcanvasElement.addEventListener("hidden.bs.offcanvas", () => setSidebarOpen(false));
    }
  }, [sidebarOpen]);
  useEffect(() => {
    const offcanvasElement = document.getElementById("sidebarOffcanvas");
    if (offcanvasElement) {
      const bsOffcanvas = Offcanvas.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/logout");
      toast.success(response.data.message);
      setLogin(false);
      localStorage.removeItem("user");
      setUser({});
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <NavLink className="navbar-brand fw-bold text-white" to="/">
          CourseBaazar
        </NavLink>
        <div className="collapse navbar-collapse d-lg-flex justify-content-end">
          <ul className="navbar-nav">
            {login && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to={`/${user._id}/courses`}>
                    Purchased
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/createCourse">
                    Create Course
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/myCourse">
                    My Courses
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="ms-auto">
            {!login ? (
              <>
                <NavLink to="/login" className="btn btn-outline-success me-2">
                  Login
                </NavLink>
                <NavLink to="/signup" className="btn btn-success">
                  Sign Up
                </NavLink>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <div
        id="sidebarOffcanvas"
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            {login && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to='/'>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to={`/${user._id}/courses`}>
                    Purchased
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/createCourse">
                    Create Course
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white mb-2" to="/myCourse">
                    My Courses
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="mt-auto">
            {!login ? (
              <>
                <NavLink to="/login" className="btn btn-outline-success w-100 mb-2">
                  Login
                </NavLink>
                <NavLink to="/signup" className="btn btn-success w-100">
                  Sign Up
                </NavLink>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline-danger w-100">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;