import {IMAGES} from '@/constants/images';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import {phaseMap} from './daychart.constants';
import useAppStore from '@/core/stores';

const {width} = Dimensions.get('window');
const SIZE = width * 0.4; // Diameter of the circle
const RADIUS = SIZE / 2 - 20; // Radius minus stroke width
const STROKE_WIDTH = 8; // Thickness of the circular bar
// 4 menstrual cycle phases: Menstrual, Follicular, Ovulation, Luteal
const SEGMENT_COLORS = ['#EF5B70', '#7C77B9', '#F4B740', '#049299']; // Colors for each segment
const SEGMENT_COUNT = SEGMENT_COLORS.length; // Number of segments (4)
const FULL_CIRCLE = 2 * Math.PI;
const SEGMENT_SIZE_RATIO = 0.8; // Make segments 80% of their original size
const EFFECTIVE_SEGMENT_ANGLE =
  (FULL_CIRCLE / SEGMENT_COUNT) * SEGMENT_SIZE_RATIO; // Smaller segment angle

interface CircularProgressProps {
  todayRecord?: DateRecordWithDate;
  totalCycleDays: number;
}

type DateRecordWithDate = {
  id?: string;
  date: string;
  color: string;
  start_date?: number;
  end_date?: number;
  is_last_date?: number;
  day: number;
  cycle_day?: number;
};

