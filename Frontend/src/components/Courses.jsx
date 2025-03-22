import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Courses({ allCourses, user, login }) {
  const [query,setQuery]=useState("")
  const [loading,setLoading]=useState(true)
  const navigate = useNavigate();
  const handleBuy = async (courseId) => {
    if (!login) {
      toast.error("You must login first to buy");
      navigate("/login");
      return;
    }
    return navigate(`/buy/${courseId}`);
  };
  useEffect(()=>{
    const Func=()=>{
      setTimeout(()=>setLoading(false),1400)
    }
    Func()
  },[])
  return (
    <>
      {loading && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading &&
      <div className="container mt-4">
        <div className="mb-2 d-flex justify-content-end align-items-center w-100">
              <input
                type="search"
                className=" p-2 rounded w-4"
                style={{ width: "9rem" }} 
                placeholder="Search Course..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            <button className="btn btn-primary ms-2">Search</button>
          </div>
        <div className="row ">
          {(allCourses.filter(course=>course.title.toLowerCase().includes(query))).map((course) => (
            <div
              key={course._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="bg-dark text-white card h-100 shadow-sm">
                <img
                  src={course.image}
                  className="card-img-top"
                  alt={course.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text text-truncate">
                    {course.description}
                  </p>
                  <p className="fw-bold">💲 Price: ${course.price}</p>
                  <p>👤 Created by: {course.user.username}</p>
                  <button
                    onClick={() => handleBuy(course._id)}
                    className="buy-btn btn btn-primary mt-auto"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </>
  );
}

export default Courses;
