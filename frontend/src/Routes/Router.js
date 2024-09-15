import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../Components/Home";

import LoginRegister from "../Pages/LoginRegister";
import AddToCart from "../Pages/Add_To_Cart";
import Category from "../Pages/Category/Category";
import Order from "../Pages/Order";
import ProtectedRoute from "./ProtectedRoute";
import PAGE_NOT_FOUND from "../Pages/PAGE_NOT_FOUND";
import SearchPage from "../Pages/SearchPage";
import Profile from "../Pages/Profile";
import About from "../Pages/About";
import GoToTop from "../Container/GoToTop";
import ProductPage from "../Container/ProductPage";
import Booking from "../Pages/Booking";

function Router() {
  const { pathname } = useLocation();
  
  //This component will scroll the window to the top whenever the route changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Define routes where GoToTop should be visible
  const routesWithGoToTop = [
    "/home",
    "/search",
    "/products/:category/:filter?",
  ];

  // Function to check if the current path matches any of the specified routes
  const pathMatches = (path) => {
    const regexPath = path.replace(/:[^\s/]+/g, "([^/]+)");
    const regex = new RegExp(`^${regexPath}$`);
    return regex.test(pathname);
  };

  const shouldShowGoToTop = routesWithGoToTop.some(pathMatches);

  return (
    <>
      {shouldShowGoToTop && <GoToTop />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
       
        <Route path="/product/:category/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginRegister />} />

        <Route path="/cart" element={<AddToCart />} />
        <Route
          path="/profile"
          element={<ProtectedRoute Component={Profile} />}
        />

        <Route path="/booking" element={<Booking/>} />

        <Route path="/products/:category/:filter?" element={<Category />} />
        <Route path="/order" element={<Order />} />

        <Route path="/*" element={<PAGE_NOT_FOUND />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
}

export default Router;
