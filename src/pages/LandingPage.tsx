import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import '../App.css';

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navigation onPageChange={handlePageChange} currentPage={currentPage} />
      {renderCurrentPage()}
      <Footer />
    </Box>
  );
};

export default LandingPage;
