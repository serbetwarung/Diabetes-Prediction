import React, { useState } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { predictDiabetes } from '../services/predictionService';

function DiabetesPredictionForm({ onPredict, isLoading }) {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    bloodPressure: '',
    glucoseLevels: ''
  });
  const [error, setError] = useState(null);

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return '';
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { age, height, weight, bloodPressure, glucoseLevels } = formData;
      if (!age || !height || !weight || !bloodPressure || !glucoseLevels) {
        setError('Harap isi semua field');
        return;
      }

      const bmi = calculateBMI(height, weight);
      const result = await predictDiabetes({
        ...formData,
        bmi
      });
      onPredict(result);
    } catch (err) {
      setError('Gagal melakukan prediksi. Coba lagi.');
      console.error(err);
    }
  };

  const bmi = calculateBMI(formData.height, formData.weight);
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return '(Kurus)';
    if (bmi < 25) return '(Normal)';
    if (bmi < 30) return '(Gemuk)';
    return '(Obesitas)';
  };

  return (
    <motion.div
      className="prediction-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Masukkan Data Kesehatan</h2>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="danger">{error}</Alert>
            </motion.div>
          )}
          
          <Form onSubmit={handleSubmit} className="mb-4">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Form.Group className="mb-3">
                <Form.Label>Umur</Form.Label>
                <Form.Control 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Masukkan umur"
                  required
                  className="form-input"
                />
                <Form.Text className="text-muted">
                  Masukkan umur dalam tahun
                </Form.Text>
              </Form.Group>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Form.Group className="mb-3">
                <Form.Label>Tinggi Badan</Form.Label>
                <Form.Control 
                  type="number" 
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Masukkan tinggi badan"
                  required
                  className="form-input"
                />
                <Form.Text className="text-muted">
                  Masukkan tinggi badan dalam cm
                </Form.Text>
              </Form.Group>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Form.Group className="mb-3">
                <Form.Label>Berat Badan</Form.Label>
                <Form.Control 
                  type="number" 
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Masukkan berat badan"
                  required
                  className="form-input"
                />
                <Form.Text className="text-muted">
                  Masukkan berat badan dalam kg
                </Form.Text>
              </Form.Group>
            </motion.div>

            {bmi && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-3"
              >
                <Alert variant="info">
                  BMI Anda: {bmi} {getBMICategory(bmi)}
                </Alert>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Form.Group className="mb-3">
                <Form.Label>Tekanan Darah Sistolik</Form.Label>
                <Form.Control 
                  type="number" 
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="Masukkan tekanan darah sistolik"
                  required
                  className="form-input"
                />
                <Form.Text className="text-muted">
                  Normal {'<'} 120 mmHg
                </Form.Text>
              </Form.Group>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Form.Group className="mb-3">
                <Form.Label>Kadar Glukosa</Form.Label>
                <Form.Control 
                  type="number" 
                  name="glucoseLevels"
                  value={formData.glucoseLevels}
                  onChange={handleChange}
                  placeholder="Masukkan kadar glukosa puasa"
                  required
                  className="form-input"
                />
                <Form.Text className="text-muted">
                  Normal: 70-100 mg/dL (puasa)
                </Form.Text>
              </Form.Group>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Memproses...
                  </>
                ) : (
                  'Prediksi Sekarang'
                )}
              </Button>
            </motion.div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

export default DiabetesPredictionForm;
