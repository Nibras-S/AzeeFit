import React, { useEffect } from 'react';
import Header from '../components/static/components/header/Header';
import Program from '../components/static/components/program/Program';
import Navbar from '../components/static/components/navbar/Navbar';
import Class from '../components/static/components/class/Class';
import Price from '../components/static/components/pricing/Price';
import './pageHome.css';

function PageHome({ setIsAuthenticated }) {
  useEffect(() => {
    // Reset isAuthenticated to false when this page is rendered
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  }, [setIsAuthenticated]);

  return (
    <div>
      <Navbar />
      <Header />
      <Program />
      <Class />
      <Price />
    </div>
  );
}

export default PageHome;
