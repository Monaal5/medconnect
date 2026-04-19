import React, { useState } from 'react';
import {
    FileText, User, Activity, Plus, X, Search, FileDown, CheckCircle
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { getGeminiResponse } from '../lib/geminiClient';
import { generatePrescriptionPDF } from '../utils/generatePrescriptionPDF';
import './PrescriptionGenerator.css';

const PrescriptionGenerator = ({ patient }) => {
    const { medicines, savePrescription, profile } = useGlobal();
    const [symptoms, setSymptoms] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [prescribed, setPrescribed] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [pdfGenerating, setPdfGenerating] = useState(false);

    const getAISuggestions = async (e) => {
        e.preventDefault();
        if (!symptoms) return;
        setAiLoading(true);

        try {
            const prompt = `As a clinical AI assistant, suggest stock medicines for these symptoms: "${symptoms}". 
            Available stock: ${medicines.map(m => m.name).join(', ')}. 
            Only suggest medicines from the available stock list. Return as a comma separated list of exact medicine names only.`;

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
            setPrescribed([...prescribed, { ...med, duration: '5 Days', frequency: '1-0-1', instructions: 'After meals' }]);
        }
    };

    const removeMedicine = (id) => {
        setPrescribed(prescribed.filter(p => p.id !== id));
    };

    const updateMedDetails = (id, field, value) => {
        setPrescribed(prescribed.map(p => p.id === id ? { ...p, [field]: value } : p));
    }

    const handleGeneratePDF = async () => {
        setPdfGenerating(true);
        // Add artificial delay for UX feel of processing
        setTimeout(() => {
            generatePrescriptionPDF(patient, profile, prescribed, symptoms);
            setPdfGenerating(false);
            
            // Also logic to save internal log
            const presData = {
                patient_id: patient.id,
                patient_name: patient.name,
                doctor: `Dr. ${profile?.full_name || "Doctor"}`,
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
        }, 800);
    };

    return (
        <div className="ehr-prescription-panel">
            
            {/* Left Box: Examination & Setup */}
            <div className="ehr-prescribe-form">
                <div className="ehr-prescribe-header">
                    <div style={{display:'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <User size={20} color="var(--ehr-accent)" />
                        <div>
                            <h3 style={{margin:0, color: 'var(--ehr-primary)'}}>{patient.name}</h3>
                            <div style={{fontSize: '0.8rem', color: 'var(--ehr-text-muted)', marginTop: '2px'}}>
                                ID: {patient.id} | Age: {patient.age} | Sex: {patient.gender} | Vitals: {patient.bp || '120/80'} BP, {patient.weight || '70'} kg
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ehr-prescribe-body">
                    <div className="ehr-form-group">
                        <label className="ehr-form-label"><Activity size={14} style={{display:'inline', verticalAlign:'middle'}}/> Clinical Notes & Symptoms</label>
                        <textarea 
                            className="ehr-input" 
                            rows="4" 
                            placeholder="Enter detailed presentation, vital abnormalities, or patient complaints..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                        <button 
                            className="ehr-btn ehr-btn-outline" 
                            style={{marginTop: '0.75rem', width: '100%', justifyContent: 'center'}}
                            onClick={getAISuggestions}
                            disabled={aiLoading || symptoms.length < 5}
                        >
                            {aiLoading ? 'Analyzing Clinical Notes...' : 'Scan Notes & Suggest Medication'}
                        </button>
                    </div>

                    <div style={{marginTop: '2rem'}}>
                        <label className="ehr-form-label">Available Inventory / AI Suggestions</label>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem'}}>
                            {suggestions.length > 0 ? suggestions.map(med => (
                                <div key={med.id} style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--ehr-border)', borderRadius: '6px'}}>
                                    <div>
                                        <div style={{fontWeight: '600'}}>{med.name}</div>
                                        <div style={{fontSize: '0.75rem', color: 'var(--ehr-text-muted)'}}>{med.category} | Stock: {med.stock}</div>
                                    </div>
                                    <button className="ehr-btn ehr-btn-primary" style={{padding: '0.4rem 0.6rem'}} onClick={() => addMedicine(med)}>
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            )) : (
                                <div style={{padding: '2rem', textAlign: 'center', color: 'var(--ehr-text-muted)', border: '1px dashed var(--ehr-border)', borderRadius: '6px'}}>
                                    {medicines.length === 0 ? "No medicines in pharmacy stock." : "Enter symptoms above or browse manually."}
                                </div>
                            )}

                            {suggestions.length === 0 && medicines.slice(0, 5).map(med => (
                                <div key={med.id} style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--ehr-border)', borderRadius: '6px'}}>
                                    <div>
                                        <div style={{fontWeight: '600'}}>{med.name}</div>
                                        <div style={{fontSize: '0.75rem', color: 'var(--ehr-text-muted)'}}>{med.category} | Stock: {med.stock}</div>
                                    </div>
                                    <button className="ehr-btn ehr-btn-outline" style={{padding: '0.4rem 0.6rem'}} onClick={() => addMedicine(med)}>
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Box: Final Prescription Draft */}
            <div className="ehr-draft-panel">
                <div className="ehr-prescribe-header" style={{background: 'var(--ehr-primary)', color: 'white'}}>
                    <h3 style={{color: 'white', display: 'flex', alignItems: 'center', gap: '8px'}}><FileText size={18} /> Official Rx Draft</h3>
                </div>
                
                <div className="ehr-draft-list">
                    {prescribed.length === 0 ? (
                        <div style={{textAlign: 'center', color: '#94a3b8', marginTop: '4rem'}}>
                            <FileText size={48} style={{opacity: 0.5, marginBottom: '1rem'}} />
                            <p>Draft is empty. Add medications to build the official prescription.</p>
                        </div>
                    ) : (
                        prescribed.map((med, index) => (
                            <div key={med.id} className="ehr-draft-item">
                                <div style={{display:'flex', justifyContent:'space-between', borderBottom: '1px solid var(--ehr-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem'}}>
                                    <strong style={{fontSize: '1.05rem', color: 'var(--ehr-primary)'}}>{index + 1}. {med.name}</strong>
                                    <X size={16} color="#ef4444" style={{cursor: 'pointer'}} onClick={() => removeMedicine(med.id)} />
                                </div>
                                <div className="ehr-split-input">
                                    <input className="ehr-input" style={{padding: '0.4rem'}} placeholder="Frequency e.g. 1-0-1" value={med.frequency} onChange={e => updateMedDetails(med.id, 'frequency', e.target.value)} />
                                    <input className="ehr-input" style={{padding: '0.4rem'}} placeholder="Duration e.g. 5 Days" value={med.duration} onChange={e => updateMedDetails(med.id, 'duration', e.target.value)} />
                                </div>
                                <input className="ehr-input" style={{padding: '0.4rem', marginTop: '0.5rem', fontSize: '0.85rem'}} placeholder="Special Instructions e.g. Take after meals" value={med.instructions} onChange={e => updateMedDetails(med.id, 'instructions', e.target.value)} />
                            </div>
                        ))
                    )}
                </div>

                <div className="ehr-draft-actions">
                    <button 
                        className="ehr-pdf-btn" 
                        onClick={handleGeneratePDF}
                        disabled={prescribed.length === 0 || pdfGenerating}
                    >
                        {pdfGenerating ? (
                            <span>Generating PDF...</span>
                        ) : saved ? (
                            <><CheckCircle size={20}/> Logged & Saved!</>
                        ) : (
                            <><FileDown size={20} /> Generate Official PDF</>
                        )}
                    </button>
                    <div style={{fontSize: '0.75rem', color: 'var(--ehr-text-muted)', textAlign: 'center'}}>
                        This action will generate a formal PDF utilizing the active Clinic Settings and append an internal record to the patient's EHR directory.
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PrescriptionGenerator;
