import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const icon = type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />;
  const bgColor = type === 'success' ? 'var(--malbec)' : '#dc2626';
  const borderColor = type === 'success' ? 'var(--golden-beige)' : '#fca5a5';

  return (
    <div className={`toast ${isVisible ? 'toast-visible' : ''}`}>
      <div 
        className="toast-content"
        style={{ 
          backgroundColor: bgColor,
          borderColor: borderColor
        }}
      >
        <div className="toast-icon">
          {icon}
        </div>
        <div className="toast-message">
          {message}
        </div>
        <button className="toast-close" onClick={handleClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
