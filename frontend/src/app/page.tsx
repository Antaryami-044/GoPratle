'use client';
import { useState } from 'react';

export default function RequirementForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: '', eventType: '', date: '', location: '', venue: '',
    category: '', categoryDetails: {}
  });

  const updateDetails = (key: string, value: string) => {
    setFormData({ ...formData, categoryDetails: { ...formData.categoryDetails, [key]: value } });
  };

  const submitForm = async () => {
    // Replace with your actual deployed Render/Railway URL later
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${API_URL}/api/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('🚀 Requirement Posted Successfully!');
        setStep(1); // Reset to start
      }
    } catch (err) {
      alert('Error submitting form. Is the backend running?');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 font-sans text-slate-900">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold">Post a Requirement</h1>
          <p className="text-blue-100 mt-2">Fill in the details to find the perfect match.</p>
        </div>

        <div className="p-8">
          {/* Progress Stepper */}
          <div className="flex items-center justify-between mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`h-1 flex-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1: Basic Event Details */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-500">
              <h2 className="text-xl font-semibold border-b pb-2">Event Information</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
                <input className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Summer Music Fest 2026" onChange={e => setFormData({...formData, eventName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City, State" onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="date" onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95">
                Continue to Category
              </button>
            </div>
          )}

          {/* STEP 2: Category Selection */}
          {step === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right duration-500">
              <h2 className="text-xl font-semibold border-b pb-2">What service do you need?</h2>
              <div className="grid gap-3">
                {['Planner', 'Performer', 'Crew'].map(cat => (
                  <button key={cat} onClick={() => { setFormData({...formData, category: cat}); setStep(3); }} 
                    className="group w-full p-5 text-left border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center">
                    <div>
                      <span className="block font-bold text-slate-800">{cat}</span>
                      <span className="text-sm text-slate-500 italic">Select for specific {cat.toLowerCase()} requirements</span>
                    </div>
                    <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="w-full text-slate-500 font-medium py-2">← Go Back</button>
            </div>
          )}

          {/* STEP 3: Conditional Details */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h2 className="text-lg font-bold text-blue-800">Final Step: {formData.category} Details</h2>
                <p className="text-sm text-blue-600">Please provide specific needs for your {formData.category.toLowerCase()}.</p>
              </div>
              
              <div className="space-y-4">
                {formData.category === 'Planner' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Planning Type</label>
                      <input className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Wedding, Corporate, Birthday..." onChange={e => updateDetails('type', e.target.value)} />
                    </div>
                )}
                {formData.category === 'Performer' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Performance Genre</label>
                      <input className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Singer, DJ, Stand-up Comedy..." onChange={e => updateDetails('genre', e.target.value)} />
                    </div>
                )}
                {formData.category === 'Crew' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Team Size Needed</label>
                      <input className="w-full p-3 border border-slate-300 rounded-lg" type="number" placeholder="How many members?" onChange={e => updateDetails('count', e.target.value)} />
                    </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-200">Back</button>
                <button onClick={submitForm} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-all">
                  Submit Requirement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-center mt-8 text-slate-400 text-sm italic">Designed for GoPratle Evaluation Flow</p>
    </main>
  );
}