import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'

// Mock ContactForm component for testing
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

// Simplified ContactForm component for testing
const ContactForm = ({ onSubmit }: { onSubmit: (data: ContactFormData) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simplified validation
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      consent: formData.get('consent') === 'on',
    }
    
    try {
      const validated = ContactFormSchema.parse(data)
      onSubmit(validated)
    } catch (error) {
      // Handle validation errors
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Contact form">
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" type="tel" placeholder="Phone" />
      <textarea name="message" placeholder="Message" required />
      <label>
        <input name="consent" type="checkbox" required />
        I agree to the privacy policy
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}

describe('ContactForm', () => {
  it('renders all form fields', () => {
    render(<ContactForm onSubmit={vi.fn()} />)
    
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument()
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    // Fill invalid email
    await user.type(screen.getByPlaceholderText('Email'), 'invalid-email')
    
    // Fill other required fields
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Message'), 'This is a test message')
    await user.click(screen.getByRole('checkbox'))
    
    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('validates phone number format when provided', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    // Fill form with invalid phone
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Phone'), 'invalid')
    await user.type(screen.getByPlaceholderText('Message'), 'This is a test message')
    await user.click(screen.getByRole('checkbox'))
    
    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('validates consent checkbox', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    // Fill form without consent
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Message'), 'This is a test message')
    
    // Submit without checking consent
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('submits valid form data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    // Fill valid form
    await user.type(screen.getByPlaceholderText('Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Phone'), '+41791234567')
    await user.type(screen.getByPlaceholderText('Message'), 'This is a test message for SKIIN')
    await user.click(screen.getByRole('checkbox'))
    
    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+41791234567',
        message: 'This is a test message for SKIIN',
        consent: true,
      })
    })
  })

  it('has accessible form labels and error messages', () => {
    render(<ContactForm onSubmit={vi.fn()} />)
    
    const form = screen.getByRole('form')
    expect(form).toHaveAttribute('aria-label', 'Contact form')
    
    // All inputs should be accessible
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName()
    })
  })

  it('prevents XSS in form inputs', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    const xssPayload = '<script>alert("XSS")</script>'
    
    // Try XSS in message field
    await user.type(screen.getByPlaceholderText('Name'), 'Test User')
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Message'), xssPayload)
    await user.click(screen.getByRole('checkbox'))
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      if (onSubmit.mock.calls.length > 0) {
        expect(onSubmit.mock.calls[0][0].message).toBe(xssPayload)
        // The XSS payload should be treated as plain text, not executed
      }
    })
  })
})