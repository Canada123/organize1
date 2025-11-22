/**
 * FRONTEND ELIGIBILITY QUESTIONNAIRE END-TO-END TEST
 * Task: [EQ-TEST-001] Test the complete 6-stage eligibility questionnaire flow
 * 
 * This script tests the frontend components and flow logic
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
      const response = await fetch(this.baseUrl);
      const healthy = response.ok;
      
      this.logTest(
        'Development Server Health',
        healthy,
        healthy ? `Server responding at ${this.baseUrl}` : `Failed: ${response.status}`
      );
      
      return healthy;
    } catch (error) {
      this.logTest('Server Health', false, `Connection failed: ${error.message}`);
      return false;
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

  testRoutingConfiguration() {
    this.log(`\n${COLORS.BOLD}🛣️  Testing Route Configuration${COLORS.RESET}`);
    
    const routePath = path.resolve(process.cwd(), 'src/routes/index.tsx');
    
    if (fs.existsSync(routePath)) {
      const content = fs.readFileSync(routePath, 'utf8');
      
      const hasEligibilityRoute = content.includes('/eligibility');
      this.logTest(
        'Eligibility Route Configuration',
        hasEligibilityRoute,
        hasEligibilityRoute ? 'Route /eligibility found' : 'Route not configured'
      );
      
      const hasEligibilityFlow = content.includes('EligibilityFlow');
      this.logTest(
        'EligibilityFlow Component',
        hasEligibilityFlow,
        hasEligibilityFlow ? 'Component imported' : 'Component not imported'
      );
    } else {
      this.logTest('Route Configuration', false, 'routes/index.tsx not found');
    }
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
      
      // Check for progress bar
      const hasProgressBar = content.includes('EligibilityProgressBar');
      this.logTest(
        'Progress Indicator',
        hasProgressBar,
        hasProgressBar ? 'Progress bar component found' : 'Progress indicator missing'
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
        `${importedStages.length}/6 stages imported: ${importedStages.join(', ')}`
      );
    } else {
      this.logTest('Form Container', false, 'EligibilityFormContainer.tsx not found');
    }
  }

  testStageSpecificLogic() {
    this.log(`\n${COLORS.BOLD}🎭 Testing Individual Stage Logic${COLORS.RESET}`);
    
    // Test ContactAccountStage
    const contactPath = path.resolve(process.cwd(), 'src/components/forms/eligibility/stages/ContactAccountStage.tsx');
    if (fs.existsSync(contactPath)) {
      const content = fs.readFileSync(contactPath, 'utf8');
      
      const hasEmailValidation = content.includes('email') && content.includes('input');
      const hasAgeValidation = content.includes('18') || content.includes('age');
      const hasOTPIntegration = content.includes('OTPVerification');
      
      this.logTest(
        'Stage 0: Contact & Account',
        hasEmailValidation && hasAgeValidation && hasOTPIntegration,
        `Email: ${hasEmailValidation}, Age: ${hasAgeValidation}, OTP: ${hasOTPIntegration}`
      );
    }
    
    // Test EligibilityGateStage
    const gatePath = path.resolve(process.cwd(), 'src/components/forms/eligibility/stages/EligibilityGateStage.tsx');
    if (fs.existsSync(gatePath)) {
      const content = fs.readFileSync(gatePath, 'utf8');
      
      const hasInsuranceSelector = content.includes('InsuranceModelSelector');
      const hasContraindicationScreening = content.includes('ContraindicationScreening');
      const hasSymptomSelection = content.includes('symptom');
      
      this.logTest(
        'Stage 1: Eligibility Gate',
        hasInsuranceSelector && hasContraindicationScreening && hasSymptomSelection,
        `Insurance: ${hasInsuranceSelector}, Screening: ${hasContraindicationScreening}, Symptoms: ${hasSymptomSelection}`
      );
    }
  }

  testOTPConfiguration() {
    this.log(`\n${COLORS.BOLD}🔐 Testing OTP Configuration${COLORS.RESET}`);
    
    const otpPath = path.resolve(process.cwd(), 'src/components/forms/eligibility/components/OTPVerification.tsx');
    
    if (fs.existsSync(otpPath)) {
      const content = fs.readFileSync(otpPath, 'utf8');
      
      // Check for mock OTP validation
      const hasMockValidation = content.includes('123456');
      this.logTest(
        'Mock OTP Validation Code',
        hasMockValidation,
        hasMockValidation ? 'Mock code "123456" configured' : 'Mock validation not found'
      );
      
      // Check for email/phone support
      const supportsEmail = content.includes('email');
      const supportsPhone = content.includes('phone');
      
      this.logTest(
        'Email/Phone OTP Support',
        supportsEmail && supportsPhone,
        `Email: ${supportsEmail}, Phone: ${supportsPhone}`
      );
      
      // Check for error handling
      const hasErrorHandling = content.includes('error') && content.includes('useState');
      this.logTest(
        'Error Handling',
        hasErrorHandling,
        hasErrorHandling ? 'Error state management found' : 'Error handling missing'
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
      
      // Check for CTA button text
      const hasCTAText = content.includes('Check your heart from home');
      this.logTest(
        'CTA Button Text',
        hasCTAText,
        hasCTAText ? 'Correct CTA text found' : 'CTA text not found'
      );
      
      // Check for navigation to eligibility
      const hasNavigation = content.includes('/eligibility') && content.includes('navigate');
      this.logTest(
        'Navigation to Eligibility Flow',
        hasNavigation,
        hasNavigation ? 'Navigation logic configured' : 'Navigation not configured'
      );
      
      // Check for useNavigate hook
      const hasUseNavigate = content.includes('useNavigate');
      this.logTest(
        'React Router Integration',
        hasUseNavigate,
        hasUseNavigate ? 'useNavigate hook imported' : 'Router integration missing'
      );
    } else {
      this.logTest('Hero Component', false, 'HeroV2025.tsx not found');
    }
  }

  async testEndToEndAccessibility() {
    this.log(`\n${COLORS.BOLD}♿ Testing End-to-End Flow Accessibility${COLORS.RESET}`);
    
    try {
      // Test landing page accessibility
      const response = await fetch(this.baseUrl);
      if (response.ok) {
        const html = await response.text();
        
        const hasAccessibleCTA = html.includes('button') || html.includes('role=');
        this.logTest(
          'Landing Page CTA Accessibility',
          hasAccessibleCTA,
          hasAccessibleCTA ? 'Accessible button elements found' : 'Button accessibility unclear'
        );
      }
      
      // Test eligibility route accessibility
      const eligibilityResponse = await fetch(`${this.baseUrl}/eligibility`);
      if (eligibilityResponse.ok) {
        this.logTest(
          'Eligibility Route Access',
          true,
          'Route accessible via direct URL'
        );
      } else {
        this.logTest(
          'Eligibility Route Access',
          false,
          `Route returned ${eligibilityResponse.status}`
        );
      }
    } catch (error) {
      this.logTest('Accessibility Testing', false, `Network error: ${error.message}`);
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
    
    this.log(`\n${COLORS.BOLD}🎯 MANUAL TESTING INSTRUCTIONS${COLORS.RESET}`);
    this.log(`1. Open: http://localhost:8080`);
    this.log(`2. Click: "Check your heart from home →" button`);
    this.log(`3. Stage 0: Enter email + DOB, use OTP "123456"`);
    this.log(`4. Stage 1: Select insurance model, answer symptoms`);
    this.log(`5. Stage 2: Fill detailed information`);
    this.log(`6. Stage 3: Complete review/payment`);
    this.log(`7. Stage 4: View completion confirmation`);
    
    if (successRate >= 90) {
      this.log(`\n✅ EXCELLENT - Ready for comprehensive testing`, COLORS.GREEN);
    } else if (successRate >= 75) {
      this.log(`\n⚠️  GOOD - Minor issues to address`, COLORS.YELLOW);
    } else {
      this.log(`\n❌ NEEDS WORK - Significant issues detected`, COLORS.RED);
    }
    
    return successRate >= 75;
  }

  async runFullTest() {
    const serverHealthy = await this.testServerHealth();
    
    if (!serverHealthy) {
      this.log(`\n❌ Cannot proceed - development server not available`, COLORS.RED);
      return false;
    }
    
    this.testComponentArchitecture();
    this.testRoutingConfiguration();
    this.testFormContainerLogic();
    this.testStageSpecificLogic();
    this.testOTPConfiguration();
    this.testHeroCTAIntegration();
    await this.testEndToEndAccessibility();
    
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
