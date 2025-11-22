/**
 * Visual test script for date validation issue
 * Run in browser console to test the current behavior
 */

// Simulate the exact functions from ContactAccountStageRefactored.tsx
window.debugDateValidation = function() {
    console.log("=== Date Validation Debug (Browser Console) ===\n");
    
    // Copy exact calculateAge function from the component
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
    
    // Copy exact validation logic
    const testValidation = (value) => {
        let ageError = '';
        if (value) {
            const age = calculateAge(value);
            console.log(`Input: "${value}" -> Age: ${age} (isNaN: ${isNaN(age)})`);
            
            if (age < 18) {
                ageError = 'You must be at least 18 years old to proceed';
            } else if (age > 120) {
                ageError = 'Please enter a valid date of birth';
            } else {
                ageError = '';
            }
        }
        
        const result = {
            input: value,
            age: calculateAge(value),
            error: ageError,
            canProceed: !!value && !ageError // Simplified check
        };
        
        console.log(`Result:`, result);
        return result;
    };
    
    // Test cases
    const testCases = [
        "", // Empty
        "1990-05-15", // Valid
        "invalid", // Invalid string
        "2010-01-01", // Too young
        "1900-01-01", // Too old
        "1990-13-15", // Invalid month
        "1990-02-30"  // Invalid day
    ];
    
    console.log("Testing validation logic:\n");
    testCases.forEach((testCase, index) => {
        console.log(`--- Test ${index + 1} ---`);
        testValidation(testCase);
        console.log("");
    });
    
    // Demonstrate the NaN issue
    console.log("=== NaN Comparison Demonstration ===");
    const nanValue = NaN;
    console.log(`NaN: ${nanValue}`);
    console.log(`NaN < 18: ${nanValue < 18}`);
    console.log(`NaN > 120: ${nanValue > 120}`);
    console.log(`isNaN(NaN): ${isNaN(nanValue)}`);
    console.log(`!!NaN: ${!!nanValue}`);
    
    console.log("\n=== Invalid Date Behavior ===");
    const invalidDate = new Date("invalid");
    console.log(`new Date("invalid"): ${invalidDate}`);
    console.log(`invalidDate.getFullYear(): ${invalidDate.getFullYear()}`);
    console.log(`invalidDate.getTime(): ${invalidDate.getTime()}`);
    console.log(`isNaN(invalidDate.getTime()): ${isNaN(invalidDate.getTime())}`);
    
    return {
        message: "Debug complete. Check console output above.",
        recommendation: "The issue is NaN bypassing validation checks."
    };
};

console.log("Date validation debug function loaded. Run debugDateValidation() to test.");