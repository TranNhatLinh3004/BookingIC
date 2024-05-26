import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm, wishlistName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onCancel}>
          &times;
        </span>
        <h3 className="modal-title">Xóa khách sạn yêu thích này?</h3>
        <p>{`Khách sạn sẽ bị xóa vĩnh viễn.`}</p>
        <div className="button-group">
          <button className="cancel-button" onClick={onCancel}>
            Hủy Bỏ
          </button>
          <button className="delete-button" onClick={onConfirm}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
