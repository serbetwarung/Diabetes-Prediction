import React from 'react';
import { Card, Alert, Badge } from 'react-bootstrap';

function ResultDisplay({ result }) {
  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 'Rendah': return 'success';
      case 'Sedang': return 'warning';
      case 'Tinggi': return 'danger';
      default: return 'dark';
    }
  };

  const getRiskInterpretation = (riskLevel) => {
    switch(riskLevel) {
      case 'Rendah': 
        return 'Risiko diabetes Anda relatif rendah. Tetap pertahankan gaya hidup sehat.';
      case 'Sedang': 
        return 'Ada indikasi risiko diabetes. Konsultasikan dengan dokter untuk pemeriksaan lebih lanjut.';
      case 'Tinggi': 
        return 'Risiko diabetes cukup tinggi. Segera lakukan konsultasi medis dan perbaiki gaya hidup.';
      default: 
        return 'Risiko diabetes sangat tinggi. Diperlukan tindakan medis segera.';
    }
  };

  return (
    <div className="result-display">
      <Card>
        <Card.Header className="text-center">
          <h2>Hasil Prediksi Risiko Diabetes</h2>
        </Card.Header>
        <Card.Body>
          <Alert variant={getRiskColor(result.riskLevel)} className="text-center">
            <h3>
              <Badge bg={getRiskColor(result.riskLevel)}>
                {result.riskLevel}
              </Badge>
            </h3>
            <p className="mt-2">Persentase Risiko: {result.riskPercentage}%</p>
          </Alert>

          <Card.Title className="mb-3">Detail Data Kesehatan</Card.Title>
          <div className="risk-details">
            <div className="detail-item">
              <strong>Umur:</strong> {result.details.age} tahun
            </div>
            <div className="detail-item">
              <strong>BMI:</strong> {result.details.bmi}
            </div>
            <div className="detail-item">
              <strong>Tekanan Darah:</strong> {result.details.bloodPressure} mmHg
            </div>
            <div className="detail-item">
              <strong>Kadar Glukosa:</strong> {result.details.glucoseLevels} mg/dL
            </div>
          </div>

          <Alert variant="info" className="mt-3">
            <strong>Interpretasi:</strong>
            <p>{getRiskInterpretation(result.riskLevel)}</p>
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ResultDisplay;
