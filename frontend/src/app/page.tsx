'use client';
import { useState } from 'react';

export default function RequirementForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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

  const canContinueStep1 = formData.eventName && formData.location && formData.date;

  const submitForm = async () => {
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${API_URL}/api/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Requirement Posted Successfully!');
        setFormData({ eventName: '', eventType: '', date: '', location: '', venue: '', category: '', categoryDetails: {} });
        setStep(1); 
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.message || 'Server error'}`);
      }
    } catch (err) {
      alert('Error: Could not connect to the server. Please check your internet or if the backend is live.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-12 px-4 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto">
        
        <div className="relative mb-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transform rotate-1 shadow-2xl opacity-10"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 shadow-2xl transform hover:-translate-y-1 transition-transform duration-300">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Post Your Requirement</h1>
            <p className="text-blue-100 text-lg font-medium opacity-90">Find the perfect talent for your event in 3 simple steps</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-30"></div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          
          <div className="px-10 pt-10">
            <div className="flex items-center justify-between mb-12 relative">
              <div className="absolute top-6 left-16 right-16 h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 rounded-full z-0"></div>
              
              {[1, 2, 3].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center flex-1">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 shadow-lg 
                    ${step >= s 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white transform scale-110 rotate-3 shadow-blue-500/30' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 border-2 border-white shadow-inner'
                    }`}
                    style={step === s ? { 
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4), 0 0 0 3px rgba(255,255,255,1), 0 0 0 5px rgba(59, 130, 246, 0.2)'
                    } : {}}>
                    <span className="text-xl">{s}</span>
                  </div>
                  <span className={`mt-3 text-sm font-semibold ${step >= s ? 'text-blue-700' : 'text-gray-400'}`}>
                    {s === 1 ? 'Basics' : s === 2 ? 'Category' : 'Details'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Event Information</h2>
                    <p className="text-gray-500 mt-1">Fill in the basic details about your event</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
                    <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Step 1 of 3</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="transform hover:-translate-y-1 transition-transform duration-300">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Event Name
                    </label>
                    <input 
                      className="w-full p-5 bg-gradient-to-b from-white to-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all outline-none shadow-inner"
                      placeholder="e.g. Corporate Gala 2026" 
                      value={formData.eventName} 
                      onChange={e => setFormData({...formData, eventName: e.target.value})} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="transform hover:-translate-y-1 transition-transform duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Location
                      </label>
                      <input 
                        className="w-full p-5 bg-gradient-to-b from-white to-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none shadow-inner"
                        placeholder="City, State" 
                        value={formData.location} 
                        onChange={e => setFormData({...formData, location: e.target.value})} 
                      />
                    </div>
                    <div className="transform hover:-translate-y-1 transition-transform duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Event Date
                      </label>
                      <input 
                        className="w-full p-5 bg-gradient-to-b from-white to-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none shadow-inner"
                        type="date" 
                        value={formData.date} 
                        onChange={e => setFormData({...formData, date: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button 
                    disabled={!canContinueStep1}
                    onClick={() => setStep(2)} 
                    className={`w-full font-bold py-5 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg
                      ${canContinueStep1 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1' 
                        : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed shadow-inner'
                      }`}>
                    <span className="flex items-center justify-center">
                      Continue to Category 
                      <span className="ml-2 text-xl">→</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Select Category</h2>
                    <p className="text-gray-500 mt-1">What type of talent are you looking for?</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-100">
                    <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">Step 2 of 3</span>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {[
                    { label: 'Planner', desc: 'Event planning and coordination specialists', color: 'from-blue-400 to-cyan-500' },
                    { label: 'Performer', desc: 'Artists, musicians, and entertainers', color: 'from-purple-500 to-pink-500' },
                    { label: 'Crew', desc: 'Technical and support staff', color: 'from-green-500 to-emerald-600' }
                  ].map((cat) => (
                    <button 
                      key={cat.label}
                      onClick={() => { setFormData({...formData, category: cat.label}); setStep(3); }} 
                      className="group w-full p-8 text-left border-2 border-gray-100 rounded-3xl hover:border-transparent bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex justify-between items-center shadow-lg">
                      <div className="flex items-center">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mr-6 transform group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                          <span className="text-white font-bold text-xl">{cat.label.charAt(0)}</span>
                        </div>
                        <div>
                          <span className="block font-extrabold text-gray-900 text-2xl mb-1">{cat.label}</span>
                          <span className="text-gray-600 font-medium">{cat.desc}</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-purple-100 flex items-center justify-center transition-all duration-500 shadow-inner group-hover:shadow-lg">
                        <span className="text-gray-500 group-hover:text-blue-600 text-xl font-bold transition-colors duration-500">→</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => setStep(1)} 
                    className="w-full text-gray-600 font-semibold py-4 hover:text-gray-800 transition-colors duration-300 flex items-center justify-center group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Event Details
                  </button>
                </div>
              </div>
            )}

            {/* Conditional Details */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Final Details</h2>
                    <p className="text-gray-500 mt-1">Complete your requirement posting</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-100">
                    <span className="text-sm font-bold text-green-700 uppercase tracking-wider">Step 3 of 3</span>
                  </div>
                </div>
                
                {/* Category Header Card */}
                <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-8 rounded-3xl border border-blue-100/50 backdrop-blur-sm flex items-center space-x-6 shadow-inner">
                  <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br 
                    ${formData.category === 'Planner' ? 'from-blue-500 to-cyan-600' :
                      formData.category === 'Performer' ? 'from-purple-500 to-pink-600' :
                      'from-green-500 to-emerald-600'
                    } text-white flex items-center justify-center text-3xl font-bold shadow-lg transform rotate-3`}>
                    {formData.category.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">You're Hiring: {formData.category}</h2>
                    <p className="text-gray-600 font-medium">Last step! Provide specific details for better matches.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {formData.category === 'Planner' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                        Planning Type
                      </label>
                      <input 
                        className="w-full p-5 bg-gradient-to-b from-white to-gray-50 border-2 border-blue-100 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none shadow-inner"
                        placeholder="e.g. Wedding Planning, Corporate Event..." 
                        onChange={e => updateDetails('type', e.target.value)} 
                      />
                    </div>
                  )}
                  {formData.category === 'Performer' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                        Genre / Talent Type
                      </label>
                      <input 
                        className="w-full p-5 bg-gradient-to-b from-white to-gray-50 border-2 border-purple-100 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none shadow-inner"
                        placeholder="e.g. Jazz Singer, DJ, Magician, Band..." 
                        onChange={e => updateDetails('genre', e.target.value)} 
                      />
                    </div>
                  )}
                  {formData.category === 'Crew' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Staff Members Count
                      </label>
                      <input 
                        className="w-full p-5 bg-gradient-to-b from-white to-gray-50 border-2 border-green-100 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none shadow-inner"
                        type="number" 
                        placeholder="How many crew members do you need?" 
                        onChange={e => updateDetails('count', e.target.value)} 
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-6 pt-8 border-t border-gray-100">
                  <button 
                    onClick={() => setStep(2)} 
                    className="w-1/3 bg-gradient-to-b from-gray-100 to-gray-200 text-gray-700 font-bold py-5 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-inner hover:shadow-lg transform hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                    <span className="mr-2">←</span> Back
                  </button>
                  <button 
                    disabled={loading}
                    onClick={submitForm} 
                    className={`flex-1 text-white font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1
                      ${loading 
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/30 hover:shadow-emerald-500/50'
                      }`}>
                    {loading ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Processing...
                      </div>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-3">✨</span>
                        Submit & Post Requirement
                        <span className="ml-3 text-xl">🚀</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm font-medium bg-white/50 backdrop-blur-sm rounded-full py-3 px-6 inline-block border border-white/50 shadow-sm">
            Developed for <span className="text-blue-600 font-bold">GoPratle</span> Technical Assessment • Modern UI Implementation
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-70"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </main>
  );
}