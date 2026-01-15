import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

/**
 * SidebarSection Component - Collapsible section in sidebar
 */
const SidebarSection = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-3xl border border-darkpapyrus bg-lightpapyrus p-5 shadow-nature-sm ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="text-base font-serif font-semibold text-slate-800">
          {title}
        </h3>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5 text-slate-600 transition-transform" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-slate-600 transition-transform" />
        )}
      </button>
      
      {isOpen && (
        <div className="transition-all duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

SidebarSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
};

export default SidebarSection;