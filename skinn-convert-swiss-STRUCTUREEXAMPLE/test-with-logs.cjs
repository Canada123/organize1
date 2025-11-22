const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    if (!msg.text().includes('[vite]') && !msg.text().includes('Download the React')) {
      console.log('CONSOLE:', msg.text());
    }
  });
  
  try {
    console.log('Testing with console logs...');
    await page.goto('http://localhost:8083/eligibility');
    await page.waitForSelector('input[type="date"]', { timeout: 5000 });
    
    // Type in the date field
    await page.type('input[type="date"]', '1990-01-15');
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Trigger change event
    await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      if (dateInput) {
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        dateInput.dispatchEvent(new Event('blur', { bubbles: true }));
      }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Check final state
    const finalState = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('.text-destructive'));
      const dateInput = document.querySelector('input[type="date"]');
      const errorP = document.querySelector('p.text-destructive');
      
      return {
        dateValue: dateInput?.value,
        errorCount: errors.length,
        errorTexts: errors.map(e => e.textContent),
        hasParagraphError: !!errorP,
        paragraphErrorText: errorP?.textContent
      };
    });
    
    console.log('Final state:', finalState);
    
    await new Promise(r => setTimeout(r, 3000));
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
