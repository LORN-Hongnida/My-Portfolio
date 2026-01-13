import React, { useState } from 'react';
import OrbTrigger from './OrbTrigger';

const Contact = ({ orbStatus }) => {
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SUCCESS

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('SENDING');
    // Simulate API call
    setTimeout(() => setStatus('SUCCESS'), 2000);
  };

  return (
    <section id="contact" className="py-24 px-10 md:px-32 bg-app-bg relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <OrbTrigger comment="Awaiting user input. Secure channel ready." orbStatus={orbStatus}>
          <h2 className="text-4xl md:text-6xl font-bold text-app-text tracking-tighter mb-12">
            LEAVE_A_<span className="text-accent">MESSAGE</span>
          </h2>
        </OrbTrigger>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Side: Contact Info */}
          <div className="space-y-8">
            <p className="text-app-text/60 text-lg leading-relaxed">
              Open for collaboration on high-impact systems, UI architecture, or creative development protocols.
            </p>
            
            <div className="space-y-4 font-mono text-sm uppercase tracking-widest">
              <div className="flex flex-col">
                <span className="text-accent/50 text-[10px]">Location</span>
                <span className="text-app-text">Phnom Penh-City / Remote</span>
              </div>
              <div className="flex flex-col">
                <span className="text-accent/50 text-[10px]">Email</span>
                <span className="text-app-text">nda403364@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Right Side: Terminal Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-accent/5 p-8 rounded-2xl border border-accent/15 backdrop-blur-md">
            <div className="space-y-2">
              <label className="text-[12px] font-mono text-accent tracking-tighter">Your_Name</label>
              <input 
                type="text" 
                placeholder="Name"
                className="w-full bg-app-bg border border-white/10 rounded-lg p-3 text-app-text focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-mono text-accent tracking-tighter">Email_Address</label>
              <input 
                type="email" 
                placeholder="Email"
                className="w-full bg-app-bg border border-white/10 rounded-lg p-3 text-app-text focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-mono text-accent tracking-tighter">Message</label>
              <textarea 
                rows="4"
                placeholder="Message..."
                className="w-full bg-app-bg border border-white/10 rounded-lg p-3 text-app-text focus:outline-none focus:border-accent transition-colors resize-none"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 bg-accent text-white font-mono rounded-lg hover:shadow-[0_0_20px_var(--accent-colorz)] transition-all disabled:opacity-50"
              disabled={status !== 'IDLE'}
            >
              {status === 'IDLE' ? 'SEND_A_MESSAGE' : status === 'SENDING' ? 'ENCRYPTING...' : 'MESSAGE_SENT_SUCCESSFULLY'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;