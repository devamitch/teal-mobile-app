/**
 * Phase-specific symptoms based on menstrual cycle phases
 * These symptoms are shown on the home page based on the user's current cycle phase
 */

export interface PhaseSymptoms {
  physical: string[];
  psychological: string[];
}

export const PHASE_SPECIFIC_SYMPTOMS: Record<string, PhaseSymptoms> = {
  Menstrual: {
    physical: [
      'cramps',
      'back pain',
      'bloating',
      'breast tenderness',
      'headache',
      'fatigue',
      'nausea',
      'diarrhea',
      'constipation',
      'heavy flow',
      'light flow',
      'spotting',
      'leg cramps',
      'dizziness',
    ],
    psychological: [
      'irritability',
      'mood swings',
      'anxiety',
      'sadness',
      'difficulty concentrating',
      'low motivation',
      'sleepiness',
      'tearfulness',
      'restlessness',
      'social withdrawal',
      'frustration',
    ],
  },
  Follicular: {
    physical: [
      'increased energy',
      'clear skin',
      'breast sensitivity',
      'cervical mucus',
      'temperature rise',
      'improved sleep',
      'steady appetite',
    ],
    psychological: [
      'elevated mood',
      'improved focus',
      'increased motivation',
      'confidence',
      'social engagement',
      'creativity',
      'calmness',
      'optimism',
    ],
  },
  Ovulation: {
    physical: [
      'ovulation pain',
      'spotting',
      'libido',
      'breast tenderness',
      'cervical mucus',
      'temperature rise',
      'bloating',
      'pelvic pain',
      'increased strength',
    ],
    psychological: [
      'confidence',
      'sociability',
      'sensory sensitivity',
      'risk-taking',
      'euphoria',
      'impulsivity',
    ],
  },
  Luteal: {
    physical: [
      'bloating',
      'breast tenderness',
      'headache',
      'fatigue',
      'diarrhea',
      'constipation',
      'muscle ache',
      'joint pain',
      'acne',
      'food craving',
      'sweet craving',
      'salty craving',
      'weight gain',
      'water retention',
      'nausea',
      'dizziness',
      'thirst',
    ],
    psychological: [
      'mood swings',
      'irritability',
      'anxiety',
      'depression',
      'brain fog',
      'insomnia',
      'oversleeping',
      'emotional sensitivity',
      'social withdrawal',
      'decreased libido',
      'tension',
    ],
  },
};

/**
 * Get phase-specific symptoms for the current cycle phase
 * @param phase - Current menstrual cycle phase
 * @returns PhaseSymptoms object with physical and psychological symptoms
 */
export const getPhaseSymptomsForPhase = (phase: string): PhaseSymptoms => {
  const phaseSymptoms = PHASE_SPECIFIC_SYMPTOMS[phase];
  if (phaseSymptoms) {
    return phaseSymptoms;
  }
  // Safe to assert as we know Menstrual exists in our constant
  return PHASE_SPECIFIC_SYMPTOMS.Menstrual as PhaseSymptoms;
};

/**
 * Get a limited list of phase-specific symptoms for display on home page
 * @param phase - Current menstrual cycle phase
 * @param type - Type of symptoms ('physical' or 'psychological')
 * @param limit - Maximum number of symptoms to return (default: 6)
 * @returns Array of symptom names
 */
export const getPhaseSpecificSymptomsForDisplay = (
  phase: string,
  type: 'physical' | 'psychological',
  limit: number = 6,
): string[] => {
  const phaseSymptoms = getPhaseSymptomsForPhase(phase);
  const symptoms = phaseSymptoms[type];

  // Return limited number of symptoms, prioritizing common ones for each phase
  return symptoms.slice(0, limit);
};
