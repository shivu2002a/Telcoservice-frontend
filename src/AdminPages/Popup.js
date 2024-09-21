import React from 'react';
function Popup({ service, closePopup }) {
  return (
    <div className="popup-overlay show">
      <div className="popup-content">
        <button className="close-popup" onClick={closePopup}>Close</button>
        <h2>{service.serviceName}</h2>
        <p><strong>Description:</strong> {service.description}</p>
        <p><strong>Service Type:</strong> {service.serviceType}</p>
        <p><strong>Benefits:</strong> {service.benefits}</p>
        {service.serviceDownloadSpeed || service.serviceUploadSpeed ? (
          <>
            <p><strong>Download Speed:</strong> {service.serviceDownloadSpeed} Mbps</p>
            <p><strong>Upload Speed:</strong> {service.serviceUploadSpeed} Mbps</p>
          </>
        ) : null}
        <p><strong>Cost:</strong> Rs.{service.cost}</p>
        <p><strong>Validity:</strong>{service.validity} Days</p>
      </div>
    </div>
  );
}

export default Popup;
