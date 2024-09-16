import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate} from 'react-router-dom';
import './Styling_Components/UpdateServices.css';
//import './Modify.css'; // Import any CSS if needed

function UpdateInternetServices() {
  const [internetService, setInternetService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = location.state;

  useEffect(() => {
    // Fetch service details based on serviceId
    axios.get(`http://localhost:8082/api/internet-services/${serviceId}`,{withCredentials:true})
      .then(response => {
        setInternetService(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the service details!", error);
        setError(error.message);
        setLoading(false);
      });
  }, [serviceId]);

  const handleSaveInternetService = () => {
    // Implement save logic here
    // Example: send updated service details to the server
    const updatedData={
      serviceId,
      serviceName:internetService.serviceName,
      description:internetService.description,
      serviceType:internetService.serviceType,
      serviceDownloadSpeed:internetService.serviceDownloadSpeed,
      serviceUploadSpeed:internetService.serviceUploadSpeed,
      benefits:internetService.benefits,
      monthlyCost:internetService.monthlyCost,
      criteria:internetService.criteria,
      validity:internetService.validity,
    }
    axios.patch(`http://localhost:8082/admin/api/internet-service`,updatedData,{withCredentials:true})
      .then(response => {
        console.log("Service updated:", response.data);
        alert("Service updated successfully!!\nRedirecting to the home page");
        navigate('/admin/services'); // Redirect to the services page after updating
      })
      .catch(error => {
        console.error("There was an error updating the service!", error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <><div className="modify-container">
        <h1>Modify Service</h1>
        {internetService && (
          <form>
            <label>
              Service Name:
              <input 
                type="text"
                value={internetService.serviceName}
                onChange={(e) => setInternetService({ ...internetService, serviceName: e.target.value })} disabled/>
            </label>
            <label>
              Description:
              <textarea
                value={internetService.description}
                onChange={(e) => setInternetService({ ...internetService, description: e.target.value })} />
            </label>
            <label>
              Service Type:
              <textarea
                value={internetService.serviceType}
                onChange={(e) => setInternetService({ ...internetService, serviceType: e.target.value })} disabled/>
            </label>
            <label>
              Download Speed(Mbps):
              <textarea
                value={internetService.serviceDownloadSpeed}
                onChange={(e) => setInternetService({ ...internetService, serviceDownloadSpeed: e.target.value })} />
            </label>
            <label>
              Upload Speed(Mbps):
              <textarea
                value={internetService.serviceUploadSpeed}
                onChange={(e) => setInternetService({ ...internetService, serviceUploadSpeed: e.target.value })} />
            </label>
            <label>
              Cost:Rs.
              <textarea
                value={internetService.cost}
                onChange={(e) => setInternetService({ ...internetService, monthlyCost: e.target.value })} />
            </label>
            <label>
              Benifits:
              <textarea
                value={internetService.benefits}
                onChange={(e) => setInternetService({ ...internetService, benefits: e.target.value })} />
            </label>
            <label>
              Criteria:
              <textarea
                value={internetService.criteria}
                onChange={(e) => setInternetService({ ...internetService, criteria: e.target.value })} />
            </label>
            <label>
              Validity(in days):
              <textarea
                value={internetService.validity}
                onChange={(e) => setInternetService({ ...internetService, criteria: e.target.value })} />
            </label>
            {/* Add other fields as necessary */}
            <button type="button" onClick={handleSaveInternetService}>Save Changes</button>
          </form>
        )}
      </div></>
  );
}

export default UpdateInternetServices;
