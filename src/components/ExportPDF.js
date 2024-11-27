import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const ExportPDF = ({ result }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Laporan Kesehatan',
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
    `,
  });

  if (!result) return null;

  const formatDate = () => {
    return new Date(result.date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Tinggi':
        return '#ffebee';
      case 'Sedang':
        return '#fff3e0';
      default:
        return '#e8f5e9';
    }
  };

  const getRecommendations = (risk) => {
    switch (risk) {
      case 'Tinggi':
        return [
          'Segera konsultasi dengan dokter untuk pemeriksaan lebih lanjut',
          'Pantau kadar gula darah secara rutin',
          'Kurangi konsumsi makanan tinggi gula dan karbohidrat',
          'Lakukan olahraga teratur minimal 30 menit per hari',
          'Pertahankan berat badan ideal',
          'Hindari stres berlebihan'
        ];
      case 'Sedang':
        return [
          'Pertimbangkan untuk melakukan pemeriksaan kesehatan rutin',
          'Jaga pola makan sehat dan seimbang',
          'Tingkatkan aktivitas fisik',
          'Hindari makanan tinggi gula',
          'Pertahankan berat badan ideal',
          'Kelola stres dengan baik'
        ];
      default:
        return [
          'Pertahankan pola hidup sehat',
          'Lakukan pemeriksaan kesehatan rutin',
          'Jaga berat badan ideal',
          'Tetap aktif secara fisik',
          'Konsumsi makanan sehat dan bergizi',
          'Istirahat yang cukup'
        ];
    }
  };

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handlePrint}
        className="export-button d-flex align-items-center gap-2"
        size="sm"
      >
        <FaFilePdf /> Export PDF
      </Button>

      <div style={{ display: 'none' }}>
        <div ref={componentRef} style={{ padding: '20mm', background: '#fff' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Laporan Kesehatan</h2>
            <p style={{ color: '#666' }}>{formatDate()}</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#3498db', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Data Pribadi
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd', width: '40%', backgroundColor: '#f8f9fa' }}>Umur</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.age} tahun</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>BMI</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {result.bmi.toFixed(1)} kg/m² ({result.bmiCategory})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#3498db', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Data Kesehatan
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd', width: '40%', backgroundColor: '#f8f9fa' }}>Tekanan Darah</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.bloodPressure} mmHg</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>Kadar Glukosa</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.glucose} mg/dL</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>Riwayat Diabetes Keluarga</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.diabetesHistory ? 'Ya' : 'Tidak'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#3498db', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Hasil Prediksi
            </h4>
            <div style={{ 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: getRiskColor(result.risk),
              marginBottom: '1rem'
            }}>
              <p style={{ margin: '0', fontSize: '16px', color: '#2c3e50' }}>
                Tingkat Risiko Diabetes: <strong>{result.risk}</strong>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#3498db', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Rekomendasi
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#2c3e50' }}>
              {getRecommendations(result.risk).map((rec, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>{rec}</li>
              ))}
            </ul>
          </div>

          <div style={{ 
            marginTop: '2rem',
            borderTop: '1px solid #ddd',
            paddingTop: '1rem',
          }}>
            <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
              <strong>Disclaimer:</strong> Hasil prediksi ini hanya sebagai referensi dan tidak menggantikan diagnosis medis profesional.
              Selalu konsultasikan dengan tenaga medis untuk penanganan lebih lanjut.
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
              Laporan dibuat pada: {new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportPDF;
