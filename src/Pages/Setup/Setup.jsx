import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../Context/useUser'
import { useTerms } from '../../Context/useTerms'
import Stepper from './Stepper'
import StepUser from './StepUser'
import StepSchedule from './StepSchedule'
import StepStudents from './StepStudents'

export default function Setup() {
  const { user } = useUser()
  const { currentTerm } = useTerms()
  const navigate = useNavigate()

  const [step, setStep] = useState(user && !currentTerm ? 2 : 1)

  return (
    <div className="setup-card p-3 p-sm-4">
      <Stepper step={step} />
      {step === 1 && <StepUser onNext={() => setStep(2)} />}
      {step === 2 && <StepSchedule onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <StepStudents onBack={() => setStep(2)} onDone={() => navigate('/')} />}
    </div>
  )
}