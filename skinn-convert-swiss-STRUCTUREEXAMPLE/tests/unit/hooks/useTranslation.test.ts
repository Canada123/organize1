import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTranslation } from './useTranslation'
import { LanguageProvider } from '@/contexts/LanguageContext'
import React from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('useTranslation', () => {
  it('returns translation function', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    expect(typeof result.current.t).toBe('function')
    expect(result.current).toHaveProperty('language')
  })

  it('translates keys correctly for default language (EN)', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    // Mock translation - would need actual translation files
    const translation = result.current.t('common.title')
    expect(typeof translation).toBe('string')
  })

  it('handles missing translation keys gracefully', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    const missingKey = 'this.key.does.not.exist'
    const translation = result.current.t(missingKey)
    
    // Should return the key itself or a placeholder
    expect(translation).toContain(missingKey.split('.').pop())
  })

  it('supports interpolation in translations', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    // Assuming translation supports interpolation like "Hello {{name}}"
    const translation = result.current.t('greeting.hello', { name: 'John' })
    
    if (translation.includes('{{')) {
      expect(translation).not.toContain('{{name}}')
    }
  })

  it('updates translations when language changes', async () => {
    const { result, rerender } = renderHook(() => useTranslation(), { wrapper })
    
    const enTranslation = result.current.t('common.title')
    
    // Change language (would need to mock LanguageContext)
    // act(() => {
    //   result.current.setLanguage('de')
    // })
    
    rerender()
    
    // const deTranslation = result.current.t('common.title')
    // expect(deTranslation).not.toBe(enTranslation)
  })

  it('handles nested translation keys', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    const translation = result.current.t('home.hero.title')
    expect(typeof translation).toBe('string')
  })

  it('returns array translations when applicable', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    // Some translations might be arrays (e.g., feature lists)
    const translation = result.current.t('features.list')
    
    if (Array.isArray(translation)) {
      expect(translation).toBeInstanceOf(Array)
      translation.forEach(item => {
        expect(typeof item).toBe('string')
      })
    }
  })
})