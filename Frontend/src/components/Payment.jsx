import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Payment({ user, login }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [paymentDone, setPaymentDone] = useState(false);
  const handlePay = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      e.stopPropagation();
      e.target.classList.add("was-validated");
      return;
    }

    if (!login) {
      toast.error("You must login first");
      navigate("/login");
      return;
    }
    try {
      setPaymentDone(true);
      const response = await axios.post(
        `https://full-stack-jet-omega.vercel.app/buy/${user._id}`,
        {
          courseId,
        }
      );
      if (response.status === 201 || response.status === 202) {
        toast.error(response.data.message);
        setPaymentDone(false);
        return;
      }
      setTimeout(() => {
        toast.success("Payment successful");
        setPaymentDone(false);
        navigate("/");
      }, 3000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", margin: "auto" }}
      >
        <h3 className="text-center mb-3">Payment Details</h3>
        <form onSubmit={handlePay} className="needs-validation" noValidate>
          <div className="mb-3">
            <label className="form-label">Card Number</label>
            <input
              type="number"
              max="9999999999999999"
              className="form-control"
              placeholder="1234 5678 9012 3456"
              required
            />
            <div className="invalid-feedback">Please enter valid card number.</div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="MM/YY"
                required
              />
              <div className="invalid-feedback">Please enter expiry date.</div>
            </div>
            <div className="col">
              <label className="form-label">CVV</label>
              <input
                type="number"
                className="form-control"
                min="100"
                max="999"
                placeholder="123"
                required
              />
              <div className="invalid-feedback">Please enter CVV.</div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Cardholder Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Your name"
              required
            />
            <div className="invalid-feedback">
              Please enter cardholder name.
            </div>
          </div>
          {paymentDone ? (
            <>
              <div className="d-flex justify-content-center align-items-center">
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  <span className="text-center">Processing..</span>
              </div>
            </>
          ) : (
            <button type="submit" className="btn btn-primary w-100">
              Pay Now
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Payment;
