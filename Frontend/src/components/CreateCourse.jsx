import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateCourse({ setRefresh }) {
  const [submitDone,setSubmitDone]=useState(false)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      e.stopPropagation();
      e.target.classList.add("was-validated");
      return;
    }
    console.log(e.target.name.value);
    try {
      const userAtLocalStorage = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image); 
      setSubmitDone(true)
      const response = await axios.post(
        `https://harshit-course-selling-mern.onrender.com/${userAtLocalStorage._id}/createCourse`,
          formData,{
            headers: {
              "Content-Type": "multipart/form-data"
            },
          }
      );
      setSubmitDone(false)
      toast.success(response.data.message);
      setRefresh((prev) => !prev);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-dark container mt-5">
      <div className="row  justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="bg-dark card shadow">
            <div className="card-title bg-dark card-header bg-primary text-white">
              <h3 className=" mb-0">Course Details</h3>
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
                    onChange={(e) => setImage(e.target.files[0])}
                    className="form-control"
                    id="image"
                    required
                  />
                  <div className="invalid-feedback">
                    Please upload an image.
                  </div>
                  <small >
                    Upload a high-quality image of the course.
                  </small>
                </div>

                <div className="d-grid">
                  {submitDone ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Submitting...
                        </>
                    ) : (
                      <button type="submit" className="submit-btn btn btn-primary">
                        Submit
                      </button>
                    )}
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
