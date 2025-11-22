'use client'

import React, { useState, useRef } from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight, AlertCircle } from 'lucide-react'

interface CodeEntryStepProps {
  onNext: (data: { referralCode: string }) => void
}

export function CodeEntryStep({ onNext }: CodeEntryStepProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value.toUpperCase()
    setCode(newCode)
    
    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-character code')
      return
    }

    setIsValidating(true)
    setError('')
    
    // TODO: Validate code with backend
    // For now, simulate validation
    setTimeout(() => {
      setIsValidating(false)
      onNext({ referralCode: fullCode })
    }, 1000)
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Enter Referral Code</CardTitle>
        <CardDescription>
          Enter the 6-character code provided by your patient
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-mono border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleSubmit}
          disabled={isValidating || code.some(d => !d)}
          className="w-full"
        >
          {isValidating ? 'Validating...' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </>
  )
}