import React, { useState } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import toast from "react-hot-toast";


function Register({ showForm, setShowForm }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [nameLengthWarning, setNameLengthWarning] = useState(false);
  const [passwordLengthWarning, setPasswordLengthWarning] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      duration: 2000,
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

  const clearFormFields = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
    });

    setNameLengthWarning(false);
    setPasswordLengthWarning(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setNameLengthWarning(
        value.length > 0 && (value.length < 5 || value.length > 10)
      );
    }
    if (name === "password") {
      setPasswordLengthWarning(
        value.length > 0 && (value.length < 5 || value.length > 10)
      );
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  const actionSubmitRegister = async (event) => {
    event.preventDefault();
    const { username, email, password, role } = formData;

    if (
      username?.length > 10 ||
      password?.length > 10 ||
      username?.length < 5 ||
      password?.length < 5
    ) {
      return false;
    }

    const registerApi = "https://ecommerce-backend-odsg.onrender.com/user/register";
    try {
      const response = await fetch(registerApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role: role || "user",
        }), // Default role if not provided
      });

      const data = await response.json(); // Parse JSON response

      if (response.ok) {
        // console.log(data);
        notifySuccess(data.message || "Registration successful!");
        clearFormFields();
        setShowForm(!showForm);
      } else {
        // console.log(data);
        notifyError(data.message || "Registration failed!");
      
         
  data.message === "Username already exists!"  ? setFormData((prevState) => ({
    ...prevState,
    username: "", // Clear only the usename field
  })):
  setFormData((prevState) => ({
    ...prevState,
    email: "", // Clear only the email field
  }))



      }
    } catch (error) {
      console.log("Error during registration:", error);
      notifyError("An error occurred during registration.");
    }
  };

  return (
    <form onSubmit={actionSubmitRegister}>
      <div className="divider d-flex align-items-center my-4">
        <p className="text-center fw-bold mx-3 mb-0">Or</p>
      </div>

      <div className="form-outline mb-3">
        <input
          type="text"
          className="form-control form-control-lg mb-2"
          placeholder="Enter username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          autoComplete="username"
          required
        />
        {nameLengthWarning && (
          <span className="lenghtWarnning">
            *Name length min 5 and max 10 characters long!
          </span>
        )}
      </div>

      <div className="form-outline mb-3">
        <input
          type="email"
          className="form-control form-control-lg"
          placeholder="Enter a valid email address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-outline mb-2 icon-hide-show">
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
      {passwordLengthWarning && (
        <span className="lenghtWarnning">
          *Password length min 5 and max 10 characters long!
        </span>
      )}

      <div className="text-center text-lg-start mt-4 pt-2 style-Buttonstyle-p">
        <button type="submit" className="btn btn-primary btn-lg">
          Register
        </button>
        <p className="small fw-bold mt-2 pt-1 mb-0">
          Already have an account?
          <span className="link-danger" onClick={() => setShowForm(!showForm)}>
            {" "}
            Login
          </span>
        </p>
      </div>
    </form>
  );
}

export default Register;
