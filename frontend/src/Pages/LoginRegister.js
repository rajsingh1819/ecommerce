import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";
import "./style/loginRegister.css";
import loginimage from "../../src/assets/images/login_image.png";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

function LoginRegister() {
  const [forgotAction, setForgotAction] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("authToken");

  const iconsLogin = () => {
    toast("Developing Phase....", {
      icon: <span className="hot-toast-icon">ⓘ</span>,
      duration: 2000,
      className: "hot-toast",
    });
  };

  useEffect(() => {
    isLoggedIn && navigate("/home");
  }, []);

  return (
    <section className="login-container">
      {
        <div className="container py-3 h-100">
          <div className="row d-flex align-items-center justify-content-center justify-content-lg-start  ">
            <div className="col-md-8 col-lg-7 col-xl-6 d-none d-lg-block">
              <img
                src={loginimage}
                className="img-fluid"
                alt="img-data"
                loading="lazy"
              />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1   form-body-style">
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start mb-4">
                <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-floating mx-1"
                  onClick={iconsLogin}
                >
                  <FaGoogle />
                </button>
                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-floating mx-1"
                  onClick={iconsLogin}
                >
                  <FaFacebookF />
                </button>
                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-floating mx-1"
                  onClick={iconsLogin}
                >
                  <FaTwitter />
                </button>
              </div>
              {forgotAction ? (
                <ForgotPassword setForgotAction={setForgotAction} />
              ) : showForm ? (
                <Login
                  showForm={showForm}
                  setShowForm={setShowForm}
                  forgotAction={forgotAction}
                  setForgotAction={setForgotAction}
                />
              ) : (
                <Register showForm={showForm} setShowForm={setShowForm} />
              )}
            </div>
          </div>
        </div>
      }
    </section>
  );
}

export default LoginRegister;
