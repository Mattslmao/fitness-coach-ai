import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { Camera, Upload, TrendingDown, TrendingUp } from 'lucide-react';
import './CheckIn.css';

const CheckIn = () => {
  const { user, isPremium } = useAuth();
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    photos: {
      front: null,
      side: null,
      back: null
    },
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    questions: {
      trainingDays: 0,
      missedMeals: 0,
      mentalEnergy: 5,
      physicalEnergy: 5,
      sleepQuality: 5,
      stressLevel: 5,
      notes: '',
      challenges: ''
    }
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = async (position, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('position', position);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/checkins/upload-photo`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [position]: res.data.url
        }
      }));

      toast.success('Photo uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading photo');
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/checkins`,
        formData
      );

      if (isPremium()) {
        // Get AI analysis for premium users
        const analysisRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/ai/analyze-checkin`,
          { checkInId: res.data._id }
        );
        
        setAiAnalysis(analysisRes.data);
      }

      setShowConfetti(true);
      toast.success('Check-in completed! 🎉');
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

    } catch (error) {
      toast.error('Error submitting check-in');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="checkin-step">
            <h2>📸 Progress Photos</h2>
            <p className="step-description">
              Take progress photos in a fasted state for accurate tracking
            </p>

            <div className="photo-grid">
              {['front', 'side', 'back'].map(position => (
                <div key={position} className="photo-upload">
                  <div className="photo-preview">
                    {formData.photos[position] ? (
                      <img src={formData.photos[position]} alt={position} />
                    ) : (
                      <Camera size={48} />
                    )}
                  </div>
                  <label className="upload-btn">
                    <Upload size={18} />
                    Upload {position} photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(position, e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="checkin-step">
            <h2>⚖️ Weight & Measurements</h2>
            
            <div className="input-group">
              <label>Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="Enter your weight"
              />
            </div>

            <h3>Body Measurements (optional)</h3>
            <div className="measurements-grid">
              {Object.keys(formData.measurements).map(measurement => (
                <div key={measurement} className="input-group">
                  <label>{measurement.charAt(0).toUpperCase() + measurement.slice(1)} (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.measurements[measurement]}
                    onChange={(e) => handleInputChange('measurements', measurement, e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>

            <div className="step-buttons">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-primary" onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="checkin-step">
            <h2>📊 Weekly Review</h2>
            
            <div className="question-group">
              <label>How many days did you train this week?</label>
              <div className="number-selector">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                  <button
                    key={num}
                    className={`number-btn ${formData.questions.trainingDays === num ? 'active' : ''}`}
                    onClick={() => handleInputChange('questions', 'trainingDays', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="question-group">
              <label>How many meals did you miss?</label>
              <div className="number-selector">
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    className={`number-btn ${formData.questions.missedMeals === num ? 'active' : ''}`}
                    onClick={() => handleInputChange('questions', 'missedMeals', num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="question-group">
              <label>Mental Energy: {formData.questions.mentalEnergy}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.questions.mentalEnergy}
                onChange={(e) => handleInputChange('questions', 'mentalEnergy', parseInt(e.target.value))}
                className="slider"
              />
            </div>

            <div className="question-group">
              <label>Physical Energy: {formData.questions.physicalEnergy}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.questions.physicalEnergy}
                onChange={(e) => handleInputChange('questions', 'physicalEnergy', parseInt(e.target.value))}
                className="slider"
              />
            </div>

            <div className="question-group">
              <label>Sleep Quality: {formData.questions.sleepQuality}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.questions.sleepQuality}
                onChange={(e) => handleInputChange('questions', 'sleepQuality', parseInt(e.target.value))}
                className="slider"
              />
            </div>

            <div className="question-group">
              <label>Stress Level: {formData.questions.stressLevel}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.questions.stressLevel}
                onChange={(e) => handleInputChange('questions', 'stressLevel', parseInt(e.target.value))}
                className="slider"
              />
            </div>

            <div className="step-buttons">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn-primary" onClick={() => setStep(4)}>
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="checkin-step">
            <h2>💭 Reflections</h2>
            
            <div className="input-group">
              <label>How are you feeling this week?</label>
              <textarea
                value={formData.questions.notes}
                onChange={(e) => handleInputChange('questions', 'notes', e.target.value)}
                placeholder="Share your thoughts, wins, or concerns..."
                rows="4"
              />
            </div>

            <div className="input-group">
              <label>Any challenges you faced?</label>
              <textarea
                value={formData.questions.challenges}
                onChange={(e) => handleInputChange('questions', 'challenges', e.target.value)}
                placeholder="What obstacles did you encounter?"
                rows="4"
              />
            </div>

            <div className="step-buttons">
              <button className="btn-secondary" onClick={() => setStep(3)}>
                Back
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Complete Check-in'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (aiAnalysis) {
    return (
      <div className="checkin-results">
        {showConfetti && <Confetti />}
        
        <div className="results-header">
          <h1>✨ Check-in Complete!</h1>
          <p>Here's your personalized feedback</p>
        </div>

        <div className="analysis-card">
          <h2>📈 Progress Summary</h2>
          <p>{aiAnalysis.summary}</p>
        </div>

        {aiAnalysis.calorieAdjustment !== 0 && (
          <div className="adjustment-card">
            <h3>🔄 Calorie Adjustment</h3>
            <div className="adjustment-value">
              {aiAnalysis.calorieAdjustment > 0 ? (
                <>
                  <TrendingUp size={24} className="trend-up" />
                  <span>+{aiAnalysis.calorieAdjustment} calories</span>
                </>
              ) : (
                <>
                  <TrendingDown size={24} className="trend-down" />
                  <span>{aiAnalysis.calorieAdjustment} calories</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="recommendations-card">
          <h3>💡 Recommendations</h3>
          <p>{aiAnalysis.trainingAdjustment}</p>
        </div>

        <div className="motivation-card">
          <h3>💪 Motivation</h3>
          <p>{aiAnalysis.motivationalMessage}</p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => window.location.href = '/'}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="checkin-page">
      <div className="checkin-container">
        <div className="progress-bar">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className={`progress-step ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
            >
              {num}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default CheckIn;