/**
 * Simple PDF generator for referral packets
 * In production, this would use a library like jsPDF or react-pdf
 */

export interface ReferralData {
  patientName: string;
  email: string;
  dateOfBirth: string;
  referralCode: string;
  gpName?: string;
  practiceName?: string;
  insuranceModel?: string;
  symptoms?: string[];
  referenceNumber?: string;
}

export const generateReferralPDF = (data: ReferralData): void => {
  // Create a simple HTML content for the referral
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SKIIN Referral Packet - ${data.referralCode}</title>
      <style>
        body { 
          font-family: 'IBM Plex Sans', sans-serif; 
          padding: 40px; 
          max-width: 800px; 
          margin: 0 auto;
        }
        .header { 
          background-color: #004C96; 
          color: white; 
          padding: 20px; 
          margin-bottom: 30px;
          border-radius: 8px;
        }
        .section { 
          margin-bottom: 30px; 
          padding: 20px; 
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .code-box {
          background-color: #f3f4f6;
          padding: 15px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #004C96;
          letter-spacing: 2px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .info-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .label { 
          font-weight: 600; 
          color: #374151;
        }
        .value { 
          color: #6b7280;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
        }
        .instructions {
          background-color: #fef3c7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SKIIN Swiss Holter Monitoring</h1>
        <h2>GP Referral Packet</h2>
      </div>
      
      <div class="section">
        <h3>Referral Code</h3>
        <div class="code-box">${data.referralCode}</div>
        <p style="text-align: center; color: #6b7280;">Please use this code when submitting the signed referral</p>
      </div>
      
      <div class="section">
        <h3>Patient Information</h3>
        <div class="info-row">
          <span class="label">Patient Name:</span>
          <span class="value">${data.patientName || 'To be provided'}</span>
        </div>
        <div class="info-row">
          <span class="label">Date of Birth:</span>
          <span class="value">${data.dateOfBirth || 'To be provided'}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">${data.email}</span>
        </div>
        <div class="info-row">
          <span class="label">Insurance Model:</span>
          <span class="value">${data.insuranceModel || 'Standard'}</span>
        </div>
        ${data.symptoms && data.symptoms.length > 0 ? `
        <div class="info-row">
          <span class="label">Reported Symptoms:</span>
          <span class="value">${data.symptoms.join(', ')}</span>
        </div>
        ` : ''}
      </div>
      
      ${data.gpName ? `
      <div class="section">
        <h3>GP Information</h3>
        <div class="info-row">
          <span class="label">Doctor Name:</span>
          <span class="value">${data.gpName}</span>
        </div>
        <div class="info-row">
          <span class="label">Practice:</span>
          <span class="value">${data.practiceName || 'To be provided'}</span>
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <h3>Instructions for GP</h3>
        <div class="instructions">
          <ol>
            <li>Review the patient's eligibility for Holter monitoring</li>
            <li>Sign the referral form below</li>
            <li>Submit via one of these methods:
              <ul>
                <li>Upload at: https://skiin.ch/referral</li>
                <li>Send via HIN secure email</li>
                <li>Fax to: +41 44 XXX XX XX</li>
              </ul>
            </li>
            <li>Enter referral code: <strong>${data.referralCode}</strong></li>
          </ol>
        </div>
      </div>
      
      <div class="section">
        <h3>Medical Justification</h3>
        <p>Patient presents with cardiovascular symptoms warranting continuous cardiac monitoring:</p>
        <ul>
          <li>☐ Palpitations</li>
          <li>☐ Irregular heartbeat</li>
          <li>☐ Chest discomfort</li>
          <li>☐ Shortness of breath</li>
          <li>☐ Dizziness or syncope</li>
          <li>☐ Other: _________________________</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>GP Authorization</h3>
        <div style="margin-top: 40px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p>_______________________________</p>
              <p>GP Signature</p>
            </div>
            <div>
              <p>_______________________________</p>
              <p>Date</p>
            </div>
          </div>
          <div style="margin-top: 30px;">
            <p>_______________________________</p>
            <p>GP Stamp</p>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>Reference: ${data.referenceNumber || Date.now().toString(36).toUpperCase()}</p>
        <p>SKIIN Switzerland | Holter Monitoring Service</p>
        <p>Generated on ${new Date().toLocaleDateString('en-CH')}</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `SKIIN_Referral_${data.referralCode}_${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  window.URL.revokeObjectURL(url);
};

/**
 * Generate a simple invoice PDF for self-pay patients
 */
export const generateInvoicePDF = (data: {
  patientName: string;
  email: string;
  amount: string;
  referenceNumber: string;
}): void => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SKIIN Invoice - ${data.referenceNumber}</title>
      <style>
        body { 
          font-family: 'IBM Plex Sans', sans-serif; 
          padding: 40px; 
          max-width: 800px; 
          margin: 0 auto;
        }
        .invoice-header { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #004C96;
        }
        .company-info h1 { 
          color: #004C96; 
          margin: 0;
        }
        .invoice-details { 
          text-align: right;
        }
        .invoice-number {
          font-size: 24px;
          font-weight: bold;
          color: #004C96;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0;
        }
        th { 
          background-color: #f3f4f6; 
          padding: 12px; 
          text-align: left;
          font-weight: 600;
        }
        td { 
          padding: 12px; 
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row { 
          font-size: 20px; 
          font-weight: bold;
          color: #004C96;
        }
        .payment-info {
          background-color: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company-info">
          <h1>SKIIN Switzerland</h1>
          <p>Holter Monitoring Service</p>
          <p>Zürich, Switzerland</p>
        </div>
        <div class="invoice-details">
          <div class="invoice-number">INVOICE</div>
          <p>Reference: ${data.referenceNumber}</p>
          <p>Date: ${new Date().toLocaleDateString('en-CH')}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3>Bill To:</h3>
        <p>${data.patientName}</p>
        <p>${data.email}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SKIIN Holter Monitoring Device (24-48 hours)</td>
            <td>1</td>
            <td>CHF 299.00</td>
            <td>CHF 299.00</td>
          </tr>
          <tr>
            <td>AI-Powered Analysis & Medical Report</td>
            <td>1</td>
            <td>CHF 150.00</td>
            <td>CHF 150.00</td>
          </tr>
          <tr>
            <td>Shipping & Handling</td>
            <td>1</td>
            <td>CHF 15.00</td>
            <td>CHF 15.00</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
            <td>CHF 464.00</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>VAT (7.7%):</strong></td>
            <td>CHF 35.00</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Total:</td>
            <td>${data.amount}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Status:</strong> Paid</p>
        <p><strong>Payment Method:</strong> Credit Card</p>
        <p><strong>Transaction Date:</strong> ${new Date().toLocaleDateString('en-CH')}</p>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
        <p>Thank you for choosing SKIIN Switzerland</p>
        <p>For questions, contact: support@skiin.ch</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SKIIN_Invoice_${data.referenceNumber}_${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};