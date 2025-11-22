"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  label: string
  description?: string
  completed: boolean
  current: boolean
}

interface SwissHealthcareStepperProps {
  currentStep: number
  totalSteps?: number
  completedSteps?: number[]
  onStepClick?: (stepId: number) => void
  className?: string
}

export const SwissHealthcareStepper: React.FC<SwissHealthcareStepperProps> = ({
  currentStep = 0,
  totalSteps = 6,
  completedSteps = [],
  onStepClick,
  className
}) => {
  // Define the 6 steps for the eligibility form
  const steps: Step[] = [
    { id: 1, label: "Contact", description: "Account setup", completed: false, current: false },
    { id: 2, label: "Eligibility", description: "Insurance check", completed: false, current: false },
    { id: 3, label: "Details", description: "Medical info", completed: false, current: false },
    { id: 4, label: "Review", description: "Verify data", completed: false, current: false },
    { id: 5, label: "Consents", description: "Agreements", completed: false, current: false },
    { id: 6, label: "Complete", description: "Confirmation", completed: false, current: false }
  ]

  const [animatedSteps, setAnimatedSteps] = useState(steps)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress based on current step (0-based index)
    const completedCount = currentStep
    const newProgress = ((completedCount + 1) / totalSteps) * 100
    setProgress(newProgress)

    // Update steps with current state
    setAnimatedSteps(steps.map((step, index) => ({
      ...step,
      completed: index < currentStep,
      current: index === currentStep
    })))
  }, [currentStep, totalSteps])

  const handleStepClick = (stepId: number) => {
    if (onStepClick && stepId <= currentStep + 1) {
      onStepClick(stepId - 1) // Convert to 0-based index
    }
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-6", className)}>
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Eligibility Assessment</h2>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-lg font-semibold" style={{ color: "#004C96" }}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "#004C96" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-border">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#22C55E" }}
              initial={{ width: "0%" }}
              animate={{ 
                width: currentStep > 0 
                  ? `${((currentStep) / (totalSteps - 1)) * 100}%` 
                  : "0%" 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {animatedSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleStepClick(step.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Step Circle */}
                <motion.div
                  className={cn(
                    "relative w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 transition-all duration-300",
                    step.completed 
                      ? "bg-green-500 border-green-500 text-white"
                      : step.current
                        ? "border-4 text-white shadow-lg"
                        : "bg-background border-border text-muted-foreground hover:border-[#004C96]"
                  )}
                  style={{
                    backgroundColor: step.current ? "#004C96" : undefined,
                    borderColor: step.current ? "#004C96" : undefined,
                    boxShadow: step.current ? "0 0 0 4px rgba(0, 76, 150, 0.2)" : undefined
                  }}
                  animate={step.current ? {
                    boxShadow: [
                      "0 0 0 4px rgba(0, 76, 150, 0.2)",
                      "0 0 0 8px rgba(0, 76, 150, 0.1)",
                      "0 0 0 4px rgba(0, 76, 150, 0.2)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AnimatePresence mode="wait">
                    {step.completed ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="font-semibold"
                      >
                        {step.id}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Step Label */}
                <div className="text-center max-w-[120px]">
                  <div className={cn(
                    "font-medium text-sm mb-1 transition-colors",
                    step.completed 
                      ? "text-green-600"
                      : step.current
                        ? "font-semibold"
                        : "text-muted-foreground group-hover:text-foreground"
                  )}
                  style={{ color: step.current ? "#004C96" : undefined }}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden space-y-3">
        {animatedSteps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex items-center space-x-3 p-3 rounded-lg border bg-card cursor-pointer group"
            onClick={() => handleStepClick(step.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              borderColor: step.current ? "#004C96" : undefined,
              backgroundColor: step.current ? "rgba(0, 76, 150, 0.05)" : undefined
            }}
          >
            {/* Step Circle */}
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                step.completed 
                  ? "bg-green-500 border-green-500 text-white"
                  : step.current
                    ? "border-2 text-white"
                    : "bg-background border-border text-muted-foreground"
              )}
              style={{
                backgroundColor: step.current ? "#004C96" : undefined,
                borderColor: step.current ? "#004C96" : undefined
              }}
              animate={step.current ? {
                boxShadow: [
                  "0 0 0 2px rgba(0, 76, 150, 0.2)",
                  "0 0 0 4px rgba(0, 76, 150, 0.1)",
                  "0 0 0 2px rgba(0, 76, 150, 0.2)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AnimatePresence mode="wait">
                {step.completed ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="number"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="font-semibold text-sm"
                  >
                    {step.id}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "font-medium transition-colors",
                step.completed 
                  ? "text-green-600"
                  : step.current
                    ? "font-semibold"
                    : "text-muted-foreground group-hover:text-foreground"
              )}
              style={{ color: step.current ? "#004C96" : undefined }}
              >
                {step.label}
              </div>
              {step.description && (
                <div className="text-sm text-muted-foreground mt-0.5">
                  {step.description}
                </div>
              )}
            </div>

            {/* Status Indicator */}
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : step.current ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Circle className="w-5 h-5" style={{ color: "#004C96" }} />
                </motion.div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}