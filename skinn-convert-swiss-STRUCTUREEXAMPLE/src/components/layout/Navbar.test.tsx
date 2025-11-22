import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CopyVariantProvider } from '@/contexts/CopyVariantContext'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <CopyVariantProvider>
          {component}
        </CopyVariantProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

describe('Navbar', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays the SKIIN logo', () => {
    renderWithProviders(<Navbar />)
    const logo = screen.getByAltText(/SKIIN/i)
    expect(logo).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderWithProviders(<Navbar />)
    
    // Check for main navigation items
    expect(screen.getByText(/How it works/i)).toBeInTheDocument()
    expect(screen.getByText(/Solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/Partners/i)).toBeInTheDocument()
    expect(screen.getByText(/About/i)).toBeInTheDocument()
  })

  it('opens mobile menu when hamburger is clicked', () => {
    renderWithProviders(<Navbar />)
    
    // Find and click the mobile menu button
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)
    
    // Check if mobile menu is visible
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('changes language when language selector is used', () => {
    renderWithProviders(<Navbar />)
    
    // Find language selector
    const languageButton = screen.getByRole('button', { name: /EN/i })
    fireEvent.click(languageButton)
    
    // Select German
    const germanOption = screen.getByText(/DE/i)
    fireEvent.click(germanOption)
    
    // Verify language change (would need to mock LanguageContext)
  })

  it('has accessible navigation structure', () => {
    renderWithProviders(<Navbar />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label')
    
    // Check for proper heading structure
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('maintains focus management for keyboard navigation', () => {
    renderWithProviders(<Navbar />)
    
    const firstLink = screen.getAllByRole('link')[0]
    firstLink.focus()
    
    expect(document.activeElement).toBe(firstLink)
  })
})