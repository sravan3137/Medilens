import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from '../src/assets/logo.svg'
function SignupPage() {
  const { signup } = useContext(AuthContext); // get signup function from context
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // signup(username, email, password) → update AuthContext to accept username
      await signup(username, email,role, password);
      navigate("/"); // redirect after signup/login
    } catch (err) {
      console.error(err);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit}
        className="text-center m-5 p-5 mx-auto shadow rounded bg-body-tertiary"
        style={{ maxWidth: "400px" }}
      >
        <img src={logo} alt="" style={{height:"40px",width:"40px"}}/>
        <h3 className="mb-4">Sign Up</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Username */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingUsername"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="floatingUsername">Username</label>
        </div>

        {/* Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingEmail"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        {/* Role */}
        <div className="mb-3">
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              id="doctor"
              name="role"
              value="doctor"
              checked={role === "doctor"}
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="form-check-label" htmlFor="doctor">
              Doctor
            </label>
          </div>

          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              id="patient"
              name="role"
              value="patient"
              checked={role === "patient"}
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="form-check-label" htmlFor="patient">
              Patient
            </label>
          </div>
        </div>

        {/* Password */}
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        {/* Confirm Password */}
        <div className="form-floating rounded-bottom mb-4">
          <input
            type="password"
            className="form-control"
            id="floatingConfirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingConfirmPassword">Confirm Password</label>
        </div>

        <small>
          Already have an account? <Link to="/login">Login</Link>
        </small>

        <button type="submit" className="btn btn-primary w-100 fw-bold mt-3">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
