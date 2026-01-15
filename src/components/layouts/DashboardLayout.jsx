import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TopBar from '../TopBar';
import Sidebar from '../navigation/Sidebar';

/**
 * DashboardLayout Component - Main layout with sidebar and topbar
 */
const DashboardLayout = ({ children, showBreadcrumb = true, breadcrumbContent = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-bgpapyrus flex flex-col">
      <TopBar toggleMenu={toggleMenu} />
      
      <Sidebar 
        isOpen={isMenuOpen} 
        onClose={toggleMenu} 
        userId={userId}
      />
      
      {showBreadcrumb && breadcrumbContent && (
        <div className="bg-lightpapyrus border-b border-darkpapyrus">
          {breadcrumbContent}
        </div>
      )}
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showBreadcrumb: PropTypes.bool,
  breadcrumbContent: PropTypes.node,
};

export default DashboardLayout;