import React from 'react';

/**
 * ClickableContact component for rendering clickable phone numbers and email addresses
 * @param {Object} props
 * @param {string} props.type - The type of contact ('phone' or 'email')
 * @param {string} props.value - The contact value (phone number or email address)
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {JSX.Element} Clickable contact link
 */
const ClickableContact = ({ type, value, className = '' }) => {
  // Remove any spaces, dashes, or parentheses from phone numbers
  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/[\s()-]/g, '');
  };

  // Determine the href based on type
  const getHref = () => {
    if (type === 'phone') {
      return `tel:${formatPhone(value)}`;
    } else if (type === 'email') {
      return `mailto:${value}`;
    }
    return '#';
  };

  return (
    <a 
      href={getHref()} 
      className={`clickable-contact ${className}`}
    >
      {value}
    </a>
  );
};

export default ClickableContact; 