const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Testing date validation fix...');
    await page.goto('http://localhost:8083/eligibility');
    await page.waitForSelector('input', { timeout: 5000 });
    
    // Fill in contact information by ID
    const inputs = await page.$$('input');
    console.log(`Found ${inputs.length} input fields`);
    
    // Fill first name (first text input)
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"]');
      if (inputs[0]) inputs[0].value = 'Test';
      if (inputs[1]) inputs[1].value = 'User';
    });
    
    // Fill email
    await page.type('input[type="email"]', 'test@example.com');
    
    // Handle OTP verification (development mode)
    const otpButton = await page.$('button');
    if (otpButton) {
      const buttonText = await page.evaluate(el => el.textContent, otpButton);
      if (buttonText && buttonText.includes('Send')) {
        await otpButton.click();
        await new Promise(r => setTimeout(r, 1000));
        
        // Enter test OTP
        const otpInput = await page.$('input[placeholder*="code"]');
        if (otpInput) {
          await otpInput.type('123456');
        }
      }
    }
    
    // Test date input
    const dateInput = await page.$('input[type="date"]');
    if (dateInput) {
      console.log('Found date input, testing validation...');
      
      // Clear and set date
      await dateInput.click({ clickCount: 3 });
      await dateInput.type('1990-01-15');
      
      await new Promise(r => setTimeout(r, 500));
      
      // Check for error message
      const errorText = await page.evaluate(() => {
        const errors = document.querySelectorAll('.text-destructive');
        return Array.from(errors).map(e => e.textContent).join(', ');
      });
      
      if (errorText && errorText.includes('valid date')) {
        console.log('❌ Date validation error still present:', errorText);
      } else {
        console.log('✅ No date validation error - Fix successful!');
      }
      
      // Check if Continue button is enabled
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && text.includes('Continue')) {
          const isDisabled = await page.evaluate(el => el.disabled, button);
          console.log('Continue button status:', isDisabled ? 'DISABLED' : 'ENABLED');
          break;
        }
      }
    } else {
      console.log('Date input not found');
    }
    
    await new Promise(r => setTimeout(r, 3000)); // Keep browser open to see result
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
