import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

// Register chart.js components and the datalabels plugin
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const MostAvailedServices = () => {
  const [internetServices, setInternetServices] = useState([]);
  const [tvServices, setTvServices] = useState([]);

  useEffect(() => {
    // Fetch most availed internet services
    axios.get('http://localhost:8082/admin/api/most-availed-internet-services', { withCredentials: true })
      .then(response => {
        const data = response.data || [];  // Ensure data is an array
        const sortedData = Array.isArray(data) ? data.sort((a, b) => b.subscribedCount - a.subscribedCount) : [];
        setInternetServices(sortedData.slice(0, 5)); // Keep only the top 5
      })
      .catch(error => console.error('Error fetching internet services:', error));

    // Fetch most availed TV services
    axios.get('http://localhost:8082/admin/api/most-availed-tv-services', { withCredentials: true })
      .then(response => {
        const data = response.data || [];  // Ensure data is an array
        const sortedData = Array.isArray(data) ? data.sort((a, b) => b.subscribedCount - a.subscribedCount) : [];
        setTvServices(sortedData.slice(0, 5)); // Keep only the top 5
      })
      .catch(error => console.error('Error fetching TV services:', error));
  }, []);

  // Internet Services Data
  const internetServiceLabels = internetServices.map(service => service.serviceName + " (" + service.serviceType + ")" || 'Unknown Service');
  const internetServiceCounts = internetServices.map(service => service.subscribedCount || 0);

  const internetData = {
    labels: internetServiceLabels,
    datasets: [
      {
        label: 'No of Users Availed',
        data: internetServiceCounts,
        backgroundColor: 'rgb(94, 94, 205)',
      },
    ],
  };

  // TV Services Data
  const tvServiceLabels = tvServices.map(service => service.serviceName + " (" + service.serviceType + ")" || 'Unknown Service');
  const tvServiceCounts = tvServices.map(service => service.subscribedCount || 0);

  const tvData = {
    labels: tvServiceLabels,
    datasets: [
      {
        label: 'No of Users Availed',
        data: tvServiceCounts,
        backgroundColor: 'rgb(94, 94, 205)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,  // Hide Y-axis grid lines
        },
        ticks: {
          display: false,  // Hide Y-axis values
          font: {
            size: 10,  // Reduce font size for Y-axis labels
          },
        },
      },
      x: {
        grid: {
          display: false,  // Optionally hide X-axis grid lines
        },
        ticks: {
          font: {
            size: 10,  // Reduce font size for X-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12,  // Reduce font size for the legend labels
          },
        },
      },
      tooltip: {
        titleFont: {
          size: 12,  // Reduce font size for tooltips
        },
        bodyFont: {
          size: 10,  // Reduce font size for tooltip body text
        },
      },
      datalabels: {
        display: true,
        color: 'black',  // Color of the labels
        align: 'end',
        anchor: 'end',
        font: {
          size: 12,  // Font size for the data labels
        },
        formatter: (value) => value, // Show the value on top of each bar
      },
    },
  };

  return (
    <div className="most-availed-services">
      <div id="internet">
        {internetServices.length > 0 ? (
          <div className="internet-graph">
            <h3>Most Availed Internet Services</h3>
            <Bar data={internetData} options={options} />
          </div>
        ) : (
          <p>Loading internet services data...</p>
        )}
      </div>
      <div id="tv">
        {tvServices.length > 0 ? (
          <div className="tv-graph">
            <h3>Most Availed TV Services</h3>
            <Bar data={tvData} options={options} />
          </div>
        ) : (
          <p>Loading TV services data...</p>
        )}
      </div>
    </div>
  );
};

export default MostAvailedServices;
