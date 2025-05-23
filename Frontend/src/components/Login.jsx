import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login({ setLogin, setUser }) {
  const [loading, setLoading] = useState(false);
  let [username, setName] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post("https://full-stack-jet-omega.vercel.app/login", {
        username,
        password,
      });
      toast.success(response.data.message);
      setLogin(true);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setLogin(false);
      if (err.status === 401) {
        toast.error("User not authorised");
      } else {
        toast.error(err.message);
      }
    }
    setLoading(false)
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100 container-fluid">
        <div
          className="card bg-dark text-white p-4 shadow-lg"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
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

export default Login;
