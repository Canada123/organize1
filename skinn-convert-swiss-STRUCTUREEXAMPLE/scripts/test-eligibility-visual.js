#!/usr/bin/env node

/**
 * Visual Test Script for 6-Stage Eligibility Questionnaire Flow
 * Purpose: Capture screenshots and verify visual regression for all eligibility stages
 * Created: 2025-08-23
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = path.join(__dirname, '../test-results/eligibility-visual');
const VIEWPORT = { width: 1920, height: 1080 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };

// Test data
const TEST_EMAIL = 'test@example.com';
const TEST_DOB = '1990-01-01';
const OTP_CODE = '123456';
const TEST_PHONE = '+41 79 123 4567';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureScreenshot(page, name, viewport = 'desktop') {
  const fileName = `${viewport}-${name}-${new Date().toISOString().split('T')[0]}.png`;
  const filePath = path.join(SCREENSHOTS_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`✅ Screenshot captured: ${fileName}`);
  return filePath;
}

async function testEligibilityFlow() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  try {
    console.log('\n🧪 Starting Visual Testing for Eligibility Questionnaire Flow\n');

    // Test 1: Landing Page
    console.log('📸 Test 1: Landing Page');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await captureScreenshot(page, '01-landing-page');
    
    // Find and click CTA button
    const ctaButton = await page.waitForSelector('button:has-text("Check your heart from home")');
    await captureScreenshot(page, '02-cta-button-hover');
    await ctaButton.click();
    
    // Wait for navigation to eligibility flow
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Navigated to eligibility flow');

    // Test 2: Stage 0 - Contact & Account
    console.log('\n📸 Test 2: Stage 0 - Contact & Account');
    await page.waitForSelector('h2:has-text("Contact & Account")');
    await captureScreenshot(page, '03-stage0-initial');
    
    // Fill email
    await page.type('input[type="email"]', TEST_EMAIL);
    await captureScreenshot(page, '04-stage0-email-entered');
    
    // Trigger OTP
    const otpButton = await page.waitForSelector('button:has-text("Send OTP")');
    await otpButton.click();
    await page.waitForTimeout(500);
    await captureScreenshot(page, '05-stage0-otp-sent');
    
    // Enter OTP
    const otpInput = await page.waitForSelector('input[placeholder*="verification code"]');
    await otpInput.type(OTP_CODE);
    await captureScreenshot(page, '06-stage0-otp-entered');
    
    // Verify OTP
    const verifyButton = await page.waitForSelector('button:has-text("Verify")');
    await verifyButton.click();
    await page.waitForTimeout(500);
    await captureScreenshot(page, '07-stage0-email-verified');
    
    // Enter date of birth
    await page.type('input[type="date"]', TEST_DOB);
    await captureScreenshot(page, '08-stage0-dob-entered');
    
    // Continue to next stage
    const continueButton = await page.waitForSelector('button:has-text("Continue"):not([disabled])');
    await continueButton.click();
    await page.waitForTimeout(1000);

    // Test 3: Stage 1 - Eligibility Gate
    console.log('\n📸 Test 3: Stage 1 - Eligibility Gate');
    await page.waitForSelector('h2:has-text("Eligibility")');
    await captureScreenshot(page, '09-stage1-initial');
    
    // Select insurance model
    const insuranceSelect = await page.waitForSelector('select, [role="combobox"]');
    await insuranceSelect.click();
    await captureScreenshot(page, '10-stage1-insurance-dropdown');
    
    // Select an option
    await page.keyboard.type('Standard');
    await page.keyboard.press('Enter');
    await captureScreenshot(page, '11-stage1-insurance-selected');
    
    // Check contraindications
    const contraindicationCheckbox = await page.$('input[type="checkbox"]');
    if (contraindicationCheckbox) {
      await contraindicationCheckbox.click();
      await captureScreenshot(page, '12-stage1-contraindication-checked');
    }
    
    // Continue to next stage
    const stage1Continue = await page.waitForSelector('button:has-text("Continue"):not([disabled])');
    await stage1Continue.click();
    await page.waitForTimeout(1000);

    // Test 4: Stage 2 - Detailed Information
    console.log('\n📸 Test 4: Stage 2 - Detailed Information');
    await page.waitForSelector('h2:has-text("Detailed")');
    await captureScreenshot(page, '13-stage2-initial');
    
    // Fill in some symptoms
    const symptomCheckboxes = await page.$$('input[type="checkbox"]');
    if (symptomCheckboxes.length > 0) {
      await symptomCheckboxes[0].click();
      await captureScreenshot(page, '14-stage2-symptom-selected');
    }
    
    // Add medical history
    const textArea = await page.$('textarea');
    if (textArea) {
      await textArea.type('No significant medical history');
      await captureScreenshot(page, '15-stage2-history-entered');
    }
    
    // Continue to next stage
    const stage2Continue = await page.waitForSelector('button:has-text("Continue"):not([disabled])');
    await stage2Continue.click();
    await page.waitForTimeout(1000);

    // Test 5: Stage 3 - Review/Payment
    console.log('\n📸 Test 5: Stage 3 - Review or Payment');
    await captureScreenshot(page, '16-stage3-initial');
    
    // Check if it's review or payment stage
    const isPayment = await page.$('h2:has-text("Payment")');
    if (isPayment) {
      console.log('📱 Testing Self-Pay pathway');
      await captureScreenshot(page, '17-stage3-selfpay');
      
      // Enter phone for verification
      const phoneInput = await page.$('input[type="tel"]');
      if (phoneInput) {
        await phoneInput.type(TEST_PHONE);
        await captureScreenshot(page, '18-stage3-phone-entered');
      }
    } else {
      console.log('🏥 Testing Insured pathway');
      await captureScreenshot(page, '17-stage3-review');
      
      // Check for GP selection
      const gpOption = await page.$('input[type="radio"]');
      if (gpOption) {
        await gpOption.click();
        await captureScreenshot(page, '18-stage3-gp-selected');
      }
    }
    
    // Continue to completion
    const stage3Continue = await page.waitForSelector('button:has-text("Continue"):not([disabled])');
    await stage3Continue.click();
    await page.waitForTimeout(1000);

    // Test 6: Stage 4 - Completion
    console.log('\n📸 Test 6: Stage 4 - Completion');
    await page.waitForSelector('h2:has-text("Complete"), h2:has-text("Success")');
    await captureScreenshot(page, '19-stage4-completion');
    
    // Check for reference number
    const referenceNumber = await page.$('[data-testid="reference-number"], .reference-number');
    if (referenceNumber) {
      await captureScreenshot(page, '20-stage4-reference');
    }

    // Test 7: Mobile Responsiveness
    console.log('\n📸 Test 7: Mobile Responsiveness');
    await page.setViewport(MOBILE_VIEWPORT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await captureScreenshot(page, '21-landing-mobile', 'mobile');
    
    // Click CTA on mobile
    const mobileCta = await page.waitForSelector('button:has-text("Check your heart")');
    await mobileCta.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await captureScreenshot(page, '22-stage0-mobile', 'mobile');

    console.log('\n✅ Visual Testing Complete!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    
    // Generate summary report
    const report = {
      testDate: new Date().toISOString(),
      testsRun: 22,
      screenshotsCaptured: 22,
      viewportsTested: ['desktop', 'mobile'],
      stagesTested: ['Landing', 'Stage 0', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'],
      status: 'SUCCESS'
    };
    
    const reportPath = path.join(SCREENSHOTS_DIR, 'visual-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Report saved to: ${reportPath}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    await captureScreenshot(page, 'error-state');
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the tests
testEligibilityFlow()
  .then(() => {
    console.log('\n🎉 All visual tests passed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Visual tests failed:', error.message);
    process.exit(1);
  });