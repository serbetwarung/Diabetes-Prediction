import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Tab, Tabs, Form, Spinner, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoon, FaSun, FaTrash, FaDownload, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PredictionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    bloodPressure: '',
    glucose: '',
    diabetesHistory: false
  });

  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Calculate BMI when weight or height changes
    if (name === 'weight' || name === 'height') {
      if (formData.weight && formData.height) {
        const calculatedBMI = calculateBMI(
          name === 'weight' ? value : formData.weight,
          name === 'height' ? value : formData.height
        );
        setBmi(calculatedBMI);
        setBmiCategory(getBMICategory(calculatedBMI));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.age || !formData.height || !formData.weight || 
        !formData.bloodPressure || !formData.glucose) {
      toast.error('Semua field harus diisi');
      return;
    }

    // Validate blood pressure format
    const bpPattern = /^\d{2,3}\/\d{2,3}$/;
    if (!bpPattern.test(formData.bloodPressure)) {
      toast.error('Format tekanan darah tidak valid. Gunakan format: 120/80');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Umur (tahun)</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Masukkan umur"
              min="0"
              max="120"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tinggi Badan (cm)</Form.Label>
            <Form.Control
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Masukkan tinggi badan"
              min="0"
              max="300"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Berat Badan (kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Masukkan berat badan"
              min="0"
              max="500"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tekanan Darah (mmHg)</Form.Label>
            <Form.Control
              type="text"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              placeholder="Contoh: 120/80"
            />
            <Form.Text className="text-muted">
              Format: Sistol/Diastol (contoh: 120/80)
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Kadar Glukosa (mg/dL)</Form.Label>
            <Form.Control
              type="number"
              name="glucose"
              value={formData.glucose}
              onChange={handleChange}
              placeholder="Masukkan kadar glukosa"
              min="0"
              max="1000"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Riwayat Diabetes Keluarga</Form.Label>
            <div>
              <Form.Check
                type="checkbox"
                name="diabetesHistory"
                checked={formData.diabetesHistory}
                onChange={handleChange}
                label="Ya, ada riwayat diabetes dalam keluarga"
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {bmi && (
            <Card className="mb-3 bmi-card">
              <Card.Body>
                <h4>Hasil Perhitungan BMI</h4>
                <p className="mb-2">BMI Anda: <strong>{bmi.toFixed(1)}</strong></p>
                <p>Kategori: <strong>{bmiCategory}</strong></p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Memproses...
            </>
          ) : (
            'Prediksi Sekarang'
          )}
        </Button>
      </div>
    </Form>
  );
};

// Utility functions
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Kurus';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Gemuk';
  return 'Obesitas';
};

const calculateRiskLevel = (data, bmi) => {
  let points = 0;

  // Faktor umur
  if (data.age > 45) points += 2;
  else if (data.age > 35) points += 1;

  // Faktor BMI
  if (bmi >= 30) points += 2;
  else if (bmi >= 25) points += 1;

  // Faktor tekanan darah
  const [systolic = 0] = data.bloodPressure.split('/');
  if (parseInt(systolic) >= 140) points += 2;
  else if (parseInt(systolic) >= 130) points += 1;

  // Faktor glukosa
  if (data.glucose >= 126) points += 2;
  else if (data.glucose >= 100) points += 1;

  // Faktor riwayat keluarga
  if (data.diabetesHistory) points += 2;

  // Menentukan tingkat risiko
  if (points >= 6) return 'Tinggi';
  if (points >= 3) return 'Sedang';
  return 'Rendah';
};

