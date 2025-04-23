import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function MyCourses({ refresh, setRefresh }) {
  const [loading, setLoading] = useState(true);
  const [updating,setUpdating]=useState(false)
  const [myCourses, setMyCourses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [courseId, setCourseId] = useState("");
  const userAtLocalStorage = JSON.parse(localStorage.getItem("user"));
  const handleDelete = async (courseId) => {
    const response = await axios.post(
      `http://localhost:3000/${courseId}/delete`,
      {
        userAtLocalStorage,
      }
    );
    toast.success(response.data.message);
    setRefresh((prev) => !prev);
  };
  const handleEdit = (course) => {
    setEdit(true);
    setName(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setCourseId(course._id);
    setOldImage(course.image)
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if(newImage!==null){
      formData.append("image", newImage); 
    }
    formData.append('oldImage',oldImage)
    setUpdating(true)
    const response = await axios.post(
      `http://localhost:3000/${courseId}/edit`,
      formData,{
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }
    );
    setUpdating(false)
    setRefresh((prev) => !prev);
    setEdit(false);
    toast.success(response.data.message);
  };
  useEffect(() => {
    const Func = async () => {
      const userAtLocalStorage = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios.get(
          `http://localhost:3000/${userAtLocalStorage._id}/myCourses`
        );
        setMyCourses(response.data.myCourses);
      } catch (err) {
        toast.error(err.message);
      }
    };
    Func();
    setTimeout(() => setLoading(false), 300);
  }, [refresh]);
  return (
    <>
      {edit && (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h3 className="card-title mb-0">Course Details</h3>
                </div>
                <div className="card-body">
                  <form
                    onSubmit={handleSubmit}
                    className="needs-validation"
                    noValidate
                  >
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                      <div className="invalid-feedback">
                        Please enter a course name.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        placeholder="Enter course description"
                        required
                      ></textarea>
                      <div className="invalid-feedback">
                        Please enter a course description.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          value={price}
                          id="price"
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Enter course price"
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter a valid price.
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                        Product Image
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="form-control"
                        id="image"
                      />
                      <div className="invalid-feedback">
                        Please upload an image.
                      </div>
                      <small className="form-text text-muted">
                        Upload a high-quality image of the course.
                      </small>
                    </div>

                    <div className="d-grid">
                    {updating ? (
                        <>
                          <div className="d-flex justify-content-center align-items-center">
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            <span className="text-center">Updating..</span>
                          </div>
                        </>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    )}
                      
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && !edit && (
        <div className="container mt-4">
          <div className="row">
            {myCourses.length === 0 && (
              <h2 className="text-center">No courses</h2>
            )}
            {myCourses.map((course) => (
              <div
                key={course._id}
                className=" col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
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
                    <button
                      onClick={() => handleEdit(course)}
                      className="mb-2 btn btn-secondary mt-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="btn btn-danger mt-auto"
                    >
                      Delete
                    </button>
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

export default MyCourses;
