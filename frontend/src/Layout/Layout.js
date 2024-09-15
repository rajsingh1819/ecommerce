import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Router from '../Routes/Router';
import Footer from '../Components/Footer';

function Layout() {
  const location = useLocation();
  const { pathname } = location;

  // List of routes where the header should not be shown
  const hideHeaderRoutes = ['/booking']; // Add other routes as needed

  // Check if the current route is one where the header should be hidden
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Router />
      <Footer />
    </>
  );
}

export default Layout;
