import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function AWSIntegrationInfo() {
  return (
    <Card>
      <Card.Header>Integrasi AWS Services</Card.Header>
      <Card.Body>
        <Card.Title>Layanan AWS yang Digunakan</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Amazon SageMaker</strong>
            <p>Membangun, melatih, dan menerapkan model machine learning untuk prediksi diabetes</p>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Amazon QuickSight</strong>
            <p>Visualisasi dan analisis data kesehatan</p>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Amazon S3</strong>
            <p>Penyimpanan dan manajemen dataset</p>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Amazon EC2 (Opsional)</strong>
            <p>Komputasi tambahan untuk pemrosesan data</p>
          </ListGroup.Item>
        </ListGroup>

        <Card.Title className="mt-3">Tujuan Proyek</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>1. Meningkatkan Akurasi Diagnosis Dini</strong>
            <p>Menggunakan machine learning untuk prediksi risiko diabetes</p>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>2. Efisiensi Proses Analisis</strong>
            <p>Memanfaatkan teknologi cloud untuk analisis cepat</p>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>3. Pengambilan Keputusan Berbasis Data</strong>
            <p>Memberikan wawasan akurat untuk keputusan kesehatan</p>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default AWSIntegrationInfo;