const CircularProgress = ({
  todayRecord,
  totalCycleDays,
}: CircularProgressProps) => {
  // STRICT SEGMENTATION APPROACH:
  // - Each phase has a fixed number of days based on medical logic
  // - The dot indicator strictly stays within its respective colored segment
  // - Progress within each segment is calculated based on actual days completed in that phase
  // - No cross-segment movement - menstrual stays in red, follicular in purple, etc.

  // Access user's quiz data for personalized cycle settings
  const {getQuizWithID} = useAppStore(state => state.engagement);

  // Calculate actual phase durations based on user's settings and medical logic
  const getActualPhaseDurations = (totalCycleDays: number) => {
    // Get user's actual total cycle days from quiz (Quiz ID 5)
    const userTotalCycleDays = getQuizWithID(5)?.answer || totalCycleDays;

    // IMPROVEMENT NEEDED: Add quiz question for menstrual days in onboarding
    // Current limitation: We estimate menstrual days based on total cycle length
    // Ideally, add: "How many days does your period usually last?" (Quiz ID suggestion: 4.5)
    // This would allow users to set their actual menstrual duration (3-8 days)

    const lutealDays = 12; // Luteal phase is typically consistent at ~12 days

    // Estimate menstrual days based on user's total cycle length
    // This should ideally come from a quiz question: "How many days does your period usually last?"
    let menstrualDays: number;
    if (userTotalCycleDays <= 24) {
      menstrualDays = 3;
    } else if (userTotalCycleDays <= 28) {
      menstrualDays = 4;
    } else if (userTotalCycleDays <= 32) {
      menstrualDays = 5;
    } else {
      menstrualDays = 6;
    }

    // Estimate ovulation days based on user's total cycle length
    let ovulationDays: number;
    if (userTotalCycleDays <= 25) {
      ovulationDays = 2;
    } else if (userTotalCycleDays <= 30) {
      ovulationDays = 3;
    } else if (userTotalCycleDays <= 35) {
      ovulationDays = 4;
    } else {
      ovulationDays = 5;
    }

    // Calculate follicular phase as the remaining days
    const follicularDays =
      userTotalCycleDays - menstrualDays - ovulationDays - lutealDays;

    return {
      menstrual: menstrualDays,
      follicular: Math.max(1, follicularDays), // Ensure at least 1 day
      ovulation: ovulationDays,
      luteal: lutealDays,
      totalDays: userTotalCycleDays, // Use user's actual total
    };
  };
  const phaseDurations = getActualPhaseDurations(totalCycleDays);
  const actualTotalCycleDays = phaseDurations.totalDays; // Use user's actual total

  // Calculate cumulative phase boundaries based on actual days
  const getCumulativePhaseBoundaries = () => {
    let cumulativeDays = 0;
    const boundaries = [];

    // Menstrual phase: days 1 to menstrualDays
    cumulativeDays += phaseDurations.menstrual;
    boundaries.push(cumulativeDays);

    // Follicular phase: next follicularDays
    cumulativeDays += phaseDurations.follicular;
    boundaries.push(cumulativeDays);

    // Ovulation phase: next ovulationDays
    cumulativeDays += phaseDurations.ovulation;
    boundaries.push(cumulativeDays);

    // Luteal phase: remaining days (should equal actualTotalCycleDays)
    boundaries.push(actualTotalCycleDays);

    return boundaries;
  };

  const PHASE_BOUNDARIES = getCumulativePhaseBoundaries();

  // Get segment index based on cycle day and actual phase boundaries
  const getSegmentFromCycleDay = (day: number) => {
    const clampedDay = Math.max(1, Math.min(day, actualTotalCycleDays));

    for (let i = 0; i < PHASE_BOUNDARIES.length; i++) {
      const boundary = PHASE_BOUNDARIES[i];
      if (boundary !== undefined && clampedDay <= boundary) {
        return i;
      }
    }
    return SEGMENT_COUNT - 1; // Last segment (Luteal)
  };

  // Get progress within current segment based on actual days in that phase
  const getProgressInSegment = (day: number, segmentIndex: number) => {
    const clampedDay = Math.max(1, Math.min(day, actualTotalCycleDays));

    // Get the start and end days for the current phase
    const phaseStartDay =
      segmentIndex > 0 ? (PHASE_BOUNDARIES[segmentIndex - 1] ?? 0) + 1 : 1;
    const phaseEndDay = PHASE_BOUNDARIES[segmentIndex] ?? actualTotalCycleDays;
    const phaseTotalDays = phaseEndDay - phaseStartDay + 1;

    // Calculate which day within the phase we're on
    const dayWithinPhase = clampedDay - phaseStartDay + 1;

    // Calculate progress as a percentage of completion within the phase
    const progressInSegment = Math.max(
      0,
      Math.min(1, (dayWithinPhase - 1) / Math.max(1, phaseTotalDays - 1)),
    );

    return progressInSegment;
  };

  const getCurrentPhaseInfo = () => {
    if (todayRecord) {
      return {phase: phaseMap[todayRecord.color], color: todayRecord.color};
    }
    return {phase: 'Luteal', color: '#049299'};
  };

  const calculateIndicatorPosition = (day: number) => {
    // Ensure day is within bounds using user's actual total cycle days
    const clampedDay = Math.max(1, Math.min(day, actualTotalCycleDays));

    // Get the correct segment based on actual phase boundaries
    const segmentIndex = getSegmentFromCycleDay(clampedDay);

    // Get progress within the current segment (0 to 1)
    const progressInSegment = getProgressInSegment(clampedDay, segmentIndex);

    // Calculate segment boundaries for visual rendering
    const totalSegmentSpace = FULL_CIRCLE / SEGMENT_COUNT;
    const segmentStartAngle = -Math.PI / 2 + segmentIndex * totalSegmentSpace;
    const segmentCenter = segmentStartAngle + totalSegmentSpace / 2;
    const actualSegmentStartAngle = segmentCenter - EFFECTIVE_SEGMENT_ANGLE / 2;
    const actualSegmentEndAngle = segmentCenter + EFFECTIVE_SEGMENT_ANGLE / 2;

    // Calculate the angle within the actual segment based on progress
    // The indicator will move from start to end of the segment based on days completed in that phase
    const angleWithinSegment =
      actualSegmentStartAngle +
      (actualSegmentEndAngle - actualSegmentStartAngle) * progressInSegment;

    const x = SIZE / 2 + RADIUS * Math.cos(angleWithinSegment);
    const y = SIZE / 2 + RADIUS * Math.sin(angleWithinSegment);

    // Return position and the current segment index for color mapping
    return {x, y, segmentIndex};
  };

  const renderSegments = () => {
    const totalSegmentSpace = FULL_CIRCLE / SEGMENT_COUNT;
    let startAngle = -Math.PI / 2; // Start from the top

    return SEGMENT_COLORS.map((color, index) => {
      // Center each smaller segment within its allocated space
      const segmentCenter = startAngle + totalSegmentSpace / 2;
      const segmentStartAngle = segmentCenter - EFFECTIVE_SEGMENT_ANGLE / 2;
      const segmentEndAngle = segmentCenter + EFFECTIVE_SEGMENT_ANGLE / 2;

      const largeArcFlag = EFFECTIVE_SEGMENT_ANGLE > Math.PI ? 1 : 0;

      const startX = SIZE / 2 + RADIUS * Math.cos(segmentStartAngle);
      const startY = SIZE / 2 + RADIUS * Math.sin(segmentStartAngle);
      const endX = SIZE / 2 + RADIUS * Math.cos(segmentEndAngle);
      const endY = SIZE / 2 + RADIUS * Math.sin(segmentEndAngle);

      const pathData = `
        M ${startX} ${startY}
        A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY}
      `;

      startAngle += totalSegmentSpace; // Move to next segment position

      return (
        <Path
          key={index}
          d={pathData}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round" // Rounded edges for smooth transitions
        />
      );
    });
  };

  const phaseInfo = getCurrentPhaseInfo();

  // Get the current segment index and color for the indicator
  const getCurrentSegmentInfo = () => {
    if (todayRecord?.cycle_day === undefined) {
      return {color: phaseInfo.color, segmentIndex: 0};
    }

    const clampedDay = Math.max(
      1,
      Math.min(todayRecord.cycle_day, actualTotalCycleDays),
    );
    const segmentIndex = getSegmentFromCycleDay(clampedDay);
    const segmentColor = SEGMENT_COLORS[segmentIndex];

    return {color: segmentColor, segmentIndex};
  };

  const currentSegmentInfo = getCurrentSegmentInfo();
  const indicatorColor = currentSegmentInfo.color;

  // Calculate dynamic image size based on the current day
  const calculateImageSize = () => {
    const minSize = 80;
    const maxSize = 130;

    if (todayRecord?.cycle_day === undefined) {
      return minSize; // Use minimum size when no data
    }

    // Use actual total cycle days for size calculation
    const sizeStep = (maxSize - minSize) / (actualTotalCycleDays - 1);
    return minSize + (todayRecord?.cycle_day - 1) * sizeStep;
  };

  const imageSize = calculateImageSize();

  // Only render indicator if we have valid day data
  const renderIndicator = () => {
    if (todayRecord?.cycle_day === undefined) {
      return null; // Don't render indicator when no data
    }

    const {x: indicatorX, y: indicatorY} = calculateIndicatorPosition(
      todayRecord?.cycle_day,
    );

    // Ensure we have a valid color
    const safeIndicatorColor = indicatorColor || '#049299';

    return (
      <Circle
        cx={indicatorX}
        cy={indicatorY}
        r={10}
        fill={safeIndicatorColor}
      />
    );
  };

  return (
    <View>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Render Segments */}
        {renderSegments()}

        {/* Progress Indicator - only if we have data */}
        {renderIndicator()}
      </Svg>

      {/* Dynamic Center Image */}
      <View style={styles.centeredImageContainer}>
        <Image
          source={IMAGES.logo}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredImageContainer: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgress;
