import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';

function PredictionHistory({ history, className }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskBadgeVariant = (risk) => {
    switch (risk) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <motion.div
      className={`prediction-history ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="mb-3">Riwayat Prediksi</h3>
      <div className="history-container">
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="mb-2 history-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-2">{formatDate(item.date)}</h6>
                    <Badge bg={getRiskBadgeVariant(item.risk)}>
                      {item.risk === 'high' ? 'Risiko Tinggi' :
                       item.risk === 'medium' ? 'Risiko Sedang' : 'Risiko Rendah'}
                    </Badge>
                  </div>
                  <div className="text-end">
                    <small className="text-muted">
                      BMI: {item.bmi}<br />
                      Glukosa: {item.glucoseLevels} mg/dL
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PredictionHistory;
