#!/usr/bin/env node

/**
 * Script to automatically fix common ESLint issues
 * - Removes console.log, console.debug, console.trace, console.info statements
 * - Fixes common TypeScript any type issues
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns to search and replace
const replacements = [
  // Remove console statements (keep warn and error)
  {
    pattern: /^\s*console\.(log|debug|trace|info)\([^)]*\);?\s*$/gm,
    replacement: '  // Console statement removed by ESLint fix'
  },
  // Replace any[] with unknown[]
  {
    pattern: /: any\[\]/g,
    replacement: ': unknown[]'
  },
  // Replace Record<string, any> with Record<string, unknown>
  {
    pattern: /Record<string,\s*any>/g,
    replacement: 'Record<string, unknown>'
  },
  // Replace emergency_contact?: any with a proper type
  {
    pattern: /emergency_contact\?: any/g,
    replacement: 'emergency_contact?: { name?: string; phone?: string; relationship?: string }'
  },
  // Replace form_data: any with proper type
  {
    pattern: /form_data: any/g,
    replacement: 'form_data: Record<string, unknown>'
  },
  // Replace eligibility_result?: any
  {
    pattern: /eligibility_result\?: any/g,
    replacement: 'eligibility_result?: { eligible: boolean; pathway: string; reason: string; score?: number }'
  },
  // Replace recommendations?: any
  {
    pattern: /recommendations\?: any/g,
    replacement: 'recommendations?: string[]'
  },
  // Replace next_steps?: any
  {
    pattern: /next_steps\?: any/g,
    replacement: 'next_steps?: string[]'
  },
  // Replace billing_address: any
  {
    pattern: /billing_address: any/g,
    replacement: 'billing_address: { street?: string; city?: string; postalCode?: string; country?: string }'
  },
  // Replace generation_parameters?: any
  {
    pattern: /generation_parameters\?: any/g,
    replacement: 'generation_parameters?: Record<string, unknown>'
  },
  // Replace initialData: any
  {
    pattern: /initialData: any/g,
    replacement: 'initialData: Record<string, unknown>'
  },
  // Replace formData: any
  {
    pattern: /formData: any(?![a-zA-Z])/g,
    replacement: 'formData: Record<string, unknown>'
  },
  // Replace address?: any
  {
    pattern: /address\?: any/g,
    replacement: 'address?: { street?: string; city?: string; postalCode?: string; canton?: string }'
  },
  // Replace billingAddress: any
  {
    pattern: /billingAddress: any/g,
    replacement: 'billingAddress: { street?: string; city?: string; postalCode?: string; country?: string }'
  },
  // Replace amountBreakdown?: any
  {
    pattern: /amountBreakdown\?: any/g,
    replacement: 'amountBreakdown?: { total_cents: number; net_cents: number; vat_cents: number; vat_rate: number; currency: string }'
  },
  // Replace data?: any in return types
  {
    pattern: /data\?: any(?=\s*[,;}])/g,
    replacement: 'data?: unknown'
  },
  // Replace result?: any
  {
    pattern: /result\?: any/g,
    replacement: 'result?: unknown'
  }
];

async function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 Starting ESLint issue fixes...\n');

  // Find all TypeScript and JavaScript files in src/
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  });

  console.log(`Found ${files.length} files to process\n`);

  let fixedCount = 0;
  for (const file of files) {
    if (await fixFile(file)) {
      console.log(`✅ Fixed: ${file}`);
      fixedCount++;
    }
  }

  console.log(`\n✨ Complete! Fixed ${fixedCount} files.`);
  console.log('Run "npm run lint" to check remaining issues.');
}

// Check if glob is installed
try {
  require.resolve('glob');
  main();
} catch (error) {
  console.log('Installing glob package...');
  require('child_process').execSync('npm install glob --no-save', { stdio: 'inherit' });
  main();
}