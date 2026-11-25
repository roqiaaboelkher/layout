import { useContext } from 'react'
import { TermContext } from './termContext'

export function useTerms() {
    return useContext(TermContext)
}