import { predictDiabetes } from '../services/predictionService';

describe('Diabetes Prediction Service', () => {
  test('should return low risk for young, healthy individual', async () => {
    const testData = {
      age: 25,
      bmi: 22,
      bloodPressure: 120,
      glucoseLevels: 90
    };

    const result = await predictDiabetes(testData);
    expect(result.riskLevel).toBe('Rendah');
    expect(result.riskPercentage).toBe(10);
  });

  test('should return high risk for older individual with multiple risk factors', async () => {
    const testData = {
      age: 55,
      bmi: 35,
      bloodPressure: 160,
      glucoseLevels: 140
    };

    const result = await predictDiabetes(testData);
    expect(result.riskLevel).toBe('Sangat Tinggi');
    expect(result.riskPercentage).toBe(90);
  });

  test('should handle missing data', async () => {
    await expect(predictDiabetes({})).rejects.toThrow();
  });
});
