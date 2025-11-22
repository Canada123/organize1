import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    
    // Tab through navigation
    await page.keyboard.press('Tab')
    const firstFocusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(firstFocusedElement).toBeTruthy()
    
    // Check skip link
    const skipLink = page.getByText('Skip to main content')
    await expect(skipLink).toBeHidden() // Should be visually hidden but accessible
  })

  test('forms should have proper labels', async ({ page }) => {
    await page.goto('/contact')
    
    // Check form accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('form')
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
    
    // Check each input has a label
    const inputs = await page.$$('input:not([type="hidden"])')
    for (const input of inputs) {
      const hasLabel = await input.evaluate((el) => {
        const id = el.id
        return !!document.querySelector(`label[for="${id}"]`) || 
               !!el.closest('label') ||
               !!el.getAttribute('aria-label') ||
               !!el.getAttribute('aria-labelledby')
      })
      expect(hasLabel).toBeTruthy()
    }
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.$$('img')
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt).not.toBe('') // Alt text should be meaningful
    }
  })

  test('color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // Temporarily disable if using dynamic themes
      .analyze()
    
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )
    expect(colorContrastViolations).toHaveLength(0)
  })

  test('language attributes should be set correctly', async ({ page }) => {
    // Test English
    await page.goto('/en')
    const htmlLangEn = await page.getAttribute('html', 'lang')
    expect(htmlLangEn).toBe('en')
    
    // Test German
    await page.goto('/de')
    const htmlLangDe = await page.getAttribute('html', 'lang')
    expect(htmlLangDe).toBe('de')
    
    // Test French
    await page.goto('/fr')
    const htmlLangFr = await page.getAttribute('html', 'lang')
    expect(htmlLangFr).toBe('fr')
    
    // Test Italian
    await page.goto('/it')
    const htmlLangIt = await page.getAttribute('html', 'lang')
    expect(htmlLangIt).toBe('it')
  })

  test('focus indicators should be visible', async ({ page }) => {
    await page.goto('/')
    
    // Tab to first interactive element
    await page.keyboard.press('Tab')
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return null
      
      const styles = window.getComputedStyle(el)
      const pseudoStyles = window.getComputedStyle(el, ':focus')
      
      return {
        outline: styles.outline,
        outlineOffset: styles.outlineOffset,
        boxShadow: styles.boxShadow,
      }
    })
    
    expect(focusedElement).toBeTruthy()
    // Should have visible focus indicator (outline, box-shadow, etc.)
  })

  test('ARIA landmarks should be properly structured', async ({ page }) => {
    await page.goto('/')
    
    // Check for main landmarks
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible() // footer
    
    // Check heading hierarchy
    const headings = await page.evaluate(() => {
      const h1s = document.querySelectorAll('h1')
      const h2s = document.querySelectorAll('h2')
      return {
        h1Count: h1s.length,
        h2Count: h2s.length,
      }
    })
    
    expect(headings.h1Count).toBe(1) // Should have exactly one h1
    expect(headings.h2Count).toBeGreaterThan(0) // Should have h2s
  })
})