// AlertModal.js
import React from 'react';
import './Styling_Components/AlertModal.css';

const AlertModal = ({ message, onOk, onCancel }) => {
    return (
        <>
            <div className="overlay-alert" onClick={onCancel}></div> {/* Overlay for background */}
            <div className="alert-modal">
                <p>{message}</p>
                <button onClick={onOk}>OK</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </>
    );
};



export default AlertModal;
