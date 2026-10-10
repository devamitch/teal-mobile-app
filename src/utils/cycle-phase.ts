/**
 * Utility functions for determining and working with menstrual cycle phases
 */

import {phaseMap} from '@/screens/home/components/daychart.constants';

export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

export interface CycleRecord {
  id?: string;
  date: string;
  color: string;
  start_date?: number;
  end_date?: number;
  is_last_date?: number;
  day: number;
  cycle_day?: number;
}

/**
 * Get the current cycle phase based on the today's cycle record
 * @param todayRecord - The cycle record for today
 * @returns Current cycle phase name
 */
export const getCurrentCyclePhase = (todayRecord?: CycleRecord): CyclePhase => {
  if (!todayRecord?.color) {
    return 'Menstrual'; // Default fallback
  }

  const phase = phaseMap[todayRecord.color];
  return (phase as CyclePhase) || 'Menstrual';
};

/**
 * Check if a given phase is valid
 * @param phase - Phase to validate
 * @returns boolean indicating if phase is valid
 */
export const isValidPhase = (phase: string): phase is CyclePhase => {
  return ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'].includes(phase);
};

/**
 * Get the color associated with a cycle phase
 * @param phase - Cycle phase
 * @returns Hex color code for the phase
 */
export const getPhaseColor = (phase: CyclePhase): string => {
  const colorMap: Record<CyclePhase, string> = {
    Menstrual: '#EF5B70',
    Follicular: '#7C77B9',
    Ovulation: '#F4B740',
    Luteal: '#049299',
  };

  return colorMap[phase];
};
