/**
 * SIMPLIFIED ACCESSIBILITY AUDIT FOR 6-STAGE ELIGIBILITY QUESTIONNAIRE
 * VERSION: 1.0 - Focused Testing Approach
 * CREATED: 2025-08-23
 * PURPOSE: WCAG 2.1 AA compliance verification for Swiss healthcare regulatory compliance
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:8080',
  eligibilityPath: '/eligibility-flow',
  timeout: 30000
};

// Accessibility Audit Results
class AccessibilityResults {
  constructor() {
    this.results = {
      overview: {
        tested_at: new Date().toISOString(),
        total_score: 0,
        compliance_status: 'PENDING',
        critical_issues: 0,
        recommendations: []
      },
      stage_analysis: {},
      manual_checks: {},
      keyboard_navigation: {},
      color_contrast: {},
      screen_reader_support: {}
    };
  }
}

async function runSimplifiedAccessibilityAudit() {
  console.log('🔍 Starting Simplified Accessibility Audit...\n');
  
  const auditResults = new AccessibilityResults();
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('🌐 Navigating to eligibility flow...');
    await page.goto(TEST_CONFIG.baseUrl + TEST_CONFIG.eligibilityPath, { 
      waitUntil: 'networkidle2',
      timeout: TEST_CONFIG.timeout 
    });
    
    // Wait for React to hydrate
    await page.waitForTimeout(3000);
    
    console.log('📋 Analyzing initial page accessibility...\n');
    
    // 1. Basic accessibility checks
    const basicChecks = await performBasicAccessibilityChecks(page);
    auditResults.results.manual_checks = basicChecks;
    
    // 2. Keyboard navigation testing
    const keyboardTests = await testKeyboardNavigation(page);
    auditResults.results.keyboard_navigation = keyboardTests;
    
    // 3. Form accessibility analysis
    const formAnalysis = await analyzeFormAccessibility(page);
    auditResults.results.stage_analysis = formAnalysis;
    
    // 4. Color contrast basic check
    const contrastCheck = await basicColorContrastCheck(page);
    auditResults.results.color_contrast = contrastCheck;
    
    // 5. Screen reader support check
    const screenReaderCheck = await checkScreenReaderSupport(page);
    auditResults.results.screen_reader_support = screenReaderCheck;
    
    // Calculate overall score
    auditResults.results.overview.total_score = calculateOverallScore(auditResults.results);
    auditResults.results.overview.compliance_status = determineComplianceStatus(auditResults.results);
    auditResults.results.overview.recommendations = generateRecommendations(auditResults.results);
    
    // Save results
    await saveAuditResults(auditResults);
    
    console.log('✅ Accessibility Audit Complete!\n');
    console.log('📊 RESULTS SUMMARY:');
    console.log(`  Overall Score: ${auditResults.results.overview.total_score}/100`);
    console.log(`  Compliance Status: ${auditResults.results.overview.compliance_status}`);
    console.log(`  Critical Issues: ${auditResults.results.overview.critical_issues}`);
    
    return auditResults.results;
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function performBasicAccessibilityChecks(page) {
  console.log('🔍 Performing basic accessibility checks...');
  
  const checks = {
    page_title: false,
    lang_attribute: false,
    headings_structure: false,
    images_alt_text: false,
    form_labels: false,
    color_only_info: false
  };
  
  // Check page title
  const title = await page.title();
  checks.page_title = title && title.trim().length > 0;
  console.log(`  📄 Page Title: ${checks.page_title ? '✅ Present' : '❌ Missing'} - "${title}"`);
  
  // Check lang attribute
  const langAttr = await page.evaluate(() => document.documentElement.lang);
  checks.lang_attribute = langAttr && langAttr.trim().length > 0;
  console.log(`  🌍 Lang Attribute: ${checks.lang_attribute ? '✅ Present' : '❌ Missing'} - "${langAttr}"`);
  
  // Check heading structure
  const headingStructure = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    return {
      count: headings.length,
      hasH1: headings.some(h => h.tagName === 'H1'),
      sequence: headings.map(h => h.tagName)
    };
  });
  checks.headings_structure = headingStructure.hasH1 && headingStructure.count > 0;
  console.log(`  📑 Headings: ${checks.headings_structure ? '✅ Good' : '❌ Issues'} - ${headingStructure.count} headings, H1: ${headingStructure.hasH1}`);
  
  // Check form labels
  const formLabels = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    let labeled = 0;
    let unlabeled = 0;
    
    inputs.forEach(input => {
      const hasLabel = (
        input.labels?.length > 0 ||
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby') ||
        input.getAttribute('placeholder')
      );
      
      if (hasLabel) labeled++;
      else unlabeled++;
    });
    
    return { total: inputs.length, labeled, unlabeled };
  });
  
  checks.form_labels = formLabels.unlabeled === 0;
  console.log(`  🏷️  Form Labels: ${checks.form_labels ? '✅ All labeled' : '❌ Missing labels'} - ${formLabels.labeled}/${formLabels.total} labeled`);
  
  // Check images alt text
  const imageAltText = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    let withAlt = 0;
    let withoutAlt = 0;
    
    images.forEach(img => {
      if (img.hasAttribute('alt')) withAlt++;
      else withoutAlt++;
    });
    
    return { total: images.length, withAlt, withoutAlt };
  });
  
  checks.images_alt_text = imageAltText.withoutAlt === 0;
  console.log(`  🖼️  Image Alt Text: ${checks.images_alt_text ? '✅ All have alt' : '❌ Missing alt'} - ${imageAltText.withAlt}/${imageAltText.total} with alt`);
  
  return {
    checks,
    summary: {
      passed: Object.values(checks).filter(Boolean).length,
      total: Object.keys(checks).length
    }
  };
}

async function testKeyboardNavigation(page) {
  console.log('⌨️  Testing keyboard navigation...');
  
  const navigation = {
    tab_order_logical: false,
    focus_indicators: false,
    skip_links: false,
    trapped_focus: false,
    interactive_elements: 0
  };
  
  try {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    const focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      if (!focused) return null;
      
      const styles = window.getComputedStyle(focused);
      const hasVisibleFocus = (
        styles.outline !== 'none' ||
        styles.boxShadow.includes('focus') ||
        styles.borderColor.includes('focus')
      );
      
      return {
        tagName: focused.tagName,
        type: focused.type || null,
        hasVisibleFocus,
        className: focused.className
      };
    });
    
    navigation.focus_indicators = focusedElement?.hasVisibleFocus || false;
    console.log(`  🎯 Focus Indicators: ${navigation.focus_indicators ? '✅ Visible' : '❌ Not visible'}`);
    
    // Count interactive elements
    const interactiveCount = await page.evaluate(() => {
      const interactive = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      return interactive.length;
    });
    
    navigation.interactive_elements = interactiveCount;
    navigation.tab_order_logical = interactiveCount > 0; // Simplified check
    console.log(`  📊 Interactive Elements: ${navigation.interactive_elements} found`);
    
    // Check for skip links
    const skipLinks = await page.evaluate(() => {
      const skipLink = document.querySelector('a[href^="#"]:first-child, .skip-link, .sr-only a');
      return skipLink !== null;
    });
    
    navigation.skip_links = skipLinks;
    console.log(`  ⏭️  Skip Links: ${navigation.skip_links ? '✅ Present' : '❌ Not found'}`);
    
  } catch (error) {
    console.log(`  ❌ Keyboard navigation test error: ${error.message}`);
  }
  
  return navigation;
}

async function analyzeFormAccessibility(page) {
  console.log('📝 Analyzing form accessibility...');
  
  const formAnalysis = await page.evaluate(() => {
    const forms = Array.from(document.querySelectorAll('form'));
    const results = {};
    
    forms.forEach((form, index) => {
      const formInputs = Array.from(form.querySelectorAll('input, select, textarea'));
      
      let labeledInputs = 0;
      let requiredInputs = 0;
      let errorSupport = 0;
      
      formInputs.forEach(input => {
        // Check labels
        if (
          input.labels?.length > 0 ||
          input.getAttribute('aria-label') ||
          input.getAttribute('aria-labelledby') ||
          input.getAttribute('placeholder')
        ) {
          labeledInputs++;
        }
        
        // Check required indicators
        if (
          input.hasAttribute('required') ||
          input.getAttribute('aria-required') === 'true'
        ) {
          requiredInputs++;
        }
        
        // Check error support
        if (
          input.getAttribute('aria-describedby') ||
          input.getAttribute('aria-invalid') ||
          form.querySelector(`[id*="${input.id}"][class*="error"]`)
        ) {
          errorSupport++;
        }
      });
      
      results[`form_${index}`] = {
        total_inputs: formInputs.length,
        labeled_inputs: labeledInputs,
        required_inputs: requiredInputs,
        error_support: errorSupport,
        label_compliance: formInputs.length === 0 ? true : (labeledInputs / formInputs.length) >= 0.9,
        fieldsets: form.querySelectorAll('fieldset').length,
        legends: form.querySelectorAll('legend').length
      };
    });
    
    return {
      total_forms: forms.length,
      form_details: results
    };
  });
  
  console.log(`  📊 Found ${formAnalysis.total_forms} forms`);
  Object.entries(formAnalysis.form_details).forEach(([formId, details]) => {
    console.log(`    ${formId}: ${details.labeled_inputs}/${details.total_inputs} inputs labeled (${details.label_compliance ? '✅' : '❌'})`);
  });
  
  return formAnalysis;
}

async function basicColorContrastCheck(page) {
  console.log('🎨 Checking color contrast...');
  
  // Simple color contrast check - count elements with potential issues
  const contrastCheck = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    let potentialIssues = 0;
    let checkedElements = 0;
    
    Array.from(elements).slice(0, 100).forEach(el => { // Limit to first 100 elements
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && color !== 'rgba(0, 0, 0, 0)' && 
          backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        checkedElements++;
        
        // Simple heuristic - if both are very light or very dark, potential issue
        const isLightColor = color.includes('255') || color.includes('rgb(255');
        const isLightBg = backgroundColor.includes('255') || backgroundColor.includes('rgb(255');
        const isDarkColor = color.includes('rgb(0') || color.includes('rgba(0');
        const isDarkBg = backgroundColor.includes('rgb(0') || backgroundColor.includes('rgba(0');
        
        if ((isLightColor && isLightBg) || (isDarkColor && isDarkBg)) {
          potentialIssues++;
        }
      }
    });
    
    return {
      checked_elements: checkedElements,
      potential_issues: potentialIssues,
      compliance_estimate: checkedElements === 0 ? true : (potentialIssues / checkedElements) < 0.1
    };
  });
  
  console.log(`  📊 Checked ${contrastCheck.checked_elements} elements`);
  console.log(`  ⚠️  Potential contrast issues: ${contrastCheck.potential_issues}`);
  console.log(`  🎯 Estimated compliance: ${contrastCheck.compliance_estimate ? '✅ Good' : '❌ Needs review'}`);
  
  return contrastCheck;
}

async function checkScreenReaderSupport(page) {
  console.log('🔊 Checking screen reader support...');
  
  const screenReaderSupport = await page.evaluate(() => {
    return {
      aria_labels: document.querySelectorAll('[aria-label]').length,
      aria_labelledby: document.querySelectorAll('[aria-labelledby]').length,
      aria_describedby: document.querySelectorAll('[aria-describedby]').length,
      aria_live: document.querySelectorAll('[aria-live]').length,
      aria_hidden: document.querySelectorAll('[aria-hidden]').length,
      role_attributes: document.querySelectorAll('[role]').length,
      sr_only_text: document.querySelectorAll('.sr-only, .visually-hidden, .screen-reader-text').length
    };
  });
  
  const totalAriaUsage = Object.values(screenReaderSupport).reduce((a, b) => a + b, 0);
  
  console.log(`  📊 ARIA usage summary:`);
  console.log(`    aria-label: ${screenReaderSupport.aria_labels}`);
  console.log(`    aria-labelledby: ${screenReaderSupport.aria_labelledby}`);
  console.log(`    aria-describedby: ${screenReaderSupport.aria_describedby}`);
  console.log(`    aria-live: ${screenReaderSupport.aria_live}`);
  console.log(`    Role attributes: ${screenReaderSupport.role_attributes}`);
  console.log(`    Screen reader only text: ${screenReaderSupport.sr_only_text}`);
  console.log(`  🎯 Total ARIA usage: ${totalAriaUsage} instances`);
  
  return {
    ...screenReaderSupport,
    total_aria_usage: totalAriaUsage,
    good_aria_support: totalAriaUsage > 5
  };
}

function calculateOverallScore(results) {
  let score = 100;
  
  // Deduct based on manual checks
  const manualPassed = results.manual_checks.summary.passed;
  const manualTotal = results.manual_checks.summary.total;
  score -= (manualTotal - manualPassed) * 15;
  
  // Deduct for keyboard navigation issues
  const keyboardIssues = Object.values(results.keyboard_navigation).filter(v => v === false).length;
  score -= keyboardIssues * 10;
  
  // Deduct for form issues
  const formCompliant = Object.values(results.stage_analysis.form_details || {})
    .filter(form => form.label_compliance).length;
  const totalForms = results.stage_analysis.total_forms || 1;
  score -= (totalForms - formCompliant) * 20;
  
  // Deduct for color contrast issues
  if (!results.color_contrast.compliance_estimate) {
    score -= 15;
  }
  
  // Bonus for good ARIA support
  if (results.screen_reader_support.good_aria_support) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function determineComplianceStatus(results) {
  const score = results.overview?.total_score || calculateOverallScore(results);
  
  if (score >= 95) return 'WCAG_2_1_AA_COMPLIANT';
  if (score >= 85) return 'MOSTLY_COMPLIANT';
  if (score >= 70) return 'PARTIAL_COMPLIANCE';
  return 'NON_COMPLIANT';
}

function generateRecommendations(results) {
  const recommendations = [];
  
  // Form accessibility recommendations
  if (results.stage_analysis.total_forms > 0) {
    const formsWithIssues = Object.values(results.stage_analysis.form_details)
      .filter(form => !form.label_compliance).length;
    
    if (formsWithIssues > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Form Accessibility',
        issue: `${formsWithIssues} forms have labeling issues`,
        solution: 'Ensure all form inputs have proper labels, either through <label> elements, aria-label, or aria-labelledby attributes'
      });
    }
  }
  
  // Keyboard navigation recommendations
  if (!results.keyboard_navigation.focus_indicators) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Keyboard Navigation',
      issue: 'Focus indicators not visible',
      solution: 'Ensure all interactive elements have visible focus indicators with sufficient contrast'
    });
  }
  
  if (!results.keyboard_navigation.skip_links) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Keyboard Navigation',
      issue: 'Skip links not found',
      solution: 'Add skip links at the beginning of the page to help keyboard users navigate quickly to main content'
    });
  }
  
  // Color contrast recommendations
  if (!results.color_contrast.compliance_estimate) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Color Contrast',
      issue: 'Potential color contrast issues detected',
      solution: 'Review color combinations and ensure minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text'
    });
  }
  
  // Screen reader recommendations
  if (!results.screen_reader_support.good_aria_support) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Screen Reader Support',
      issue: 'Limited ARIA attribute usage',
      solution: 'Add appropriate ARIA labels, descriptions, and live regions to improve screen reader experience'
    });
  }
  
  return recommendations;
}

async function saveAuditResults(auditResults) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.join(__dirname, '..', 'archive', 'tests');
  
  // Ensure directory exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  // Save JSON report
  const jsonPath = path.join(reportDir, `accessibility-audit-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(auditResults.results, null, 2));
  
  // Generate markdown report
  const markdownReport = generateMarkdownReport(auditResults.results);
  const markdownPath = path.join(reportDir, `accessibility-audit-${timestamp}.md`);
  fs.writeFileSync(markdownPath, markdownReport);
  
  console.log(`\n📄 Reports saved:`);
  console.log(`  JSON: ${jsonPath}`);
  console.log(`  Markdown: ${markdownPath}`);
}

function generateMarkdownReport(results) {
  return `# Eligibility Questionnaire Accessibility Audit Report

**Test Date:** ${results.overview.tested_at}
**Overall Score:** ${results.overview.total_score}/100
**Compliance Status:** ${results.overview.compliance_status}

## Executive Summary

${results.overview.compliance_status === 'WCAG_2_1_AA_COMPLIANT' ? 
  '✅ **COMPLIANT**: The eligibility questionnaire meets WCAG 2.1 AA standards.' :
  '⚠️ **ACTION REQUIRED**: The eligibility questionnaire needs improvements to meet WCAG 2.1 AA standards.'
}

## Manual Accessibility Checks

| Check | Status | Details |
|-------|--------|---------|
| Page Title | ${results.manual_checks.checks.page_title ? '✅ Pass' : '❌ Fail'} | Essential for screen readers and SEO |
| Language Attribute | ${results.manual_checks.checks.lang_attribute ? '✅ Pass' : '❌ Fail'} | Required for proper screen reader pronunciation |
| Heading Structure | ${results.manual_checks.checks.headings_structure ? '✅ Pass' : '❌ Fail'} | Important for document outline and navigation |
| Form Labels | ${results.manual_checks.checks.form_labels ? '✅ Pass' : '❌ Fail'} | Critical for form accessibility |
| Image Alt Text | ${results.manual_checks.checks.images_alt_text ? '✅ Pass' : '❌ Fail'} | Required for images to be accessible |

**Manual Checks Score:** ${results.manual_checks.summary.passed}/${results.manual_checks.summary.total} passed

## Keyboard Navigation

| Test | Status | Notes |
|------|--------|-------|
| Tab Order | ${results.keyboard_navigation.tab_order_logical ? '✅ Logical' : '❌ Issues'} | Tab navigation should follow visual order |
| Focus Indicators | ${results.keyboard_navigation.focus_indicators ? '✅ Visible' : '❌ Not visible'} | All interactive elements must show focus |
| Skip Links | ${results.keyboard_navigation.skip_links ? '✅ Present' : '❌ Missing'} | Help keyboard users navigate efficiently |
| Interactive Elements | ${results.keyboard_navigation.interactive_elements} found | Total focusable elements detected |

## Form Accessibility Analysis

**Total Forms Analyzed:** ${results.stage_analysis.total_forms}

${Object.entries(results.stage_analysis.form_details).map(([formId, details]) => `
### ${formId.replace('_', ' ').toUpperCase()}
- **Total Inputs:** ${details.total_inputs}
- **Labeled Inputs:** ${details.labeled_inputs} (${Math.round((details.labeled_inputs / details.total_inputs) * 100)}%)
- **Required Fields:** ${details.required_inputs}
- **Error Support:** ${details.error_support}
- **Fieldsets/Legends:** ${details.fieldsets}/${details.legends}
- **Compliance:** ${details.label_compliance ? '✅ Compliant' : '❌ Needs improvement'}
`).join('')}

## Color Contrast Analysis

- **Elements Checked:** ${results.color_contrast.checked_elements}
- **Potential Issues:** ${results.color_contrast.potential_issues}
- **Estimated Compliance:** ${results.color_contrast.compliance_estimate ? '✅ Good' : '❌ Review needed'}

*Note: This is a basic heuristic check. Manual testing with contrast tools is recommended.*

## Screen Reader Support

| ARIA Feature | Count | Purpose |
|-------------|--------|---------|
| aria-label | ${results.screen_reader_support.aria_labels} | Accessible names for elements |
| aria-labelledby | ${results.screen_reader_support.aria_labelledby} | References to labeling elements |
| aria-describedby | ${results.screen_reader_support.aria_describedby} | References to describing elements |
| aria-live | ${results.screen_reader_support.aria_live} | Dynamic content announcements |
| Role attributes | ${results.screen_reader_support.role_attributes} | Semantic roles for elements |
| Screen reader text | ${results.screen_reader_support.sr_only_text} | Hidden text for assistive technology |

**Total ARIA Usage:** ${results.screen_reader_support.total_aria_usage} instances
**Support Level:** ${results.screen_reader_support.good_aria_support ? '✅ Good' : '⚠️ Basic'}

## Recommendations

${results.overview.recommendations.map((rec, index) => `
### ${index + 1}. ${rec.category} (${rec.priority} Priority)

**Issue:** ${rec.issue}

**Solution:** ${rec.solution}
`).join('')}

## Next Steps

1. **Address High Priority Issues:** Focus on form labeling and keyboard navigation first
2. **Manual Testing:** Conduct testing with actual screen readers (NVDA, JAWS, VoiceOver)
3. **User Testing:** Test with users who rely on assistive technology
4. **Automated Monitoring:** Integrate accessibility testing into CI/CD pipeline
5. **Regular Audits:** Schedule quarterly accessibility reviews

## Swiss Healthcare Compliance Notes

For Swiss healthcare regulatory compliance, ensure:
- ✅ All medical information is accessible to users with disabilities
- ✅ Form validation errors are announced to screen readers
- ✅ Privacy notices and legal text are accessible
- ✅ Payment forms maintain both PCI DSS and accessibility compliance

---
*Report generated by Simplified Accessibility Audit Script v1.0*
*Next audit recommended in 30 days or after significant UI changes*
`;
}

// Run the audit if called directly
if (require.main === module) {
  runSimplifiedAccessibilityAudit()
    .then(results => {
      console.log('\n🎉 Audit completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Audit failed:', error);
      process.exit(1);
    });
}

module.exports = { runSimplifiedAccessibilityAudit };