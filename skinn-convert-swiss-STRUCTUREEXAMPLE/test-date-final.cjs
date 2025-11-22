const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Date validation:') || text.includes('Age error') || text.includes('Passing ageError')) {
      console.log('CONSOLE:', text);
    }
  });
  
  try {
    console.log('Testing date validation properly...');
    await page.goto('http://localhost:8083/eligibility');
    await page.waitForSelector('input[type="date"]', { timeout: 5000 });
    
    // Fill other required fields first
    await page.evaluate(() => {
      document.querySelectorAll('input[type="text"]')[0].value = 'Test';
      document.querySelectorAll('input[type="text"]')[1].value = 'User';
      document.querySelector('input[type="email"]').value = 'test@example.com';
    });
    
    // Properly set the date value using JavaScript
    await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      if (dateInput) {
        dateInput.value = '1990-01-15';
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Check the state after setting valid date
    const afterValidDate = await page.evaluate(() => {
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
    
    console.log('After setting valid date (1990-01-15):', afterValidDate);
    
    // Now test with an invalid age (under 18)
    await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      if (dateInput) {
        dateInput.value = '2015-01-15'; // 10 years old
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    const afterYoungDate = await page.evaluate(() => {
      const errorP = document.querySelector('p.text-destructive');
      return {
        hasError: !!errorP,
        errorText: errorP?.textContent
      };
    });
    
    console.log('After setting young date (2015-01-15):', afterYoungDate);
    
    // Test with a very old date
    await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      if (dateInput) {
        dateInput.value = '1850-01-15'; // 175 years old
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    const afterOldDate = await page.evaluate(() => {
      const errorP = document.querySelector('p.text-destructive');
      return {
        hasError: !!errorP,
        errorText: errorP?.textContent
      };
    });
    
    console.log('After setting very old date (1850-01-15):', afterOldDate);
    
    await new Promise(r => setTimeout(r, 3000));
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
