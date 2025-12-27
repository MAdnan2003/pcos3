import React, { useState, useEffect } from 'react';
import { symptomService } from '../../services/api';
import './Symptoms.css';

const Symptoms = () => {
    const [symptoms, setSymptoms] = useState({
        bloating: 3,
        energy: 5,
        mood: 6,
        bodyChanges: []
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await symptomService.getLatest();
                if (res.data.success) {
                    setSymptoms(res.data.data);
                }
            } catch (err) {
                console.log('No existing symptoms for today or error');
            }
        };
        fetchLatest();
    }, []);

    const handleSliderChange = (e) => {
        setSymptoms({ ...symptoms, [e.target.name]: parseInt(e.target.value) });
    };

    const handleCheckboxChange = (change) => {
        const updatedChanges = symptoms.bodyChanges.includes(change)
            ? symptoms.bodyChanges.filter(c => c !== change)
            : [...symptoms.bodyChanges, change];
        setSymptoms({ ...symptoms, bodyChanges: updatedChanges });
    };

    const onSave = async () => {
        try {
            await symptomService.saveSymptoms(symptoms);
            setMessage('Symptoms saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error saving symptoms');
        }
    };

    const onReset = () => {
        setSymptoms({
            bloating: 1,
            energy: 1,
            mood: 1,
            bodyChanges: []
        });
    };

    const bodyChangeOptions = [
        'Abdominal bloating', 'Fluid retention', 'Waist expansion',
        'Chest sensitivity', 'Hip fluctuation', 'Overall puffiness'
    ];

    return (
        <div className="symptoms-page">
            <div className="profile-header">
                <h2>Track Your Symptoms</h2>
                <p className="text-muted">Monitor your daily symptoms to receive personalized fashion and wellness recommendations</p>
            </div>

            <div className="symptom-form">
                <div className="card slider-card">
                    <div className="slider-header">
                        <span className="icon purple">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        </span>
                        <div>
                            <h3>Bloating Level</h3>
                            <p className="text-muted">How bloated do you feel today? (1 = minimal, 10 = severe)</p>
                        </div>
                    </div>
                    <div className="slider-container">
                        <div className="slider-labels">
                            <span>Minimal</span>
                            <span className="slider-value">{symptoms.bloating}</span>
                            <span>Severe</span>
                        </div>
                        <input
                            type="range" name="bloating" min="1" max="10"
                            value={symptoms.bloating} onChange={handleSliderChange}
                            className="custom-range"
                        />
                    </div>
                </div>

                <div className="card slider-card">
                    <div className="slider-header">
                        <span className="icon pink">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </span>
                        <div>
                            <h3>Energy Level</h3>
                            <p className="text-muted">How energetic do you feel? (1 = exhausted, 10 = very energetic)</p>
                        </div>
                    </div>
                    <div className="slider-container">
                        <div className="slider-labels">
                            <span>Exhausted</span>
                            <span className="slider-value">{symptoms.energy}</span>
                            <span>Energetic</span>
                        </div>
                        <input
                            type="range" name="energy" min="1" max="10"
                            value={symptoms.energy} onChange={handleSliderChange}
                            className="custom-range"
                        />
                    </div>
                </div>

                <div className="card slider-card">
                    <div className="slider-header">
                        <span className="icon mood-icon-blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0984e3" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                        </span>
                        <div>
                            <h3>Mood Level</h3>
                            <p className="text-muted">How is your mood today? (1 = low, 10 = excellent)</p>
                        </div>
                    </div>
                    <div className="slider-container">
                        <div className="slider-labels">
                            <span>Low</span>
                            <span className="slider-value">{symptoms.mood}</span>
                            <span>Excellent</span>
                        </div>
                        <input
                            type="range" name="mood" min="1" max="10"
                            value={symptoms.mood} onChange={handleSliderChange}
                            className="custom-range"
                        />
                    </div>
                </div>

                <div className="card body-changes-card">
                    <h3>Body Shape Changes</h3>
                    <p className="text-muted">Select any body changes you're experiencing today</p>
                    <div className="checkbox-grid">
                        {bodyChangeOptions.map(option => (
                            <label key={option} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={symptoms.bodyChanges.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {message && <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}

                <div className="profile-actions">
                    <button className="btn btn-secondary" onClick={onReset}>Reset</button>
                    <button className="btn btn-primary" onClick={onSave}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        Save Symptoms
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Symptoms;
