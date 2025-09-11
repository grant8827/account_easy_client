import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import PricingPage from './PricingPage';
import '../App.css';

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'pricing':
        return <PricingPage />;
      default:
        return <HomePage />;
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
