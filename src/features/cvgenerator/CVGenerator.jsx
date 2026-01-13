import React, { useImperativeHandle, forwardRef } from 'react';
import { resumeData } from '../../data/resumeData';

const CVGenerator = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    handlePrint: () => {
        const rootStyles = getComputedStyle(document.documentElement);
        const dynamicAccent = rootStyles.getPropertyValue('--accent-color').trim() || 'var(--accent-color)';

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const cvHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        @page {
          size: A4;
          margin: 0; 
        }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; }

        :root { --accent-color: ${dynamicAccent}; }
        
        html, body { height: 100%; margin: 0; padding: 0; }

        body { 
          font-family: 'Helvetica', 'Arial', sans-serif;
          background: white;
          color: #1e293b;
        }

        .cv-document { 
          width: 210mm; 
          min-height: 100vh; 
          display: flex; 
          flex-direction: column;
          margin: 0;
          padding: 0;
        }

        header { 
          background: #0f172a; 
          color: white; 
          padding: 45px; 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
        }

        .header-left h1 { margin: 0; font-size: 32pt; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
        .header-left p { color: var(--accent-color); font-family: monospace; margin: 5px 0 0 0; letter-spacing: 2px; font-size: 10pt; }
        
        .contact-info { text-align: right; font-family: monospace; font-size: 8pt; color: #94a3b8; }
        .contact-info p { margin: 2px 0; }

        .content-split { display: flex; flex: 1; }
        
        /* SIDEBAR */
        .sidebar { width: 33%; background: #f8fafc; padding: 40px 30px; border-right: 1px solid #e2e8f0; }
        .sidebar h3 { font-family: monospace; font-size: 10pt; text-transform: uppercase; letter-spacing: 2px; color: #64748b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; }
        
        .summary-text { font-size: 9pt; color: #475569; line-height: 1.6; margin-bottom: 30px; }

        .edu-item { margin-bottom: 20px; page-break-inside: avoid; }
        .edu-item b { display: block; font-size: 10pt; margin-bottom: 2px; }
        .edu-item span { font-size: 9pt; color: #475569; font-style: italic; }
        .edu-item p { font-family: monospace; color: var(--accent-color); font-size: 8pt; margin: 4px 0; }

        /* MAIN CONTENT */
        .main { width: 67%; padding: 40px; }
        .main h3 { font-family: monospace; font-size: 10pt; text-transform: uppercase; letter-spacing: 2px; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 25px; }
        
        .exp-item { 
          border-left: 2px solid #e2e8f0; 
          padding-left: 20px; 
          position: relative; 
          margin-bottom: 30px; 
          page-break-inside: avoid; 
          break-inside: avoid;
        }
        .exp-item::before { content: ""; position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background: var(--accent-color); border-radius: 50%; }
        
        /* Experience Headings */
        .exp-item b { font-size: 13pt; text-transform: uppercase; display: block; }
        
        /* Experience Subtitles (Company/Team) - Slightly Smaller */
        .exp-item i { font-size: 9pt; color: var(--accent-color); display: block; margin: 4px 0; font-weight: bold; font-style: normal; font-family: monospace; }
        
        /* Experience Bullet Points - Reduced size for better density */
        .exp-item ul { padding-left: 15px; margin-top: 8px; font-size: 9pt; color: #334155; }
        .exp-item li { margin-bottom: 4px; line-height: 1.4; }

        footer { 
          background: #f8fafc; 
          padding: 15px; 
          text-align: center; 
          font-size: 7pt; 
          font-family: monospace; 
          color: #94a3b8; 
          border-top: 1px solid #e2e8f0;
          margin-top: auto;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="cv-document">
          <header>
            <div class="header-left">
              <h1>${resumeData.personal.name}</h1>
              <p>${resumeData.personal.title}</p>
            </div>
            <div class="contact-info">
              <p>${resumeData.personal.location}</p>
              <p>${resumeData.personal.email}</p>
              <p>${resumeData.personal.github}</p>
              <p>${resumeData.personal.instagram}</p>
            </div>
          </header>
          <div class="content-split">
            <div class="sidebar">
              <h3>Profile</h3>
              <div class="summary-text">${resumeData.personal.summary}</div>

              <h3>Education</h3>
              ${resumeData.education.map(edu => `
                <div class="edu-item">
                  <b>${edu.institution}</b>
                  <span>${edu.degree}</span>
                  <p>${edu.period}</p>
                </div>
              `).join('')}
              
              <h3 style="margin-top: 40px;">System_Skills</h3>
              <div style="font-family: monospace; font-size: 9pt;">
                ${resumeData.skills.map(skill => `
                  <div style="margin-bottom: 10px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>${skill.name}</span>
                      <span>${skill.level}%</span>
                    </div>
                    <div style="height:2px; background:#e2e8f0; width:100%;">
                      <div style="height:100%; background:#0f172a; width:${skill.level}%;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="main">
                <h3>Experiences</h3>
                ${resumeData.experience.map(exp => `
                  <div class="exp-item">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <b>${exp.role}</b>
                        <span style="font-family: monospace; font-size: 8pt; color: #94a3b8;">${exp.period}</span>
                    </div>
                    <i>${exp.company} // Team_Size: ${exp.teamSize || 1}</i>
                    <ul>
                        ${exp.responsibilities.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
            </div>
          </div>
          <footer>
            ${resumeData.personal.name.replace(/\s/g, '_')} // PORTFOLIO V1.0 // ${new Date().getFullYear()}
          </footer>
      </div>
    </body>
  </html>
`;

      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(cvHtml);
      iframe.contentWindow.document.close();

      // Wait for fonts and styles to settle
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        // Remove iframe after print dialog is closed
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500);
    }
  }));

  return null;
});

export default CVGenerator;