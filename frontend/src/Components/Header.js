import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Form } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoCartOutline, IoArrowBack } from "react-icons/io5";
import "../Components/styles/header.css";
import { IoIosMenu } from "react-icons/io";
import { FaReact } from "react-icons/fa";
import { useCartContext } from "../Context/Cart_Context";
import DropDownProfile from "./DropDownProfile";
import { RxCross2 } from "react-icons/rx";
import { IoHomeOutline } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { FcAbout } from "react-icons/fc";
import { TbLogout } from "react-icons/tb";

const nav_Links = [
  { path: "/home", display: "Home",icon:<IoHomeOutline/>},
  { path: "/order", display: "Order",icon : <CiDeliveryTruck /> },
  { path: "/profile", display: "Profile" ,icon:<PiUserCircleCheckLight/>},
  { path: "/about", display: "About",icon:<FcAbout/> },
  // {display: "logout",icon:<TbLogout/>}
];

function Header() {
  const headerRef = useRef(null); // fixed header
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCartContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const stickyHeaderFunc = () => {
    if (headerRef.current) {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    }
  };

  const toggleMenu = () => menuRef.current?.classList.toggle("show_menu");

  useEffect(() => {
    stickyHeaderFunc();
    window.addEventListener("scroll", stickyHeaderFunc);
    return () => {
      window.removeEventListener("scroll", stickyHeaderFunc);
    };
  });

  const goBack = () => {
    navigate(-1); // Go back one step
  };

  const handleSearchInput = (e) => {
    e.target.value.length <= 60 && setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
    setShowSearch(false);
  };

  //when scroll ShowSearch will be hide
  useEffect(() => {
    const handleScroll = () => {
      setShowSearch(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row className="Row_bottom_style">
          <div className="header_wrap">
            {location.pathname !== "/home" &&
              location.pathname !== "/login" && (
                <div className="back_arrow" onClick={goBack}>
                  <IoArrowBack />
                </div>
              )}
            <div className="logo" onClick={() => navigate("/home")}>
              <FaReact size={40} className="webLogo" />
            </div>

            <Form className="form-inline" onSubmit={handleSearchSubmit}>
              {showSearch ? (
                <div className="search-sumbit">
                  <div className="search-input-icon">
                    <input
                      type="text"
                      placeholder="Search here......"
                      className="form-control mr-sm-2 input-style"
                      id="search"
                      name="search"
                      value={searchTerm}
                      onChange={handleSearchInput}
                    />

                    {searchTerm.length > 0 && (
                      <span onClick={() => setSearchTerm("")}>
                        {" "}
                        <RxCross2 size={20} className="search-icon clear" />
                      </span>
                    )}
                  </div>

                  <IoSearchOutline
                
                    size={30}
                    className="search-icon"
                    onClick={handleSearchSubmit}
                  />
                </div>
              ) : (
                <div className="search-active-icon">
                  <IoSearchOutline
                  color="#0d6efd"
                    size={30}
                    className="search-icon"
                    onClick={() => setShowSearch(true)}
                  />
                </div>
              )}
            </Form>

            <div className="cartItem">
              <NavLink
                to="/cart"
                className={(navClass) =>
                  navClass.isActive ? "active_link" : null
                }
              >
                <div className="CartStyle">
                  <IoCartOutline className="cartIcon" color="#0d6efd" />{" "}
                  {cart?.length !== 0 ? (
                    <span className="cart-length">{cart?.length}</span>
                  ) : null}{" "}
                  <span className="show-cart">Cart</span>
                </div>
              </NavLink>
            </div>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu">
                {nav_Links.map((item, index) => (
                  <li key={index} className="list_item">
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active_link" : null
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav_right">
              {/* user login, logout and profile action */}
              <DropDownProfile />
            </div>

            <span className="mobile_menu" onClick={toggleMenu}>
              <IoIosMenu />
            </span>
          </div>
        </Row>
      </Container>
    </header>
  );
}

export default Header;
