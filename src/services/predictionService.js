// Simulasi service prediksi
export const predictDiabetes = async (data) => {
  // Validasi input
  if (!data.age || !data.bmi || !data.bloodPressure || !data.glucoseLevels) {
    throw new Error('Semua field harus diisi');
  }

  // Logika prediksi sederhana
  const riskFactors = [
    data.age > 45 ? 1 : 0,
    data.bmi > 30 ? 1 : 0,
    data.bloodPressure > 140 ? 1 : 0,
    data.glucoseLevels > 125 ? 1 : 0
  ];

  const riskScore = riskFactors.reduce((a, b) => a + b, 0);
  
  let riskLevel, riskPercentage;
  
  switch(riskScore) {
    case 0:
      riskLevel = 'Rendah';
      riskPercentage = 10;
      break;
    case 1:
      riskLevel = 'Sedang';
      riskPercentage = 30;
      break;
    case 2:
      riskLevel = 'Tinggi';
      riskPercentage = 60;
      break;
    default:
      riskLevel = 'Sangat Tinggi';
      riskPercentage = 90;
  }

  return {
    riskLevel,
    riskPercentage,
    details: {
      age: data.age,
      bmi: data.bmi,
      bloodPressure: data.bloodPressure,
      glucoseLevels: data.glucoseLevels
    }
  };
};
