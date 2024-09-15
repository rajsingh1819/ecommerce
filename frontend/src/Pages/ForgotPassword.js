import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import toast from "react-hot-toast";

function ForgotPassword({ setForgotAction }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [passwordLengthWarning, setPasswordLengthWarning] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setConfirmShowPassword(false);
   
  };

  const  toggleConfirmPasswordVisibility =()=>{
    setConfirmShowPassword(!confirmShowPassword);
    setShowPassword(false);

  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPasswordLengthWarning(
        value.length > 0 && (value.length < 5 || value.length > 10)
      );
    }


    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const clearFormFields = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      duration: 2000,
      className: "hot-toast",
    });
  };

  const notifyInfo = (message) => {
    toast(message, {
      icon: <span className="hot-toast-icon">ⓘ</span>,
      duration: 2000,
      className: "hot-toast",
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      duration: 2000,
      className: "hot-toast",
    });
  };

  const handleCheckEmailSubmit = async (e) => {
    e.preventDefault();

    const { email } = formData;

    try {
      const response = await fetch("http://localhost:8000/user/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok && result.status) {
        notifyInfo(result.message || "User found.");
        setShowPasswordForm(true);
      } else {
        notifyError(result.message || "Error checking email.");
        clearFormFields();
        setShowPasswordForm(false);
      }
    } catch (error) {
      notifyError("Failed to check email.");
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (password.length < 5 || password.length > 10) {
      return false; // Invalid password length
    }

    if (password !== confirmPassword) {
      notifyError("Passwords do not match.");
      return false; // Passwords don't match
    }

    try {
      const response = await fetch("http://localhost:8000/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok && result.status) {
        notifySuccess(result.message);
        clearFormFields();
        setShowPasswordForm(false);
        setShowPassword(false);
        setConfirmShowPassword(false);
        setForgotAction(false);
      } else {
        setShowPassword(false);
        setConfirmShowPassword(false);
        notifyError(result.message || "Error updating password.");
        
      }
    } catch (error) {
      notifyError("Failed to update password.");
    }
  };

  const closeAll = () => {
    setShowPasswordForm(false);
    setForgotAction(false);
  };

  return (
    <div>
      <form
        onSubmit={
          !showPasswordForm
            ? handleCheckEmailSubmit
            : handleChangePasswordSubmit
        }
      >
        {!showPasswordForm ? (
          <div>
            <h6 style={{ color: "red" }}>Forgot Password!</h6>
            <h6>Enter Your Registered email id!</h6>
            <div className="form-outline mb-4">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter Your email here"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
              />
            </div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Button type="button" onClick={() => setForgotAction(false)}>
                Back
              </Button>
              <Button type="submit">Proceed</Button>
            </div>
          </div>
        ) : (
          <div>
            <h6 style={{ color: "red" }}>Email: {formData?.email}</h6>
            <h6>Create Your New Password!</h6>

            <div className="form-outline mb-2 icon-hide-show">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Enter new password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                onFocus={() => setConfirmShowPassword(false)}

                required
              />
              <span onClick={togglePasswordVisibility}>
                {showPassword ? <IoEyeSharp className="eye-icon" /> : <IoEyeOffSharp className="eye-icon" />}
              </span>
            </div>
            {passwordLengthWarning && (
              <span className="lenghtWarnning">
                *Password length min 5 and max 10 characters long!
              </span>
            )}

            <h6>Confirm Your New Password!</h6>
            <div className="form-outline mb-2 icon-hide-show">
              <input

                type={confirmShowPassword  ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="confirm-password"
                onFocus={() => setShowPassword(false)}
                required
              />
              <span onClick={toggleConfirmPasswordVisibility}>
                {confirmShowPassword ? <IoEyeSharp className="eye-icon" /> : <IoEyeOffSharp className="eye-icon" />}
              </span>

             

            </div>
            {formData.confirmPassword.length > 0 && (
                formData.password === formData.confirmPassword ? (
                  <span className="lenghtMatched">*Password matched!</span>
                ) : (
                  <span className="lenghtNotMatched">*Password not matched!</span>
                )
              )}


            <div className="mt-4 d-flex align-items-center justify-content-center gap-2">
              <Button type="button" onClick={closeAll}>
                Close
              </Button>
              <Button type="submit">Change Password</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
