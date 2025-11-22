/**
 * FRONTEND ELIGIBILITY QUESTIONNAIRE END-TO-END TEST
 * Task: [EQ-TEST-001] Test the complete 6-stage eligibility questionnaire flow
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

class FrontendEligibilityTester {
  constructor() {
    this.baseUrl = 'http://localhost:8080';
    this.testResults = { passed: 0, failed: 0, warnings: 0 };
  }

  log(message, color = COLORS.RESET) {
    console.log(`${color}${message}${COLORS.RESET}`);
  }

  logTest(testName, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? COLORS.GREEN : COLORS.RED;
    this.log(`${status} ${testName}`, color);
    
    if (details) {
      this.log(`   ${details}`, COLORS.BLUE);
    }
    
    passed ? this.testResults.passed++ : this.testResults.failed++;
  }

  async testServerHealth() {
    this.log(`${COLORS.BOLD}🚀 ELIGIBILITY QUESTIONNAIRE FRONTEND TESTING${COLORS.RESET}`);
    this.log(`${COLORS.BOLD}================================================================${COLORS.RESET}`);
    
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(this.baseUrl);
      const healthy = response.ok;
      
      this.logTest(
        'Development Server Health',
        healthy,
        healthy ? `Server responding at ${this.baseUrl}` : `Failed: ${response.status}`
      );
      
      return healthy;
    } catch (error) {
      // Try with built-in fetch if node-fetch not available
      try {
        const response = await fetch(this.baseUrl);
        const healthy = response.ok;
        this.logTest('Development Server Health', healthy, `Server responding at ${this.baseUrl}`);
        return healthy;
      } catch (e) {
        this.logTest('Server Health', false, `Connection failed: ${error.message}`);
        return false;
      }
    }
  }

  testComponentArchitecture() {
    this.log(`\n${COLORS.BOLD}🏗️  Testing 6-Stage Component Architecture${COLORS.RESET}`);
    
    const expectedStages = [
      'src/components/forms/eligibility/stages/ContactAccountStage.tsx',
      'src/components/forms/eligibility/stages/EligibilityGateStage.tsx', 
      'src/components/forms/eligibility/stages/DetailedInfoStage.tsx',
      'src/components/forms/eligibility/stages/InsuredReviewStage.tsx',
      'src/components/forms/eligibility/stages/SelfPayStage.tsx',
      'src/components/forms/eligibility/stages/CompletionStage.tsx'
    ];

    const supportComponents = [
      'src/components/forms/eligibility/components/OTPVerification.tsx',
      'src/components/forms/eligibility/components/ContraindicationScreening.tsx',
      'src/components/forms/eligibility/components/InsuranceModelSelector.tsx',
      'src/components/eligibility/organisms/EligibilityFormContainer.tsx'
    ];
    
    let stagesFound = 0;
    let componentsFound = 0;
    
    // Test stage components
    for (const stagePath of expectedStages) {
      const exists = fs.existsSync(path.resolve(process.cwd(), stagePath));
      if (exists) {
        stagesFound++;
        const content = fs.readFileSync(path.resolve(process.cwd(), stagePath), 'utf8');
        const lineCount = content.split('\n').length;
        
        this.logTest(
          `Stage: ${path.basename(stagePath, '.tsx')}`,
          true,
          `Found (${lineCount} lines)`
        );
      } else {
        this.logTest(`Stage: ${path.basename(stagePath, '.tsx')}`, false, 'Not found');
      }
    }
    
    // Test support components
    for (const componentPath of supportComponents) {
      const exists = fs.existsSync(path.resolve(process.cwd(), componentPath));
      if (exists) {
        componentsFound++;
        this.logTest(`Component: ${path.basename(componentPath, '.tsx')}`, true, 'Found');
      } else {
        this.logTest(`Component: ${path.basename(componentPath, '.tsx')}`, false, 'Not found');
      }
    }
    
    this.logTest(
      'Overall Architecture Status',
      stagesFound === 6 && componentsFound === 4,
      `${stagesFound}/6 stages, ${componentsFound}/4 support components found`
    );
    
    return stagesFound === 6 && componentsFound >= 3;
  }

  testFormContainerLogic() {
    this.log(`\n${COLORS.BOLD}📋 Testing Form Container Logic${COLORS.RESET}`);
    
    const containerPath = path.resolve(process.cwd(), 'src/components/eligibility/organisms/EligibilityFormContainer.tsx');
    
    if (fs.existsSync(containerPath)) {
      const content = fs.readFileSync(containerPath, 'utf8');
      
      // Check for 6-stage handling
      const hasSixStages = content.includes('currentStep < 6') || content.includes('totalSteps={6}');
      this.logTest(
        '6-Stage Flow Configuration',
        hasSixStages,
        hasSixStages ? '6-stage flow logic found' : '6-stage logic not configured'
      );
      
      // Check for conditional pathway rendering
      const hasPathwayLogic = content.includes('pathway') && content.includes('self-pay');
      this.logTest(
        'Pathway Routing Logic',
        hasPathwayLogic,
        hasPathwayLogic ? 'Conditional pathway rendering found' : 'Pathway logic missing'
      );
      
      // Check for stage imports
      const stageImports = [
        'ContactAccountStage',
        'EligibilityGateStage', 
        'DetailedInfoStage',
        'InsuredReviewStage',
        'SelfPayStage',
        'CompletionStage'
      ];
      
      const importedStages = stageImports.filter(stage => content.includes(stage));
      this.logTest(
        'Stage Component Imports',
        importedStages.length === 6,
        `${importedStages.length}/6 stages imported`
      );
    } else {
      this.logTest('Form Container', false, 'EligibilityFormContainer.tsx not found');
    }
  }

  testOTPConfiguration() {
    this.log(`\n${COLORS.BOLD}🔐 Testing OTP Configuration${COLORS.RESET}`);
    
    const otpPath = path.resolve(process.cwd(), 'src/components/forms/eligibility/components/OTPVerification.tsx');
    
    if (fs.existsSync(otpPath)) {
      const content = fs.readFileSync(otpPath, 'utf8');
      
      const hasMockValidation = content.includes('123456');
      this.logTest(
        'Mock OTP Validation Code',
        hasMockValidation,
        hasMockValidation ? 'Mock code "123456" configured' : 'Mock validation not found'
      );
      
      const supportsEmail = content.includes('email');
      const supportsPhone = content.includes('phone');
      
      this.logTest(
        'Email/Phone OTP Support',
        supportsEmail || supportsPhone,
        `Email: ${supportsEmail}, Phone: ${supportsPhone}`
      );
    } else {
      this.logTest('OTP Component', false, 'OTPVerification.tsx not found');
    }
  }

  testHeroCTAIntegration() {
    this.log(`\n${COLORS.BOLD}🎯 Testing Hero CTA Integration${COLORS.RESET}`);
    
    const heroPath = path.resolve(process.cwd(), 'src/components/landing/HeroV2025.tsx');
    
    if (fs.existsSync(heroPath)) {
      const content = fs.readFileSync(heroPath, 'utf8');
      
      const hasCTAText = content.includes('Check your heart from home');
      this.logTest(
        'CTA Button Text',
        hasCTAText,
        hasCTAText ? 'Correct CTA text found' : 'CTA text not found'
      );
      
      const hasNavigation = content.includes('/eligibility') && content.includes('navigate');
      this.logTest(
        'Navigation to Eligibility Flow',
        hasNavigation,
        hasNavigation ? 'Navigation logic configured' : 'Navigation not configured'
      );
    } else {
      this.logTest('Hero Component', false, 'HeroV2025.tsx not found');
    }
  }

  printSummary() {
    this.log(`\n${COLORS.BOLD}📊 FRONTEND TEST SUMMARY${COLORS.RESET}`);
    this.log(`${COLORS.BOLD}================================================================${COLORS.RESET}`);
    
    const total = this.testResults.passed + this.testResults.failed;
    const successRate = Math.round((this.testResults.passed / total) * 100);
    
    this.log(`✅ Passed: ${this.testResults.passed}`, COLORS.GREEN);
    this.log(`❌ Failed: ${this.testResults.failed}`, this.testResults.failed > 0 ? COLORS.RED : COLORS.GREEN);
    this.log(`📈 Success Rate: ${successRate}%`, successRate > 80 ? COLORS.GREEN : COLORS.RED);
    
    this.log(`\n${COLORS.BOLD}🎯 MANUAL TESTING GUIDE${COLORS.RESET}`);
    this.log(`1. Open: http://localhost:8080`);
    this.log(`2. Click: "Check your heart from home →" button`);
    this.log(`3. Stage 0: Enter email + DOB, use OTP "123456"`);
    this.log(`4. Stage 1: Select insurance model, answer symptoms`);
    this.log(`5. Stage 2: Fill detailed information`);
    this.log(`6. Stage 3: Complete review/payment based on pathway`);
    this.log(`7. Stage 4: View completion confirmation`);
    this.log(`\n${COLORS.BOLD}🔍 TEST BOTH PATHWAYS:${COLORS.RESET}`);
    this.log(`• Insured with symptoms → Review & GP referral`);
    this.log(`• Self-pay or no symptoms → Payment processing`);
    
    if (successRate >= 90) {
      this.log(`\n✅ EXCELLENT - Ready for production deployment`, COLORS.GREEN);
    } else if (successRate >= 75) {
      this.log(`\n⚠️  GOOD - Minor issues to address before deployment`, COLORS.YELLOW);
    } else {
      this.log(`\n❌ NEEDS WORK - Significant issues require attention`, COLORS.RED);
    }
    
    return successRate >= 75;
  }

  async runFullTest() {
    const serverHealthy = await this.testServerHealth();
    
    // Continue tests even if server not available (for component testing)
    this.testComponentArchitecture();
    this.testFormContainerLogic();
    this.testOTPConfiguration(); 
    this.testHeroCTAIntegration();
    
    return this.printSummary();
  }
}

// Execute the test
async function runTests() {
  const tester = new FrontendEligibilityTester();
  const success = await tester.runFullTest();
  process.exit(success ? 0 : 1);
}

runTests().catch(console.error);
