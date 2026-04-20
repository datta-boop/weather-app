import React from 'react';
import './Toast.css';
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const ICONS = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
};

const Toast = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map(({ id, message, type = 'info' }) => (
      <div key={id} className={`toast toast-${type}`}>
        <span className="toast-icon">{ICONS[type]}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={() => removeToast(id)} aria-label="Dismiss">
          <FaTimes />
        </button>
      </div>
    ))}
  </div>
);

export default Toast;
