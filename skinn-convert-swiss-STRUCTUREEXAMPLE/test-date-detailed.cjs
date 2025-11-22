const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Testing date validation in detail...');
    await page.goto('http://localhost:8083/eligibility');
    await page.waitForSelector('input', { timeout: 5000 });
    
    // Get all text content that includes "Date"
    const dateRelated = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .filter(el => el.textContent && el.textContent.includes('Date'))
        .map(el => ({
          tag: el.tagName,
          class: el.className,
          text: el.textContent.substring(0, 100)
        }));
    });
    
    console.log('Date-related elements:', dateRelated.slice(0, 5));
    
    // Check the actual structure
    const dateFieldStructure = await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      if (!dateInput) return null;
      
      const parent = dateInput.parentElement;
      const grandparent = parent?.parentElement;
      
      return {
        inputId: dateInput.id,
        inputValue: dateInput.value,
        inputMax: dateInput.max,
        parentClass: parent?.className,
        grandparentClass: grandparent?.className,
        label: grandparent?.querySelector('label')?.textContent,
        error: grandparent?.querySelector('.text-destructive')?.textContent
      };
    });
    
    console.log('Date field structure:', dateFieldStructure);
    
    // Try to set a date value directly
    await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      if (dateInput) {
        dateInput.value = '1990-01-15';
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Check the error after setting date
    const afterSetting = await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      const grandparent = dateInput?.parentElement?.parentElement;
      return {
        inputValue: dateInput?.value,
        errorText: grandparent?.querySelector('.text-destructive')?.textContent,
        allErrors: Array.from(document.querySelectorAll('.text-destructive')).map(e => e.textContent)
      };
    });
    
    console.log('After setting date:', afterSetting);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
  }
})();