const generateRecommendations = (riskLevel, bmi, data) => {
  const recommendations = [];

  // Rekomendasi berdasarkan BMI
  if (bmi < 18.5) {
    recommendations.push('Tingkatkan asupan kalori dengan makanan bergizi seimbang');
    recommendations.push('Konsumsi protein yang cukup untuk membangun massa otot');
  } else if (bmi >= 25) {
    recommendations.push('Kurangi asupan kalori dan hindari makanan tinggi gula');
    recommendations.push('Lakukan aktivitas fisik secara teratur minimal 30 menit per hari');
  }

  // Rekomendasi berdasarkan tekanan darah
  const [systolic = 0] = data.bloodPressure.split('/');
  if (parseInt(systolic) >= 130) {
    recommendations.push('Kurangi konsumsi garam dan makanan yang tinggi sodium');
    recommendations.push('Kelola stres dengan baik dan istirahat yang cukup');
  }

  // Rekomendasi berdasarkan glukosa
  if (data.glucose >= 100) {
    recommendations.push('Batasi konsumsi karbohidrat sederhana dan gula');
    recommendations.push('Pilih makanan dengan indeks glikemik rendah');
  }

  // Rekomendasi umum berdasarkan tingkat risiko
  if (riskLevel === 'Tinggi') {
    recommendations.push('Segera konsultasi dengan dokter untuk pemeriksaan lebih lanjut');
    recommendations.push('Lakukan pemeriksaan gula darah secara rutin');
  } else if (riskLevel === 'Sedang') {
    recommendations.push('Pertimbangkan untuk melakukan pemeriksaan kesehatan rutin');
    recommendations.push('Terapkan pola hidup sehat dengan diet seimbang dan olahraga teratur');
  } else {
    recommendations.push('Pertahankan pola hidup sehat yang sudah dijalankan');
    recommendations.push('Lakukan pemeriksaan kesehatan secara berkala');
  }

  return recommendations;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('input');
  const [printRef, setPrintRef] = useState(null);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Hasil Prediksi Diabetes',
    onAfterPrint: () => toast.success('PDF berhasil diunduh!'),
  });

  useEffect(() => {
    setFilteredHistory(
      predictionHistory.filter(item => 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, predictionHistory]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      document.body.classList.add('dark-mode');
      root.style.setProperty('--bg-color', '#1a1a1a');
      root.style.setProperty('--text-color', '#ffffff');
    } else {
      document.body.classList.remove('dark-mode');
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#2c3034');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('predictionHistory');
    if (savedHistory) {
      setPredictionHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
  }, [predictionHistory]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handlePredict = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bmi = calculateBMI(formData.weight, formData.height);
      const riskLevel = calculateRiskLevel(formData, bmi);
      const recommendations = generateRecommendations(riskLevel, bmi, formData);
      
      const result = {
        ...formData,
        bmi,
        riskLevel,
        recommendations,
        date: new Date().toLocaleString()
      };
      
      setPredictionResult(result);
      setPredictionHistory(prev => [result, ...prev]);
      setActiveTab('result');
      toast.success('Prediksi berhasil!');
    } catch (error) {
      toast.error('Terjadi kesalahan saat melakukan prediksi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = () => {
    if (selectedItems.length > 0) {
      setShowDeleteConfirm(true);
    } else {
      toast.error('Pilih item yang akan dihapus terlebih dahulu');
    }
  };

  const confirmDelete = () => {
    if (selectedItems.length === 0) {
      setPredictionHistory([]);
      localStorage.removeItem('predictionHistory');
    } else {
      const newHistory = predictionHistory.filter(
        item => !selectedItems.includes(item.date)
      );
      setPredictionHistory(newHistory);
      setSelectedItems([]);
      setSelectionMode(false);
    }
    setShowDeleteConfirm(false);
    toast.success('Riwayat berhasil dihapus');
  };

  const toggleItemSelection = (date) => {
    setSelectedItems(prev => {
      if (prev.includes(date)) {
        return prev.filter(item => item !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      setSelectedItems([]);
    }
  };

  const chartData = {
    labels: predictionHistory.map(item => item.date).reverse(),
    datasets: [
      {
        label: 'BMI',
        data: predictionHistory.map(item => item.bmi).reverse(),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Grafik BMI'
      }
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Container className="py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="app-title mb-0 w-100 text-center">Prediksi Risiko Diabetes</h1>
                <motion.button
                  className={`theme-toggle-btn ${darkMode ? 'dark' : 'light'}`}
                  onClick={toggleDarkMode}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={darkMode ? 'dark' : 'light'}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {darkMode ? (
                        <div className="d-flex align-items-center">
                          <FaSun className="mode-icon" />
                          <span className="ms-2">Mode Terang</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <FaMoon className="mode-icon" />
                          <span className="ms-2">Mode Gelap</span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="input" title="Input Data">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Row>
                      <Col md={6}>
                        <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
                        {isLoading && (
                          <div className="text-center my-4">
                            <Spinner animation="border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <div className="history-section-right">
                          <div className="history-controls mb-4">
                            <div className="search-box">
                              <FaSearch className="search-icon" />
                              <Form.Control
                                type="text"
                                placeholder="Cari riwayat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            <div className="button-group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={toggleSelectionMode}
                                className="me-2"
                              >
                                {selectionMode ? 'Batal Pilih' : 'Pilih'}
                              </Button>
                              <CSVLink
                                data={predictionHistory}
                                filename={"riwayat-prediksi.csv"}
                                className="btn btn-success btn-sm me-2"
                              >
                                <FaDownload /> Export
                              </CSVLink>
                              <Button 
                                variant="danger"
                                size="sm"
                                onClick={handleDeleteHistory}
                                disabled={predictionHistory.length === 0}
                              >
                                <FaTrash /> {selectionMode ? `Hapus (${selectedItems.length})` : 'Hapus Semua'}
                              </Button>
                            </div>
                          </div>

                          {predictionHistory.length > 0 ? (
                            <div className="history-section">
                              {filteredHistory.map((item, index) => (
                                <motion.div
                                  key={item.date}
                                  className="history-card"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="history-card-content">
                                    {selectionMode && (
                                      <Form.Check
                                        type="checkbox"
                                        className="mb-2"
                                        checked={selectedItems.includes(item.date)}
                                        onChange={() => toggleItemSelection(item.date)}
                                      />
                                    )}
                                    <div className="history-item">
                                      <span className="history-label">Tanggal</span>
                                      <span className="history-value">
                                        {new Date(item.date).toLocaleDateString('id-ID')}
                                      </span>
                                    </div>
                                    <div className="history-item">
                                      <span className="history-label">BMI</span>
                                      <span className="history-value">{item.bmi.toFixed(1)}</span>
                                    </div>
                                    <div className="history-item">
                                      <span className="history-label">Risiko</span>
                                      <span className="history-value">{item.riskLevel}</span>
                                    </div>
                                    <Button 
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => {
                                        setPredictionResult(item);
                                        setActiveTab('result');
                                      }}
                                      className="mt-2"
                                    >
                                      Lihat Detail
                                    </Button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <p className="text-muted">Belum ada riwayat prediksi</p>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </motion.div>
                </Tab>

                <Tab eventKey="result" title="Hasil Prediksi">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {predictionResult && (
                      <div className="result-section">
                        <motion.h3 
                          className="result-title text-center mb-4"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Hasil Analisis Risiko Diabetes
                        </motion.h3>
                        <Row>
                          <Col md={6}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Card className="result-card bmi-card mb-4">
                                <Card.Body>
                                  <div className="result-icon">
                                    <i className="fas fa-weight"></i>
                                  </div>
                                  <h5 className="text-center">Indeks Massa Tubuh (BMI)</h5>
                                  <div className="bmi-value">
                                    {predictionResult.bmi.toFixed(1)}
                                  </div>
                                  <div className="bmi-category">
                                    {getBMICategory(predictionResult.bmi)}
                                  </div>
                                  <div className="bmi-scale">
                                    <div className="scale-marker" style={{
                                      left: `${Math.min(Math.max((predictionResult.bmi - 16) * 5, 0), 100)}%`
                                    }}></div>
                                    <div className="scale-labels">
                                      <span>16</span>
                                      <span>25</span>
                                      <span>36</span>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </motion.div>
                          </Col>
                          <Col md={6}>
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <Card className={`result-card risk-card mb-4 risk-${predictionResult.riskLevel.toLowerCase()}`}>
                                <Card.Body>
                                  <div className="result-icon">
                                    <i className="fas fa-chart-line"></i>
                                  </div>
                                  <h5 className="text-center">Tingkat Risiko Diabetes</h5>
                                  <div className="risk-value">
                                    {predictionResult.riskLevel}
                                  </div>
                                  <div className="risk-indicator">
                                    <div className="indicator-bar">
                                      <div className="indicator-fill" style={{
                                        width: predictionResult.riskLevel === 'Tinggi' ? '100%' :
                                              predictionResult.riskLevel === 'Sedang' ? '66%' : '33%'
                                      }}></div>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </motion.div>
                          </Col>
                        </Row>
                        <motion.div
                          className="recommendations-section"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Card className="recommendation-card">
                            <Card.Body>
                              <div className="result-icon">
                                <i className="fas fa-clipboard-list"></i>
                              </div>
                              <h5 className="text-center">Rekomendasi Kesehatan</h5>
                              <ul className="recommendations-list">
                                {predictionResult.recommendations.map((rec, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (index * 0.1) }}
                                  >
                                    {rec}
                                  </motion.li>
                                ))}
                              </ul>
                            </Card.Body>
                          </Card>
                        </motion.div>
                        <motion.div
                          className="text-center mt-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button 
                            variant="success" 
                            onClick={handlePrint} 
                            className="export-btn no-print"
                          >
                            <i className="fas fa-file-pdf me-2"></i>
                            Ekspor ke PDF
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItems.length > 0 
            ? `Apakah Anda yakin ingin menghapus ${selectedItems.length} item yang dipilih?`
            : 'Apakah Anda yakin ingin menghapus semua riwayat prediksi?'
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>

      {printRef && (
        <div ref={componentRef}>
          <h2>Hasil Prediksi Diabetes</h2>
          <p>Tanggal: {printRef.date}</p>
          <p>BMI: {printRef.bmi.toFixed(1)}</p>
          <p>Risiko: {printRef.riskLevel}</p>
          <h3>Rekomendasi:</h3>
          <ul>
            {printRef.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
