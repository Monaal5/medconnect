import React, { useState } from 'react';
import {
    Pill, Search, ChevronRight, AlertTriangle,
    FileText, Send, Download, Plus, X, Check
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './PrescriptionGenerator.css';
import { getGeminiResponse } from '../lib/geminiClient';
import { generatePrescriptionPDF } from '../utils/generatePrescriptionPDF';

const PrescriptionGenerator = ({ patient }) => {
    const { medicines, savePrescription, profile } = useGlobal();
    const [symptoms, setSymptoms] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [prescribed, setPrescribed] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const getAISuggestions = async () => {
        if (!symptoms) return;
        setAiLoading(true);

        try {
            const prompt = `As a medical assistant, suggest medicines for these symptoms: "${symptoms}". 
            Available stock: ${medicines.map(m => m.name).join(', ')}. 
            Only suggest medicines from the available stock. Return as a comma separated list of medicine names only.`;

            const response = await getGeminiResponse(prompt);
            const suggestedNames = response.split(',').map(s => s.trim().toLowerCase());

            const filtered = medicines.filter(m =>
                suggestedNames.includes(m.name.toLowerCase())
            );

            setSuggestions(filtered);
        } catch (error) {
            console.error(error);
        } finally {
            setAiLoading(false);
        }
    };

    const addMedicine = (med) => {
        if (!prescribed.find(p => p.id === med.id)) {
            setPrescribed([...prescribed, { ...med, duration: '5 Days', frequency: '1-0-1' }]);
        }
    };

    const removeMedicine = (id) => {
        setPrescribed(prescribed.filter(p => p.id !== id));
    };

    const handleSaveAndShare = () => {
        const presData = {
            patient_id: patient.id,
            patient_name: patient.name,
            doctor: `Dr. ${profile?.full_name || "Smith"}`,
            medicines: prescribed.map(m => ({
                name: m.name,
                dose: m.dose,
                frequency: m.frequency,
                duration: m.duration
            }))
        };
        savePrescription(presData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleGeneratePDF = () => {
        generatePrescriptionPDF(patient, profile, prescribed, symptoms);
    };

    return (
        <div className="prescription-container card glass">
            <div className="prescription-header">
                <FileText className="primary-text" />
                <h2>E-Prescription Generator</h2>
            </div>

            <div className="prescription-grid">
                <div className="ai-section">
                    <label>Symptoms & Diagnosis</label>
                    <div className="symptom-input">
                        <textarea
                            placeholder="Enter patient symptoms (e.g., high fever, body pain)..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                        <button className="ai-assist-btn" onClick={getAISuggestions} disabled={aiLoading}>
                            {aiLoading ? 'Thinking...' : 'Get AI Suggestions'}
                        </button>
                    </div>

                    <div className="suggestions-area">
                        <h4>AI Suggested (From Your Stock)</h4>
                        {suggestions.length > 0 ? (
                            <div className="suggestions-list">
                                {suggestions.map(med => (
                                    <div key={med.id} className="suggestion-item" onClick={() => addMedicine(med)}>
                                        <div>
                                            <p className="med-name">{med.name} <span>{med.dose}</span></p>
                                            <p className="med-stock">In Stock: {med.stock}</p>
                                        </div>
                                        <Plus size={16} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-msg">No suggestions yet. Try "fever", "cough", or "diabetes".</p>
                        )}
                    </div>
                </div>

                <div className="current-prescription">
                    <h4>Medication List</h4>
                    <div className="prescribed-list">
                        {prescribed.length > 0 ? (
                            prescribed.map(med => (
                                <div key={med.id} className="prescribed-item">
                                    <div className="item-header">
                                        <strong>{med.name}</strong>
                                        <button onClick={() => removeMedicine(med.id)}><X size={14} /></button>
                                    </div>
                                    <div className="item-controls">
                                        <input type="text" value={med.frequency} readOnly />
                                        <input type="text" value={med.duration} readOnly />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-prescription">
                                <AlertTriangle size={32} />
                                <p>No medicines added yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="prescription-actions">
                        <button className="secondary-btn" onClick={handleGeneratePDF} disabled={prescribed.length === 0}>
                            <Download size={18} />
                            Save PDF
                        </button>
                        <button
                            className={`primary-btn ${saved ? 'success-bg' : ''}`}
                            onClick={handleSaveAndShare}
                            disabled={prescribed.length === 0 || saved}
                        >
                            {saved ? <Check size={18} /> : <Send size={18} />}
                            {saved ? 'Saved & Shared' : 'Share with Patient'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionGenerator;
