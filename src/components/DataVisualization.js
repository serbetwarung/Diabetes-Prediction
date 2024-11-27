import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DataVisualization() {
  const data = {
    labels: ['Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'],
    datasets: [
      {
        label: 'Risiko Diabetes',
        data: [10, 30, 60, 90],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribusi Risiko Diabetes'
      }
    }
  };

  return (
    <div className="data-visualization">
      <h2>Visualisasi Risiko Diabetes</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default DataVisualization;
