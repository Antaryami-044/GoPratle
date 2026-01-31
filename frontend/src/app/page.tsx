'use client';
import { useState } from 'react';

export default function RequirementForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // New: Loading state for better UX
  const [formData, setFormData] = useState({
    eventName: '', eventType: '', date: '', location: '', venue: '',
    category: '', categoryDetails: {} as Record<string, any>
  });

  const updateDetails = (key: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      categoryDetails: { ...prev.categoryDetails, [key]: value } 
    }));
  };

  // Humanized: Added simple validation before moving steps
  const canContinueStep1 = formData.eventName && formData.location && formData.date;

  const submitForm = async () => {
    setLoading(true);
    // Best Practice: Always use the env variable for deployment
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${API_URL}/api/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('🚀 Requirement Posted Successfully!');
        // Smooth reset after success
        setFormData({ eventName: '', eventType: '', date: '', location: '', venue: '', category: '', categoryDetails: {} });
        setStep(1); 
      } else {
        const errorData = await response.json();
        alert(`❌ Failed: ${errorData.message || 'Server error'}`);
      }
    } catch (err) {
      alert('❌ Error: Could not connect to the server. Please check your internet or if the backend is live.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Post a Requirement</h1>
          <p className="text-blue-100 mt-2 font-medium">Let's find the right talent for your event.</p>
        </div>

        <div className="p-10">
          {/* Progress Stepper - Visual representation of the flow */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-sm ${step >= s ? 'bg-blue-600 text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`h-1.5 flex-1 mx-3 rounded-full transition-all duration-500 ${step > s ? 'bg-blue-600' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1: Basic Event Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800">General Info</h2>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Basics</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Event Name</label>
                  <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="e.g. Corporate Gala 2026" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none" placeholder="City, State" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Event Date</label>
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>
              </div>

              <button 
                disabled={!canContinueStep1}
                onClick={() => setStep(2)} 
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 ${canContinueStep1 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                Choose Category →
              </button>
            </div>
          )}

          {/* STEP 2: Category Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">What do you need?</h2>
              <div className="grid gap-4">
                {['Planner', 'Performer', 'Crew'].map(cat => (
                  <button key={cat} onClick={() => { setFormData({...formData, category: cat}); setStep(3); }} 
                    className="group w-full p-6 text-left border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center shadow-sm">
                    <div>
                      <span className="block font-extrabold text-slate-800 text-lg">{cat}</span>
                      <span className="text-sm text-slate-500">Specific requirements for event {cat.toLowerCase()}s</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                        <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="w-full text-slate-500 font-semibold py-2 hover:text-slate-800 transition-colors">← Back to Basics</button>
            </div>
          )}

          {/* STEP 3: Conditional Details */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold uppercase">
                    {formData.category.charAt(0)}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-blue-900 leading-tight">Finalizing: {formData.category}</h2>
                    <p className="text-sm text-blue-600 font-medium">Just a few more details needed.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {formData.category === 'Planner' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Planning Type</label>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Wedding, Corporate..." onChange={e => updateDetails('type', e.target.value)} />
                    </div>
                )}
                {formData.category === 'Performer' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Genre / Talent Type</label>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Jazz Singer, DJ, Magician..." onChange={e => updateDetails('genre', e.target.value)} />
                    </div>
                )}
                {formData.category === 'Crew' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Staff Members Count</label>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" type="number" placeholder="How many do you need?" onChange={e => updateDetails('count', e.target.value)} />
                    </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="w-1/3 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-sm">Back</button>
                <button 
                    disabled={loading}
                    onClick={submitForm} 
                    className={`flex-1 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                  {loading ? 'Processing...' : 'Submit Post ✨'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-center mt-10 text-slate-400 text-sm font-medium">Developed for the GoPratle Technical Assessment Flow</p>
    </main>
  );
}