const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Date validation:') || text.includes('DateOfBirthSection')) {
      console.log('LOG:', text);
    }
  });
  
  try {
    console.log('Testing with real user input simulation...');
    await page.goto('http://localhost:8083/eligibility');
    await page.waitForSelector('input[type="date"]', { timeout: 5000 });
    
    // Fill required fields
    await page.type('input[type="text"]:nth-of-type(1)', 'Test');
    await page.type('input[id="lastName"]', 'User');
    await page.type('input[type="email"]', 'test@example.com');
    
    // Clear and focus the date input
    const dateInput = await page.$('input[type="date"]');
    await dateInput.click({ clickCount: 3 });
    
    // Type the date with keyboard simulation
    await page.keyboard.type('01151990');
    await page.keyboard.press('Tab');
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Check result
    let result = await page.evaluate(() => {
      const errorP = document.querySelector('p.text-destructive');
      const dateInput = document.querySelector('input[type="date"]');
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue'));
      
      return {
        dateValue: dateInput?.value,
        hasError: !!errorP,
        errorText: errorP?.textContent,
        continueDisabled: continueBtn?.disabled
      };
    });
    
    console.log('After typing valid date (01/15/1990):', result);
    
    // Handle OTP requirement for email verification
    const sendOtpBtn = await page.$('button:has-text("Send Code")');
    if (sendOtpBtn) {
      await sendOtpBtn.click();
      await new Promise(r => setTimeout(r, 500));
      
      // Enter test OTP (development mode)
      const otpInputs = await page.$$('input[maxlength="1"]');
      if (otpInputs.length === 6) {
        for (let i = 0; i < 6; i++) {
          await otpInputs[i].type('1');
        }
      }
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Check if we can proceed now
    result = await page.evaluate(() => {
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue'));
      return {
        continueEnabled: continueBtn ? !continueBtn.disabled : false,
        buttonText: continueBtn?.textContent
      };
    });
    
    console.log('Final state - Can proceed:', result);
    
    // Try to click Continue if enabled
    if (result.continueEnabled) {
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) {
        await continueBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        
        // Check if we moved to next stage
        const newStage = await page.evaluate(() => {
          const title = document.querySelector('h2, h3');
          return title?.textContent;
        });
        
        console.log('After clicking Continue, new stage title:', newStage);
      }
    }
    
    await new Promise(r => setTimeout(r, 3000));
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
