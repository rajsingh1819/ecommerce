import React, { useState } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login({ showForm, setShowForm, setForgotAction }) {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      className: "hot-toast",
    });
  };

  const notifyError = (message) => {
    toast(message, {
      icon: <span className="hot-toast-icon">ⓘ</span>,
      duration: 2000,
      className: "hot-toast",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const actionSubmitLogin = async (event) => {
    event.preventDefault();
    const { emailOrUsername, password, rememberMe } = formData;

    try {
      const loginApi = "http://localhost:8000/user/login";
      const response = await fetch(loginApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password, rememberMe }),
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        const token = data.token;
        notifySuccess(data.message || "Login successful!");
        localStorage.setItem('authToken', token);
    
        navigation('/home');
       
        clearFormFields();
      } else {
        // console.log(data);
        notifyError(data.message || "Login failed!");
      }
    } catch (error) {
      console.log("Error during login:", error);
      notifyError("An error occurred during login.");
    }
  };

  const clearFormFields = () => {
    setFormData({
      name: "",
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    });
  };

  return (
    <>
      {/* {!forgotAction ? ( */}
      <form onSubmit={actionSubmitLogin}>
        <div className="divider d-flex align-items-center my-4">
          <p className="text-center fw-bold mx-3 mb-0">Or</p>
        </div>

        <div className="form-outline mb-4">
          <input
            type="emailOrUsername"
            className="form-control form-control-lg"
            placeholder="Enter email or username"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleInputChange}
            autoComplete="emailOrUsername"
            onFocus={() => setShowPassword(false)}
            required
          />
        </div>
        <div className="form-outline mb-3  icon-hide-show">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control form-control-lg"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            required
          />
          <span onClick={togglePasswordVisibility}>
            {showPassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="form-check mb-0">
            <input
              className="form-check-input me-2"
              type="checkbox"
              id="form2Example3"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              onFocus={() => setShowPassword(false)}
              required
            />
            <label className="form-check-label" htmlFor="form2Example3">
              Remember me
            </label>
          </div>
          <Link
            to="#"
            className="text-body"
            onClick={() => setForgotAction(true)}
          >
            Forgot password?
          </Link>
        </div>

        <div className="text-center text-lg-start mt-4 pt-2 style-Buttonstyle-p ">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            onFocus={() => setShowPassword(false)}
          >
            Login
          </button>
          <p
            className="small fw-bold mt-2 pt-1 mb-0"
            onClick={() => setShowForm(!showForm)}
          >
            Don't have an account?
            <span className="link-danger">Register</span>
          </p>
        </div>
      </form>
      {/* // ) : ( // <ForgotPassword setForgotAction={setForgotAction} />
      // )} */}
    </>
  );
}

export default Login;
