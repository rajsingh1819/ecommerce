import React, {  useState } from "react";
import "./style/profile.css";
import { Container, Row, Col } from "react-bootstrap";
import userImage from "../../src/assets/images/userPng.png";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import toast from "react-hot-toast";
import { useCartContext } from "../Context/Cart_Context";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const {  userInfo} = useCartContext();
  const [contactUS, setContactUS] = useState({ message: "" });

  const notifySuccess = () =>
    toast.success("Message Sent Successfully!", {
      duration: 2000,
      className: "hot-toast",
    });

  const notifyInfo = () => {
    toast("Message should not be empty!", {
      icon: <span className="hot-toast-icon">ⓘ</span>,
      duration: 2000,
      className: "hot-toast",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactUS((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contactUS.message) {
      notifyInfo();
    } else {
      const newMessage = {
        ...contactUS,
        userId:  userInfo?._id || "default-user-id",
        usename:  userInfo?.username

      };

     

      notifySuccess();
      setContactUS({ message: "" }); // Reset the message input
      // console.log("new Message ==> ", newMessage);
    }
  };

 

  return (
    <div className="profile-top">
      <Container>
        <Row>
          <Col lg={4} className="col-height">
            <div className="user-profile">
              <div className="user-image mb-2">
                <img
                  src={userImage}
                  alt="User Profile"
                  className="profile-img"
                />
              </div>
              <h3>{ userInfo?.username?.toUpperCase() || "USER NAME"}</h3>
              <h5>{ userInfo?.role}</h5>
              <h6 className="contactUS">Contact US</h6>
              <div className="usericonSection mb-2  gap-4">
                <a
                  href="https://github.com/rajsingh1819/ecommerce"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={30} />
                </a>
                <a
                  href="https://www.linkedin.com/in/raj-singh-r-s/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={30} />
                </a>
              </div>
            </div>
          </Col>
          <Col lg={8} className="col-height">
            <div className="user-info">
              <h5 className="info-title">USER INFORMATION</h5>
              <div className="user-details">
                <h5>
                  Name: <span>{ userInfo?.username}</span>
                </h5>
                <h5>
                  Email: <span>{ userInfo?.email}</span>
                </h5>
              </div>

              <h5 className="info-title">Details</h5>
              <div className="user-details">
                <h5 className="profileOrder" onClick={() => navigate("/order")}>
                  Order:{" "}
                  <span>
                   {
                    userInfo?.bookings?.length || "NA"
                   }
                  </span>
                </h5>
                <h5>
                  Contact Us:{" "}
                  <span>
                    {/* {
                      contact?.filter((item) => item.userId ===  userInfo?.id)
                        .length
                    } */}
                    0
                  </span>
                </h5>
              </div>

              <h5 className="contact-info">Contact Us:</h5>
              <form className="contact-form" onSubmit={handleSubmit}>
                <textarea
                  className="form-control rounded-0 mb-2"
                  id="message"
                  name="message"
                  placeholder="Type your message here..."
                  rows="5"
                  autoComplete="given-name"
                  value={contactUS.message}
                  onChange={handleInputChange}
                />
                <button type="submit" className="submitContact">
                  Send
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
