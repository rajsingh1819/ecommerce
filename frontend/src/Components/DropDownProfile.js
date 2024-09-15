import React, { useRef, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import userImage from "../../src/assets/images/userPng.png";
import "./styles/dropDownProfile.css";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartContext } from "../Context/Cart_Context";
import { jwtDecode } from "jwt-decode";
import { IoMdLogIn } from "react-icons/io";

function DropDownProfile() {
  const location = useLocation();
  const { userInfo, setUserInfo} = useCartContext();
  const [openProfile, setOpenProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  const navigate = useNavigate();
  const iconRef = useRef();
  const menuRef = useRef();

  const loadProfile = async () => {
   
    if (!(localStorage.getItem("authToken"))) {

      setIsLoggedIn(false);
  }
  else{
    try {
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const userApi = `http://localhost:8000/user/${userId}`;
      const response = await fetch(userApi);
      const data = await response.json();
      setProfileData(data);
      setIsLoggedIn(true);
      setUserInfo({...data,activeUser : true});

     
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
   

   
  };

  useEffect(() => {
    loadProfile();
    
  }, [navigate]);

  const handleNameClick = () => setOpenProfile((prev) => !prev);
  const handleProfileLinkClick = () => {
    navigate("/profile");
    setOpenProfile(false);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setOpenProfile(false);
    setIsLoggedIn(false);
    navigate("/home");
    toast.success("User Logout Successfully!", { duration: 3000, className: "hot-toast" });
  };





  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        iconRef.current &&
        !iconRef.current.contains(e.target)
      ) {
        setOpenProfile(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setOpenProfile(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <div className="dropdown-profile-container">
          <div className="userProfileIcon">
            <img
              ref={iconRef}
              src={userImage}
              alt={profileData?.username?.toUpperCase() || "USER NAME"}
              width={45}
              height={45}
              onClick={handleNameClick}
              className={openProfile ? "userIcon" : ""}
            />
          </div>

          {openProfile && (
            <div className="dropdownProfile" ref={menuRef}>
              <div className="flex flex-col gap-4">
                <h6 onClick={handleNameClick}>
                  {profileData?.username?.toUpperCase() || "USER NAME"}
                </h6>
                <h6 onClick={handleProfileLinkClick}>Profile</h6>
                <h6 onClick={logout}>Logout</h6>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="header_btn">
          <Button
            className="btn"
            // variant="#0d6efd"
            color="#0d6efd"

            onClick={() => navigate("/login")}
          >
            {location.pathname=="/login" ?  < IoMdLogIn size={22} color="black"/>    : <span>Login</span>  }
          </Button>
        </div>
      )}
    </div>
  );
}


export default DropDownProfile;
