import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAppStore from '@/core/stores';
import moment from 'moment';

interface HighRiskDaysListProps {
  activity: any;
  response?: any;
  onResponseChange: (response: any) => void;
}

interface CyclePhase {
  name: string;
  startDate: string;
  endDate: string;
  phase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
}

const HighRiskDaysList: React.FC<HighRiskDaysListProps> = ({
  activity,
  response,
  onResponseChange,
}) => {
  const hasSetResponse = useRef(false);
  const [currentCyclePhases, setCurrentCyclePhases] = useState<CyclePhase[]>(
    [],
  );
  const [upcomingCyclePhases, setUpcomingCyclePhases] = useState<CyclePhase[]>(
    [],
  );

  const {markedDates} = useAppStore(state => state.cycle);
  const {getQuizWithID} = useAppStore(state => state.engagement);

  // Get user's cycle length from quiz
  const totalCycleDays = getQuizWithID(5)?.answer || 28;

  // Function to get phase durations based on cycle length
  const getPhaseDurations = (cycleDays: number) => {
    const lutealDays = 12;

    let menstrualDays: number;
    if (cycleDays <= 24) {
      menstrualDays = 3;
    } else if (cycleDays <= 28) {
      menstrualDays = 4;
    } else if (cycleDays <= 32) {
      menstrualDays = 5;
    } else {
      menstrualDays = 6;
    }

    let ovulationDays: number;
    if (cycleDays <= 25) {
      ovulationDays = 2;
    } else if (cycleDays <= 30) {
      ovulationDays = 3;
    } else if (cycleDays <= 35) {
      ovulationDays = 4;
    } else {
      ovulationDays = 5;
    }

    const follicularDays =
      cycleDays - menstrualDays - ovulationDays - lutealDays;

    return {
      menstrual: menstrualDays,
      follicular: Math.max(1, follicularDays),
      ovulation: ovulationDays,
      luteal: lutealDays,
    };
  };

  // Function to calculate cycle phases
  const calculateCyclePhases = (
    startDate: moment.Moment,
    cycleDays: number,
  ): CyclePhase[] => {
    const phases = getPhaseDurations(cycleDays);
    const cyclePhases: CyclePhase[] = [];
    let currentDate = startDate.clone();

    // Menstrual phase
    const menstrualStart = currentDate.clone();
    currentDate.add(phases.menstrual - 1, 'days');
    const menstrualEnd = currentDate.clone();
    cyclePhases.push({
      name: 'Menstruation',
      startDate: menstrualStart.format('MMM DD'),
      endDate: menstrualEnd.format('MMM DD'),
      phase: 'menstruation',
    });

    // Follicular phase
    currentDate.add(1, 'day');
    const follicularStart = currentDate.clone();
    currentDate.add(phases.follicular - 1, 'days');
    const follicularEnd = currentDate.clone();
    cyclePhases.push({
      name: 'Follicular Phase',
      startDate: follicularStart.format('MMM DD'),
      endDate: follicularEnd.format('MMM DD'),
      phase: 'follicular',
    });

    // Ovulation phase
    currentDate.add(1, 'day');
    const ovulationStart = currentDate.clone();
    currentDate.add(phases.ovulation - 1, 'days');
    const ovulationEnd = currentDate.clone();
    cyclePhases.push({
      name: 'Ovulation',
      startDate: ovulationStart.format('MMM DD'),
      endDate: ovulationEnd.format('MMM DD'),
      phase: 'ovulation',
    });

    // Luteal phase (high risk for anger and irritability)
    currentDate.add(1, 'day');
    const lutealStart = currentDate.clone();
    currentDate.add(phases.luteal - 1, 'days');
    const lutealEnd = currentDate.clone();
    cyclePhases.push({
      name: 'Luteal Phase (High Risk)',
      startDate: lutealStart.format('MMM DD'),
      endDate: lutealEnd.format('MMM DD'),
      phase: 'luteal',
    });

    return cyclePhases;
  };

  // Find the most recent menstrual start date from marked dates
  const findLastMenstrualStart = () => {
    const today = moment();
    const dates = Object.keys(markedDates).sort().reverse();

    for (const dateStr of dates) {
      const date = moment(dateStr);
      const dayData = markedDates[dateStr];

      // Look for menstrual phase start (red color, starting day)
      if (
        dayData &&
        dayData.color === '#EF5B70' &&
        dayData.startingDay &&
        date.isBefore(today)
      ) {
        return date;
      }
    }

    // If no data found, estimate based on today minus half cycle
    return today.clone().subtract(Math.floor(totalCycleDays / 2), 'days');
  };

  useEffect(() => {
    // Calculate current and upcoming cycle phases
    const lastMenstrualStart = findLastMenstrualStart();
    const currentPhases = calculateCyclePhases(
      lastMenstrualStart,
      totalCycleDays,
    );

    // Calculate next cycle start
    const nextCycleStart = lastMenstrualStart
      .clone()
      .add(totalCycleDays, 'days');
    const upcomingPhases = calculateCyclePhases(nextCycleStart, totalCycleDays);

    setCurrentCyclePhases(currentPhases);
    setUpcomingCyclePhases(upcomingPhases);

    // Set response for the activity
    if (!hasSetResponse.current && !response) {
      hasSetResponse.current = true;
      onResponseChange({
        reviewed: true,
        timestamp: new Date().toISOString(),
        currentCycle: currentPhases,
        upcomingCycle: upcomingPhases,
      });
    }
  }, [markedDates, totalCycleDays, response, onResponseChange]);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'menstruation':
        return 'water-drop';
      case 'follicular':
        return 'trending-up';
      case 'ovulation':
        return 'favorite';
      case 'luteal':
        return 'warning';
      default:
        return 'calendar-today';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstruation':
        return '#EF5B70';
      case 'follicular':
        return '#7C77B9';
      case 'ovulation':
        return '#F4B740';
      case 'luteal':
        return '#049299';
      default:
        return '#666';
    }
  };

  const isHighRiskPhase = (phase: string) => {
    return phase === 'luteal' || phase === 'menstruation';
  };

  const renderPhaseList = (phases: CyclePhase[], title: string) => (
    <View style={styles.cycleSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {phases.map((phase, index) => (
        <View
          key={index}
          style={[
            styles.phaseItem,
            isHighRiskPhase(phase.phase) && styles.highRiskPhase,
          ]}>
          <View style={styles.phaseHeader}>
            <MaterialIcons
              name={getPhaseIcon(phase.phase)}
              size={20}
              color={getPhaseColor(phase.phase)}
            />
            <Text
              style={[
                styles.phaseName,
                isHighRiskPhase(phase.phase) && styles.highRiskText,
              ]}>
              {phase.name}
            </Text>
            {isHighRiskPhase(phase.phase) && (
              <View style={styles.riskBadge}>
                <Text style={styles.riskBadgeText}>HIGH RISK</Text>
              </View>
            )}
          </View>
          <Text style={styles.phaseDates}>
            {phase.startDate} - {phase.endDate}
          </Text>
          {isHighRiskPhase(phase.phase) && (
            <Text style={styles.riskDescription}>
              {phase.phase === 'luteal'
                ? 'Higher risk for anger, irritability, and mood changes due to hormonal fluctuations'
                : 'Physical discomfort may contribute to increased irritability'}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {activity.tags?.includes('high_risk_days') && (
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color="#1D4ED8" />
            <Text style={styles.infoText}>
              Based on your cycle patterns, these are the days when you may be
              more susceptible to anger and irritability.
            </Text>
          </View>
        )}

        {renderPhaseList(currentCyclePhases, 'Current Cycle Critical Days')}
        {renderPhaseList(upcomingCyclePhases, 'Upcoming Cycle Critical Days')}

        <View style={styles.insightCard}>
          <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
          <Text style={styles.insightText}>
            Use this information to plan self-care activities and prepare coping
            strategies for your high-risk days.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF4FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  cycleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phaseItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  highRiskPhase: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 2,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
  highRiskText: {
    color: '#EF5B70',
  },
  riskBadge: {
    backgroundColor: '#EF5B70',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  phaseDates: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 12,
    color: '#EF5B70',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});

export default HighRiskDaysList;
