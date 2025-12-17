import PropTypes from "prop-types";

function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
