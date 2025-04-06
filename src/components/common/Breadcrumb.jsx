import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/breadcrumb.css';

const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumb">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {index < items.length - 1 ? (
              <>
                <Link to={item.path}>{item.label}</Link>
                <span className="separator">
                  <i className="material-icons">chevron_right</i>
                </span>
              </>
            ) : (
              <span className="current">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb; 