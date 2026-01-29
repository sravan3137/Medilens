import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from '../src/assets/logo.svg'
function LoginPage() {
  const { login,user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(username, password); // using username here
      if(!res.data.user) {
        // console.log("RR:",res);
        setError(res.data.message);
        return;
      }
      console.log("login successfull: ",user);
      navigate("/"); 
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
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
        <h3 className="mb-4">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Username</label>
        </div>

        <div className="form-floating mb-4">
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

        <small>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </small>

        <button type="submit" className="btn btn-primary w-100 fw-bold mt-2">
          Login
        </button>
        
      </form>
      
    </div>
  );
}

export default LoginPage;
