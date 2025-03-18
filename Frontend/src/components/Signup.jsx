import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [loading, setLoading] = useState(false)
  let [error, setError] = useState("");
  let [username, setName] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let response = await axios.post(
        "https://harshit-course-selling-mern.onrender.com/signup",
        { username: username, password: password },
        {}
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (err) {
      if (err.status === 409) {
        toast.error("User already exists");
      } else {
        toast.error(err.message);
      }
    }
    setLoading(false)
  };

  return (
    <>
      <div>{error}</div>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div
          className="card bg-dark text-white p-4 shadow-lg"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center mb-4">Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={username}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loading ? (
              <>
                <div className="d-flex justify-content-center align-items-center">
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  <span className="text-center">Logging in...</span>
                </div>
              </>
            ) : (
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
