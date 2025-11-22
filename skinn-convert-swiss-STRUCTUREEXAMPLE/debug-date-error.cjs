const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  
  // Enable console logging from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  try {
    console.log('Debugging date validation error display...');
    await page.goto('http://localhost:8083/eligibility');
    await page.waitForSelector('input[type="date"]', { timeout: 5000 });
    
    // Inject debugging code
    await page.evaluate(() => {
      // Override setState to log state changes
      const originalSetState = window.React?.Component?.prototype?.setState;
      if (originalSetState) {
        window.React.Component.prototype.setState = function(...args) {
          console.log('setState called:', args);
          return originalSetState.apply(this, args);
        };
      }
      
      // Log all props for FormField components
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const errors = document.querySelectorAll('.text-destructive');
            if (errors.length > 0) {
              console.log('Error elements found:', Array.from(errors).map(e => ({
                text: e.textContent,
                html: e.innerHTML,
                parent: e.parentElement?.className
              })));
            }
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      // Try to trigger the date change
      const dateInput = document.querySelector('input[type="date"]');
      if (dateInput) {
        console.log('Setting date value...');
        dateInput.value = '2020-01-15';
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('blur', { bubbles: true }));
      }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Get the React component props
    const componentInfo = await page.evaluate(() => {
      const dateInput = document.querySelector('input[type="date"]');
      if (!dateInput) return null;
      
      // Try to find React fiber
      const reactKey = Object.keys(dateInput).find(key => key.startsWith('__react'));
      const fiber = dateInput[reactKey];
      
      // Get all text content from the form field wrapper
      const wrapper = dateInput.closest('.space-y-2');
      const allText = wrapper ? Array.from(wrapper.querySelectorAll('*')).map(el => el.textContent) : [];
      
      return {
        reactFiberFound: !!fiber,
        wrapperClass: wrapper?.className,
        allTextInWrapper: allText,
        errorElements: Array.from(document.querySelectorAll('.text-destructive')).map(e => ({
          tag: e.tagName,
          text: e.textContent,
          innerHTML: e.innerHTML,
          nextSibling: e.nextSibling?.textContent,
          previousSibling: e.previousSibling?.textContent
        }))
      };
    });
    
    console.log('Component Info:', JSON.stringify(componentInfo, null, 2));
    
    await new Promise(r => setTimeout(r, 10000));
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
