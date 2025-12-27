import React, { useState, useEffect } from 'react';
import { symptomService } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [symptoms, setSymptoms] = useState({
        bloating: 0,
        energy: 0,
        mood: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await symptomService.getLatest();
                if (res.data.success) {
                    setSymptoms(res.data.data);
                }
            } catch (err) {
                console.log('No symptoms tracked yet');
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) return <div className="loading">Loading your dashboard...</div>;

    return (
        <div className="dashboard">
            <div className="banner welcome-banner">
                <h2>Welcome Back!</h2>
                <p>Track your wellness journey and discover personalized fashion recommendations</p>
            </div>

            <div className="grid grid-3 symptom-cards">
                <div className="card symptom-card">
                    <div className="card-header">
                        <span className="icon symptoms-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a246d8" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        </span>
                        <span className="label">Bloating Level</span>
                    </div>
                    <div className="card-value">
                        <span className="number">{symptoms.bloating}/10</span>
                        <span className={`badge ${symptoms.bloating < 4 ? 'badge-low' : 'badge-purple'}`}>
                            {symptoms.bloating < 4 ? 'Low' : symptoms.bloating < 7 ? 'Moderate' : 'High'}
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${symptoms.bloating * 10}%` }}></div>
                    </div>
                    <p className="status-text">{symptoms.bloating < 4 ? 'Feeling great!' : 'Some bloating noticed'}</p>
                </div>

                <div className="card symptom-card">
                    <div className="card-header">
                        <span className="icon energy-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d846b4" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </span>
                        <span className="label">Energy Level</span>
                    </div>
                    <div className="card-value">
                        <span className="number">{symptoms.energy}/10</span>
                        <span className="trend-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${symptoms.energy * 10}%` }}></div>
                    </div>
                    <p className="status-text">{symptoms.energy > 7 ? 'Energized!' : symptoms.energy > 4 ? 'Moderate energy' : 'Feeling tired'}</p>
                </div>

                <div className="card symptom-card">
                    <div className="card-header">
                        <span className="icon mood-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00b894" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                        </span>
                        <span className="label">Today's Mood</span>
                    </div>
                    <div className="card-value">
                        <span className="number">{symptoms.mood}/10</span>
                        <span className="emoji">{symptoms.mood > 7 ? '😊' : symptoms.mood > 4 ? '😐' : '😔'}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${symptoms.mood * 10}%` }}></div>
                    </div>
                    <p className="status-text">{symptoms.mood > 7 ? 'Excellent mood!' : 'Balanced mood'}</p>
                </div>
            </div>

            <div className="grid grid-2 recommendation-cards">
                <div className="card">
                    <h4>Today's Recommendations</h4>
                    <p className="text-muted">Based on your current symptoms</p>
                    <div className="recommendation-item">
                        <div className="rec-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a246d8" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        </div>
                        <div className="rec-content">
                            <h5>Comfort First</h5>
                            <p>{symptoms.bloating > 5 ? 'Try high-waisted bottoms and loose knits' : 'You have flexibility with fitted or relaxed styles today'}</p>
                        </div>
                    </div>
                    <div className="recommendation-item">
                        <div className="rec-icon pink">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d846b4" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </div>
                        <div className="rec-content">
                            <h5>Wellness Tip</h5>
                            <p>{symptoms.energy < 4 ? 'Prioritize rest and gentle yoga' : 'Stay hydrated and consider gentle movement to support your energy levels'}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h4>Body Shape Awareness</h4>
                    <p className="text-muted">Understanding your body today</p>
                    <div className="status-placeholder">
                        {symptoms.bloating === 0 ? (
                            <>
                                <p>No specific changes tracked today</p>
                                <p className="text-muted">Track your symptoms to get personalized fashion recommendations that celebrate your body.</p>
                            </>
                        ) : (
                            <div className="active-changes">
                                <p>Tracking active changes: <strong>{(symptoms.bodyChanges || []).join(', ') || 'No specific body changes reported'}</strong></p>
                                <button className="btn btn-secondary btn-small" style={{ marginTop: '1rem' }}>Update Log</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
