import React from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

function HealthTips({ result, className }) {
  const getTips = (result) => {
    if (!result) return [];

    const tips = [
      {
        title: 'Pola Makan Sehat',
        content: 'Konsumsi makanan seimbang dengan porsi tepat, kurangi gula dan karbohidrat sederhana.'
      },
      {
        title: 'Aktivitas Fisik',
        content: 'Lakukan olahraga teratur minimal 30 menit sehari, 5 kali seminggu.'
      },
      {
        title: 'Monitoring Rutin',
        content: 'Periksa gula darah secara teratur dan catat hasilnya.'
      }
    ];

    if (result.risk === 'high') {
      tips.push({
        title: 'Konsultasi Dokter',
        content: 'Segera konsultasikan hasil ini dengan dokter untuk evaluasi lebih lanjut.'
      });
    }

    return tips;
  };

  return (
    <motion.div
      className={`health-tips ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="mb-3">Tips Kesehatan</h3>
      <div className="tips-container">
        {getTips(result).map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="mb-2 tip-card">
              <Card.Body>
                <h5 className="tip-title">{tip.title}</h5>
                <p className="mb-0">{tip.content}</p>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default HealthTips;
