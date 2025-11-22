const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * FOCUSED DESIGN SYSTEM VALIDATION TEST
 * Tests the recently updated Swiss healthcare eligibility questionnaire design system
 * Focuses on the specific requirements mentioned:
 * - Color specifications validation
 * - Component interaction testing
 * - Basic accessibility checks
 * - Responsive design verification
 * - Performance measurement
 */

class FocusedDesignSystemValidator {
  constructor() {
    this.baseUrl = 'http://localhost:8080';
    this.results = {
      colorValidation: { passed: 0, failed: 0, details: [] },
      componentInteraction: { passed: 0, failed: 0, details: [] },
      accessibility: { passed: 0, failed: 0, details: [] },
      responsive: { passed: 0, failed: 0, details: [] },
      performance: { metrics: {}, passed: 0, failed: 0 },
      overallScore: 0
    };
    
    // Expected design system colors
    this.expectedColors = {
      primaryNavy: '#004C96',
      hoverBlue: '#5298F2', 
      accentViolet: '#5549A6',
      softBeige: '#EEE8E1',
      primaryText: '#0D0D0D',
      secondaryText: '#475259'
    };
  }

  async runValidation() {
    console.log('🎯 Starting Focused Design System Validation...\n');
    
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 10000,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
      const page = await browser.newPage();
      await page.setDefaultTimeout(10000);
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Test 1: Color Specifications
      await this.validateColors(page);
      
      // Test 2: Component Interactions  
      await this.testInteractions(page);
      
      // Test 3: Basic Accessibility
      await this.checkAccessibility(page);
      
      // Test 4: Responsive Design
      await this.testResponsive(page);
      
      // Test 5: Performance Metrics
      await this.measurePerformance(page);
      
      // Generate final report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
    } finally {
      await browser.close();
    }
  }

  async validateColors(page) {
    console.log('🎨 Validating Design System Colors...');
    
    try {
      // Go to eligibility page where components are implemented
      await page.goto(`${this.baseUrl}/eligibility`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      
      // Test primary button colors
      const buttonTest = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const results = [];
        
        buttons.forEach((btn, index) => {
          const styles = window.getComputedStyle(btn);
          const bgColor = styles.backgroundColor;
          const textColor = styles.color;
          
          results.push({
            index,
            backgroundColor: bgColor,
            color: textColor,
            className: btn.className
          });
        });
        
        return results;
      });
      
      // Check for expected colors
      let correctColors = 0;
      buttonTest.forEach(button => {
        // Check if background matches primary navy
        if (button.backgroundColor === 'rgb(0, 76, 150)' || 
            button.className.includes('004C96')) {
          correctColors++;
        }
      });
      
      // Test text colors
      const textTest = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3');
        const results = [];
        
        headings.forEach((heading, index) => {
          const styles = window.getComputedStyle(heading);
          results.push({
            index,
            color: styles.color,
            tag: heading.tagName
          });
        });
        
        return results;
      });
      
      let correctTextColors = 0;
      textTest.forEach(text => {
        if (text.color === 'rgb(13, 13, 13)' || text.color === 'rgb(0, 0, 0)') {
          correctTextColors++;
        }
      });
      
      const colorScore = Math.round(((correctColors + correctTextColors) / (buttonTest.length + textTest.length)) * 100);
      
      this.results.colorValidation.details.push({
        buttonsFound: buttonTest.length,
        correctButtonColors: correctColors,
        headingsFound: textTest.length,
        correctTextColors: correctTextColors,
        score: colorScore
      });
      
      if (colorScore >= 70) {
        this.results.colorValidation.passed++;
        console.log(`  ✅ Color validation passed - Score: ${colorScore}%`);
      } else {
        this.results.colorValidation.failed++;
        console.log(`  ❌ Color validation failed - Score: ${colorScore}%`);
      }
      
    } catch (error) {
      this.results.colorValidation.failed++;
      console.log(`  ❌ Color validation error: ${error.message}`);
    }
  }

  async testInteractions(page) {
    console.log('🖱️ Testing Component Interactions...');
    
    try {
      await page.goto(`${this.baseUrl}/eligibility`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      
      // Test button hover states
      const buttons = await page.$$('button');
      let hoverTestsPassed = 0;
      
      for (let i = 0; i < Math.min(buttons.length, 3); i++) {
        try {
          const button = buttons[i];
          
          // Get initial state
          const initialStyle = await page.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              transform: styles.transform,
              boxShadow: styles.boxShadow
            };
          }, button);
          
          // Hover and check changes
          await button.hover();
          await page.waitForTimeout(200);
          
          const hoverStyle = await page.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              transform: styles.transform,
              boxShadow: styles.boxShadow
            };
          }, button);
          
          // Check if any property changed (indicating hover effect)
          const hasHoverEffect = 
            initialStyle.backgroundColor !== hoverStyle.backgroundColor ||
            initialStyle.transform !== hoverStyle.transform ||
            initialStyle.boxShadow !== hoverStyle.boxShadow;
            
          if (hasHoverEffect) {
            hoverTestsPassed++;
          }
          
        } catch (err) {
          console.log(`    Warning: Could not test button ${i}: ${err.message}`);
        }
      }
      
      // Test input focus states
      const inputs = await page.$$('input');
      let focusTestsPassed = 0;
      
      for (let i = 0; i < Math.min(inputs.length, 2); i++) {
        try {
          const input = inputs[i];
          await input.click();
          await page.waitForTimeout(100);
          
          const focusStyles = await page.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              outline: styles.outline,
              borderColor: styles.borderColor,
              boxShadow: styles.boxShadow
            };
          }, input);
          
          // Check for focus indicators
          const hasFocusState = 
            focusStyles.outline !== 'none' ||
            focusStyles.boxShadow !== 'none' ||
            focusStyles.borderColor.includes('rgb(0, 76, 150)');
            
          if (hasFocusState) {
            focusTestsPassed++;
          }
          
        } catch (err) {
          console.log(`    Warning: Could not test input ${i}: ${err.message}`);
        }
      }
      
      const totalTests = Math.min(buttons.length, 3) + Math.min(inputs.length, 2);
      const passedTests = hoverTestsPassed + focusTestsPassed;
      const interactionScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
      
      this.results.componentInteraction.details.push({
        buttonsTest: hoverTestsPassed,
        inputsTest: focusTestsPassed,
        totalTests,
        score: interactionScore
      });
      
      if (interactionScore >= 60) {
        this.results.componentInteraction.passed++;
        console.log(`  ✅ Interaction tests passed - Score: ${interactionScore}% (${passedTests}/${totalTests})`);
      } else {
        this.results.componentInteraction.failed++;
        console.log(`  ❌ Interaction tests failed - Score: ${interactionScore}% (${passedTests}/${totalTests})`);
      }
      
    } catch (error) {
      this.results.componentInteraction.failed++;
      console.log(`  ❌ Interaction test error: ${error.message}`);
    }
  }

  async checkAccessibility(page) {
    console.log('♿ Checking Basic Accessibility...');
    
    try {
      await page.goto(`${this.baseUrl}/eligibility`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      
      // Check for proper labels on inputs
      const labelTest = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        let properlyLabeled = 0;
        
        inputs.forEach(input => {
          const hasLabel = input.labels && input.labels.length > 0;
          const hasAriaLabel = input.getAttribute('aria-label');
          const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
          
          if (hasLabel || hasAriaLabel || hasAriaLabelledBy) {
            properlyLabeled++;
          }
        });
        
        return { total: inputs.length, labeled: properlyLabeled };
      });
      
      // Check for proper heading hierarchy
      const headingTest = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const hasH1 = document.querySelector('h1') !== null;
        
        return { total: headings.length, hasH1 };
      });
      
      // Check for alt text on images
      const imageTest = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        let withAlt = 0;
        
        images.forEach(img => {
          if (img.getAttribute('alt') !== null) {
            withAlt++;
          }
        });
        
        return { total: images.length, withAlt };
      });
      
      // Test keyboard navigation
      let keyboardTest = 0;
      try {
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        if (focusedElement && focusedElement !== 'BODY') {
          keyboardTest = 1;
        }
      } catch (err) {
        console.log('    Warning: Keyboard test failed');
      }
      
      const accessibilityTests = [
        { name: 'Input Labels', passed: labelTest.labeled, total: Math.max(labelTest.total, 1) },
        { name: 'Heading Structure', passed: headingTest.hasH1 ? 1 : 0, total: 1 },
        { name: 'Image Alt Text', passed: imageTest.withAlt, total: Math.max(imageTest.total, 1) },
        { name: 'Keyboard Navigation', passed: keyboardTest, total: 1 }
      ];
      
      const totalPossible = accessibilityTests.reduce((sum, test) => sum + test.total, 0);
      const totalPassed = accessibilityTests.reduce((sum, test) => sum + test.passed, 0);
      const accessibilityScore = Math.round((totalPassed / totalPossible) * 100);
      
      this.results.accessibility.details.push({
        tests: accessibilityTests,
        score: accessibilityScore
      });
      
      if (accessibilityScore >= 70) {
        this.results.accessibility.passed++;
        console.log(`  ✅ Accessibility checks passed - Score: ${accessibilityScore}%`);
      } else {
        this.results.accessibility.failed++;
        console.log(`  ❌ Accessibility checks failed - Score: ${accessibilityScore}%`);
      }
      
    } catch (error) {
      this.results.accessibility.failed++;
      console.log(`  ❌ Accessibility test error: ${error.message}`);
    }
  }

  async testResponsive(page) {
    console.log('📱 Testing Responsive Design...');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    let responsiveTestsPassed = 0;
    
    for (const viewport of viewports) {
      try {
        await page.setViewport(viewport);
        await page.goto(`${this.baseUrl}/eligibility`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);
        
        // Check for horizontal scroll
        const scrollTest = await page.evaluate(() => {
          return {
            hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            viewportWidth: document.documentElement.clientWidth,
            contentWidth: document.documentElement.scrollWidth
          };
        });
        
        // Check if buttons are adequately sized for touch
        const touchTargetTest = await page.evaluate(() => {
          const buttons = document.querySelectorAll('button');
          let adequateSize = 0;
          
          buttons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            if (rect.width >= 44 && rect.height >= 32) { // Relaxed height requirement
              adequateSize++;
            }
          });
          
          return { total: buttons.length, adequate: adequateSize };
        });
        
        const responsiveScore = (!scrollTest.hasHorizontalScroll && touchTargetTest.adequate >= touchTargetTest.total * 0.7) ? 1 : 0;
        
        if (responsiveScore) {
          responsiveTestsPassed++;
        }
        
        console.log(`  ${responsiveScore ? '✅' : '❌'} ${viewport.name} (${viewport.width}x${viewport.height}) - Touch targets: ${touchTargetTest.adequate}/${touchTargetTest.total}, Scroll: ${scrollTest.hasHorizontalScroll ? 'Yes' : 'No'}`);
        
      } catch (error) {
        console.log(`  ❌ ${viewport.name} test error: ${error.message}`);
      }
    }
    
    const responsiveScore = Math.round((responsiveTestsPassed / viewports.length) * 100);
    
    this.results.responsive.details.push({
      viewportsTested: viewports.length,
      passed: responsiveTestsPassed,
      score: responsiveScore
    });
    
    if (responsiveScore >= 70) {
      this.results.responsive.passed++;
    } else {
      this.results.responsive.failed++;
    }
    
    // Reset to desktop
    await page.setViewport({ width: 1920, height: 1080 });
  }

  async measurePerformance(page) {
    console.log('⚡ Measuring Performance...');
    
    try {
      const startTime = Date.now();
      
      await page.goto(`${this.baseUrl}/eligibility`, { waitUntil: 'domcontentloaded' });
      
      const loadTime = Date.now() - startTime;
      
      // Wait for key components
      const componentLoadStart = Date.now();
      await page.waitForSelector('button, input', { timeout: 5000 });
      const componentLoadTime = Date.now() - componentLoadStart;
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (!navigation) return null;
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart
        };
      });
      
      const performanceScore = (loadTime < 3000 && componentLoadTime < 1000) ? 100 : 
                             (loadTime < 5000 && componentLoadTime < 2000) ? 75 : 50;
      
      this.results.performance.metrics = {
        totalLoadTime: loadTime,
        componentLoadTime,
        performanceScore,
        ...metrics
      };
      
      if (performanceScore >= 75) {
        this.results.performance.passed++;
        console.log(`  ✅ Performance test passed - Load: ${loadTime}ms, Components: ${componentLoadTime}ms`);
      } else {
        this.results.performance.failed++;
        console.log(`  ❌ Performance test failed - Load: ${loadTime}ms, Components: ${componentLoadTime}ms`);
      }
      
    } catch (error) {
      this.results.performance.failed++;
      console.log(`  ❌ Performance test error: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Test Report...');
    
    const categories = Object.keys(this.results).filter(key => key !== 'overallScore');
    const totalTests = categories.reduce((sum, category) => {
      const cat = this.results[category];
      return sum + (cat.passed || 0) + (cat.failed || 0);
    }, 0);
    
    const totalPassed = categories.reduce((sum, category) => {
      const cat = this.results[category];
      return sum + (cat.passed || 0);
    }, 0);
    
    this.results.overallScore = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
    
    const report = {
      timestamp: new Date().toISOString(),
      testSuite: 'Swiss Healthcare Eligibility Questionnaire Design System Validation',
      overallScore: this.results.overallScore,
      summary: {
        totalTests,
        totalPassed,
        totalFailed: totalTests - totalPassed
      },
      results: this.results,
      recommendations: this.getRecommendations(),
      qualityAssessment: this.getQualityAssessment()
    };
    
    // Save detailed report
    const reportPath = path.join(__dirname, '..', 'archive', 'tests', `design-system-validation-${Date.now()}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('🎯 DESIGN SYSTEM VALIDATION REPORT');
    console.log('='.repeat(70));
    console.log(`📊 Overall Score: ${this.results.overallScore}/100`);
    console.log(`✅ Tests Passed: ${totalPassed}/${totalTests}`);
    console.log(`❌ Tests Failed: ${totalTests - totalPassed}/${totalTests}`);
    console.log('\n📈 Category Results:');
    console.log(`  🎨 Color Validation: ${this.results.colorValidation.passed}/${this.results.colorValidation.passed + this.results.colorValidation.failed}`);
    console.log(`  🖱️  Component Interaction: ${this.results.componentInteraction.passed}/${this.results.componentInteraction.passed + this.results.componentInteraction.failed}`);
    console.log(`  ♿ Accessibility: ${this.results.accessibility.passed}/${this.results.accessibility.passed + this.results.accessibility.failed}`);
    console.log(`  📱 Responsive Design: ${this.results.responsive.passed}/${this.results.responsive.passed + this.results.responsive.failed}`);
    console.log(`  ⚡ Performance: ${this.results.performance.passed}/${this.results.performance.passed + this.results.performance.failed}`);
    console.log('\n💡 Assessment:', report.qualityAssessment);
    console.log('\n📋 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  • ${rec}`));
    console.log(`\n💾 Full report: ${reportPath}`);
    console.log('='.repeat(70));
    
    return report;
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.results.colorValidation.failed > 0) {
      recommendations.push('Verify color implementation matches exact hex values from design specifications');
    }
    if (this.results.componentInteraction.failed > 0) {
      recommendations.push('Improve hover and focus states for better user interaction feedback');
    }
    if (this.results.accessibility.failed > 0) {
      recommendations.push('Address accessibility issues: ensure proper labels and keyboard navigation');
    }
    if (this.results.responsive.failed > 0) {
      recommendations.push('Optimize responsive design for mobile and tablet viewports');
    }
    if (this.results.performance.failed > 0) {
      recommendations.push('Improve performance: reduce load times and optimize component rendering');
    }
    if (this.results.overallScore < 80) {
      recommendations.push('Overall quality needs improvement - focus on failed categories');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Excellent implementation - design system meets quality standards');
    }
    
    return recommendations;
  }

  getQualityAssessment() {
    const score = this.results.overallScore;
    
    if (score >= 90) return 'EXCELLENT - Production Ready';
    if (score >= 80) return 'GOOD - Minor improvements recommended';
    if (score >= 70) return 'ACCEPTABLE - Some issues need attention';
    if (score >= 60) return 'NEEDS WORK - Several improvements required';
    return 'CRITICAL - Significant issues must be addressed';
  }
}

// Run the validation
if (require.main === module) {
  const validator = new FocusedDesignSystemValidator();
  validator.runValidation()
    .then(() => {
      console.log('\n✅ Design system validation completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}

module.exports = FocusedDesignSystemValidator;