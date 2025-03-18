import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserCourses({ login }) {
  let { userId } = useParams();
  let [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const Func = async () => {
      const response = await axios.get(
        `https://harshit-course-selling-mern.onrender.com/${userId}/courses`
      );
      setCourses(response.data.user.courses);
    };
    Func();
    setTimeout(() => setLoading(false), 1500);
  }, []);
  return (
    <>
      {loading && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="container mt-4">
          <div className="row">
            {!login && <h2 className="text-center">You are not logged in</h2>}
            {login && courses.length === 0 && (
              <h2 className=" text-center">No courses bought</h2>
            )}
            {login &&
              courses.map((course) => (
                <div
                  key={course._id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                >
                  <div className="bg-dark card h-100 shadow-sm">
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
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UserCourses;
