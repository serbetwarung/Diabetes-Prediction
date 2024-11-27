import React from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function HealthTrends({ history, className }) {
  const processDataForChart = (data) => {
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      glukosa: Number(item.glucoseLevels),
      bmi: Number(item.bmi),
      tekananDarah: Number(item.bloodPressure)
    }));
  };

  return (
    <motion.div
      className={`health-trends ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4">Tren Kesehatan</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processDataForChart(history)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="glukosa"
                  name="Glukosa (mg/dL)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tekananDarah"
                  name="Tekanan Darah (mmHg)"
                  stroke="#82ca9d"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bmi"
                  name="BMI"
                  stroke="#ffc658"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

export default HealthTrends;
