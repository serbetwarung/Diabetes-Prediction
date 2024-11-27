import AWS from 'aws-sdk';

// Konfigurasi AWS dari environment variables
// Untuk localhost, gunakan kredensial dummy
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION || 'us-west-2',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || 'local_development',
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || 'local_development'
});

// Konfigurasi SageMaker Runtime (simulasi)
export const sagemakerRuntime = new AWS.SageMakerRuntime({
  apiVersion: '2017-07-24'
});

// Fungsi untuk melakukan prediksi menggunakan endpoint SageMaker
export const invokeSageMakerEndpoint = async (inputData) => {
  try {
    // Untuk localhost, gunakan service prediksi lokal
    const { predictDiabetes } = await import('../services/predictionService');
    return await predictDiabetes(inputData);
  } catch (error) {
    console.error('Error invoking local prediction:', error);
    throw error;
  }
};

// Eksport konfigurasi untuk digunakan di komponen lain
export default AWS;
