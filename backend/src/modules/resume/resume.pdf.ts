import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export const generatePDF = async (resumeData: any, userEmail: string) => {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox'] 
    });
    const page = await browser.newPage();

    // 1. Read the HTML template
    const templatePath = path.join(__dirname, '../../templates/resume.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // 2. Map data to template
    // Since no UserProfile exists, we use email as the identifier [cite: 93]
    const data = resumeData.atsResume;
    
    html = html.replace('{{email}}', userEmail)
               .replace('{{summary}}', data.summary || '')
               .replace('{{skills}}', (data.skills || []).join(', '));

    // Map Experience Bullets
    const expHtml = data.experience?.map((exp: any) => `
        <div style="margin-top: 10px;">
            <strong>${exp.company}</strong> | <span>${exp.title}</span>
            <ul>
                ${exp.bullets?.map((b: string) => `<li>${b}</li>`).join('')}
            </ul>
        </div>
    `).join('') || '';
    
    html = html.replace('{{experience}}', expHtml);

    // 3. Generate PDF [cite: 168, 182]
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();
    return pdfBuffer;
};