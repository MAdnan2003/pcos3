import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { symptomService, fashionService } from '../../services/api';
import './FashionDashboard.css';

const FashionDashboard = () => {
    const [activeTab, setActiveTab] = useState('Fabric Guide');
    const [latestSymptoms, setLatestSymptoms] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weeklyOutfits, setWeeklyOutfits] = useState([]);
    const navigate = useNavigate();

    const tabs = ['Fabric Guide', 'Color Psychology'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const symptomRes = await symptomService.getLatest();
                if (symptomRes.data.success) {
                    setLatestSymptoms(symptomRes.data.data);
                }

                const fashionRes = await fashionService.getRecommendations();
                if (fashionRes.data.success) {
                    setRecommendations(fashionRes.data.data);
                }
            } catch (err) {
                console.log('Error fetching fashion data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (recommendations && recommendations.bodyShape) {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const occasions = ['Work/Professional', 'Casual Day', 'Active/Wellness', 'Evening Out', 'Relaxed', 'Weekend Brunch', 'Comfort Day'];

            const weekly = days.map((day, idx) => {
                const occasion = occasions[idx];
                let outfit = {};

                const outfitsByShape = {
                    Hourglass: {
                        Monday: { top: 'Wrap blouse', bottom: 'High-waisted trousers', layer: 'Tailored blazer' },
                        Tuesday: { top: 'V-neck tee', bottom: 'Skinny jeans', layer: 'Cardigan' },
                        Wednesday: { top: 'Fitted tank', bottom: 'Yoga pants', layer: 'Zip-up hoodie' },
                        Thursday: { top: 'Belted dress', bottom: 'N/A', layer: 'Light jacket' },
                        Friday: { top: 'Casual tee', bottom: 'High-waisted shorts', layer: 'Denim jacket' },
                        Saturday: { top: 'Flowy blouse', bottom: 'Midi skirt', layer: 'Statement belt' },
                        Sunday: { top: 'Soft sweater', bottom: 'Leggings', layer: 'Cozy scarf' }
                    },
                    Pear: {
                        Monday: { top: 'Boat neck blouse', bottom: 'Dark trousers', layer: 'Structured blazer' },
                        Tuesday: { top: 'Statement sleeve top', bottom: 'Straight jeans', layer: 'Light cardigan' },
                        Wednesday: { top: 'Bright sports bra', bottom: 'Black leggings', layer: 'Oversized tee' },
                        Thursday: { top: 'Off-shoulder dress', bottom: 'N/A', layer: 'Clutch' },
                        Friday: { top: 'Ruffled top', bottom: 'A-line skirt', layer: 'Denim jacket' },
                        Saturday: { top: 'Embellished blouse', bottom: 'Flowy pants', layer: 'Statement necklace' },
                        Sunday: { top: 'Cozy sweater', bottom: 'Joggers', layer: 'Soft blanket scarf' }
                    },
                    Apple: {
                        Monday: { top: 'Empire waist blouse', bottom: 'Bootcut pants', layer: 'Long cardigan' },
                        Tuesday: { top: 'V-neck tunic', bottom: 'Straight jeans', layer: 'Scarf' },
                        Wednesday: { top: 'Flowy tank', bottom: 'Capri leggings', layer: 'Zip jacket' },
                        Thursday: { top: 'Wrap dress', bottom: 'N/A', layer: 'Statement earrings' },
                        Friday: { top: 'Tunic top', bottom: 'Wide-leg jeans', layer: 'Kimono' },
                        Saturday: { top: 'Empire dress', bottom: 'N/A', layer: 'Light shawl' },
                        Sunday: { top: 'Oversized sweater', bottom: 'Palazzo pants', layer: 'Cozy socks' }
                    },
                    Rectangle: {
                        Monday: { top: 'Peplum blouse', bottom: 'Pencil skirt', layer: 'Belted blazer' },
                        Tuesday: { top: 'Ruffled top', bottom: 'Skinny jeans', layer: 'Belt' },
                        Wednesday: { top: 'Crop top', bottom: 'High-waist leggings', layer: 'Sports jacket' },
                        Thursday: { top: 'Tiered dress', bottom: 'N/A', layer: 'Statement belt' },
                        Friday: { top: 'Layered tee', bottom: 'Flared jeans', layer: 'Vest' },
                        Saturday: { top: 'Belted tunic', bottom: 'Pleated skirt', layer: 'Cardigan' },
                        Sunday: { top: 'Chunky sweater', bottom: 'Leggings', layer: 'Wide belt' }
                    },
                    'Inverted Triangle': {
                        Monday: { top: 'Simple blouse', bottom: 'Wide-leg trousers', layer: 'Minimal blazer' },
                        Tuesday: { top: 'Scoop neck tee', bottom: 'Flared jeans', layer: 'Light cardigan' },
                        Wednesday: { top: 'Thin strap tank', bottom: 'Patterned leggings', layer: 'Hoodie' },
                        Thursday: { top: 'V-neck dress', bottom: 'N/A', layer: 'Statement shoes' },
                        Friday: { top: 'Basic tee', bottom: 'Printed pants', layer: 'Denim jacket' },
                        Saturday: { top: 'Simple cami', bottom: 'Full skirt', layer: 'Light jacket' },
                        Sunday: { top: 'Soft sweater', bottom: 'Wide-leg joggers', layer: 'Cozy blanket' }
                    },
                    Default: {
                        Monday: { top: 'Classic blouse', bottom: 'Tailored pants', layer: 'Blazer' },
                        Tuesday: { top: 'Casual tee', bottom: 'Jeans', layer: 'Cardigan' },
                        Wednesday: { top: 'Athletic top', bottom: 'Leggings', layer: 'Jacket' },
                        Thursday: { top: 'Dress', bottom: 'N/A', layer: 'Accessories' },
                        Friday: { top: 'Relaxed top', bottom: 'Casual pants', layer: 'Light layer' },
                        Saturday: { top: 'Weekend top', bottom: 'Skirt', layer: 'Jacket' },
                        Sunday: { top: 'Comfort top', bottom: 'Lounge pants', layer: 'Cozy layer' }
                    }
                };

                const shape = recommendations.bodyShape;
                const outfitPlan = outfitsByShape[shape] || outfitsByShape.Default;

                return {
                    day,
                    occasion,
                    ...outfitPlan[day]
                };
            });

            setWeeklyOutfits(weekly);
        }
    }, [recommendations]);

    const fabricContent = [
        { title: 'Cotton Blends', subtitle: 'Breathable and comfortable', icon: <div className="circle" />, color: 'lightpurple' },
        { title: 'Jersey Knit', subtitle: 'Stretchy and forgiving', icon: <div className="circle" />, color: 'lightpink' },
        { title: 'Modal/Bamboo', subtitle: 'Soft and moisture-wicking', icon: <div className="circle" />, color: 'lightpink' }
    ];

    const colorContent = [
        { title: 'Soft Pastels', subtitle: 'Calming and gentle', icon: <div style={{ background: '#ffdeeb' }} className="circle" /> },
        { title: 'Deep Earth Tones', subtitle: 'Grounding and solid', icon: <div style={{ background: '#815b5b' }} className="circle" /> }
    ];

    const getDynamicRec = () => {
        if (recommendations?.recommendations?.length > 0) {
            const generalRec = recommendations.recommendations.find(r => r.category === 'General') || recommendations.recommendations[0];
            return `${generalRec.tips.join('. ')}. Try: ${generalRec.items.join(', ')}.`;
        }

        if (!latestSymptoms) return "Explore our general style guides below.";
        if (latestSymptoms.bloating > 5) return "We recommend stretchy Jersey Knits and high-waisted bottoms for extra comfort today.";
        if (latestSymptoms.energy < 4) return "Opt for soft, breathable cotton blends and relaxed silhouettes to support your energy.";
        return "You have flexibility with fitted or relaxed styles today!";
    };

    return (
        <div className="fashion-dashboard container mx-auto px-4 py-6">
            <div className="banner fashion-banner">
                <div className="banner-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.62 1.97V21a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5.43a2 2 0 0 0-1.62-1.97z"></path><path d="M12 22V11"></path><path d="m8 6 4-4 4 4"></path></svg>
                </div>
                <div className="banner-text">
                    <h2>Fashion Recommendations</h2>
                    <p>Personalized style suggestions based on your current symptoms</p>
                    <button className="badge badge-purple btn-small">Personalized For You</button>
                </div>
            </div>

            {weeklyOutfits.length > 0 && (
                <div className="card weekly-planner-card">
                    <h3>Your Weekly Outfit Planner</h3>
                    <p className="text-muted">Personalized outfit suggestions for the entire week</p>
                    <div className="weekly-grid">
                        {weeklyOutfits.map((dayOutfit, idx) => (
                            <div key={idx} className="day-card">
                                <div className="day-header">
                                    <h5>{dayOutfit.day}</h5>
                                    <span className="occasion-badge">{dayOutfit.occasion}</span>
                                </div>
                                <div className="outfit-details">
                                    <div className="outfit-item"><span>{dayOutfit.top}</span></div>
                                    {dayOutfit.bottom !== 'N/A' && <div className="outfit-item"><span>{dayOutfit.bottom}</span></div>}
                                    <div className="outfit-item"><span>{dayOutfit.layer}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card style-guide-card">
                <h3>Your Style Guide Today</h3>
                <p className="text-muted">{getDynamicRec()}</p>
                <div className="guide-images">
                    <div className="guide-image-container">
                        <img src="/artifacts/fashion_casual_outfit.png" alt="Casual style inspiration" />
                        <div className="img-overlay">Casual Elegance</div>
                    </div>
                    <div className="guide-image-container">
                        <img src="/artifacts/fashion_yoga_outfit.png" alt="Wellness style inspiration" />
                        <div className="img-overlay">Wellness Comfort</div>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="card fabric-guide-section">
                <h3>Recommended Fabrics</h3>
                <p className="text-muted">Choose materials that work with your body</p>
                <div className="grid grid-3 fabric-grid">
                    {(activeTab === 'Fabric Guide' ? fabricContent : colorContent).map((item, idx) => (
                        <div key={idx} className={`card fabric-card ${item.color || ''}`}>
                            <div className="fabric-icon-container">{item.icon}</div>
                            <div className="fabric-info">
                                <h5>{item.title}</h5>
                                <p className="text-muted">{item.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="personalization-banner">
                <div className="pb-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                </div>
                <div className="pb-content">
                    <h4>Get More Personalized Recommendations</h4>
                    <p>Set your body type in your profile to receive tailored fashion suggestions that celebrate your unique shape!</p>
                </div>
                <div className="flex gap-4 flex-wrap mt-4 md:mt-0">
                    <button className="btn btn-secondary white-bg" onClick={() => navigate('/profile')}>
                        Go to Profile
                    </button>
                    <button className="btn btn-secondary white-bg" onClick={() => navigate('/symptom')}>
                        Track Symptoms
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FashionDashboard;
