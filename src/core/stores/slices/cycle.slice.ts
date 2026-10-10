import type {StateCreator} from 'zustand';
import moment from 'moment';
import {
  fetchCycleRecrods,
  insertMultipleCycleRecords,
  updateCycleRecordDateByID,
  deleteCycleRecordByDate,
  clearAllCycleAndSymptomsData,
  clearCycleDataOnly,
  deleteFutureCycleRecords,
  fetchCycleRecordByDate, // Add this import
} from '@/services/sqlite/feminine-health';

// Types
type BlockColorType =
  | '#EF5B70'
  | '#F4B740'
  | '#049299'
  | '#FCE8EB'
  | '#FFF4D8'
  | '#DDF7F4'
  | '#7C77B9'
  | '#C5C1F5'
  | '#E6E0FF';

type DateRecord = {
  id?: string;
  color: BlockColorType;
  textColor: string;
  day: number;
  startingDay?: boolean;
  endingDay?: boolean;
  lastDay?: boolean;
  cycleDay: number;
};

type DateRecordWithDate = {
  id?: string;
  date: string;
  color: string;
  start_date?: number;
  end_date?: number;
  is_last_date?: number;
  day: number;
  cycle_day: number;
};

function getCyclePhaseDays(totalCycleDays: number) {
  const lutealDays = 12;

  let menstrualDays: number;
  if (totalCycleDays <= 24) {
    menstrualDays = 3;
  } else if (totalCycleDays <= 28) {
    menstrualDays = 4;
  } else if (totalCycleDays <= 32) {
    menstrualDays = 5;
  } else {
    menstrualDays = 6;
  }

  let ovulationDays: number;
  if (totalCycleDays <= 25) {
    ovulationDays = 2;
  } else if (totalCycleDays <= 30) {
    ovulationDays = 3;
  } else if (totalCycleDays <= 35) {
    ovulationDays = 4;
  } else {
    ovulationDays = 5;
  }

  // Calculate follicular phase (excludes menstrual days)
  const follicularDays =
    totalCycleDays - menstrualDays - ovulationDays - lutealDays;

  if (follicularDays < 0) {
    console.warn(
      `Calculated follicular days is negative (${follicularDays}). This indicates an invalid totalCycleDays: ${totalCycleDays}. Adjusting to 0.`,
    );
    return {
      menstrual: menstrualDays,
      follicular: 0, // Set to 0 or throw an error
      ovulation: ovulationDays,
      luteal: lutealDays,
    };
  }

  return {
    menstrual: menstrualDays,
    follicular: follicularDays,
    ovulation: ovulationDays,
    luteal: lutealDays,
  };
}

// Cycle state interface
export interface CycleState {
  markedDates: Record<string, DateRecord>;
  lastDate: string;
  lastUpdated: number; // Add this field
  isLoading: boolean;
  error?: string | undefined;
}
// Cycle actions interface
export interface CycleActions {
  // Data fetching
  fetchCycleData: () => Promise<void>;

  // Data manipulation
  addPeriodDates: (
    startDate: moment.Moment,
    endDate: moment.Moment,
    total_cycle_days?: number,
  ) => Promise<void>;
  adjustCycleAndPredictions: (
    newStartDate: moment.Moment,
    total_cycle_days?: number,
  ) => Promise<void>;
  updatePeriodDate: (id: string, newDate: string) => Promise<void>;
  deletePeriodDate: (date: string) => Promise<void>;
  setLastUpdated: (timestamp: number) => void;

  // State setters
  setMarkedDates: (dates: Record<string, DateRecord>) => void;
  setLastDate: (date: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | undefined) => void;

  // Utility functions
  generateContinuesDate: (
    startDate: moment.Moment,
    total_days?: number,
  ) => Record<string, DateRecord>;
  convertToRecord: (list: DateRecordWithDate[]) => Record<string, DateRecord>;
  convertToList: (records: Record<string, DateRecord>) => DateRecordWithDate[];
  clearCycleData: () => void;
}

// Combined cycle slice type
export interface CycleSlice {
  cycle: CycleState & CycleActions;
}

// Initial cycle state
const initialCycleState: CycleState = {
  markedDates: {},
  lastDate: '',
  isLoading: false,
  error: undefined,
  lastUpdated: 0,
};

// Create the cycle slice
const createCycleSlice: StateCreator<CycleSlice, [], [], CycleSlice> = (
  set,
  get,
) => ({
  cycle: {
    ...initialCycleState,

    clearCycleData: () => {
      set(state => ({
        cycle: {
          ...state.cycle,
          ...initialCycleState,
        },
      }));
    },

    setLastUpdated: (timestamp: number) => {
      set(state => ({
        cycle: {
          ...state.cycle,
          lastUpdated: timestamp,
        },
      }));
    },

    // Fetch cycle data from SQLite
    fetchCycleData: async () => {
      const {
        setIsLoading,
        setError,
        setMarkedDates,
        setLastUpdated,
        convertToRecord,
      } = get().cycle;

      try {
        setIsLoading(true);
        setError(undefined);

        const records = await fetchCycleRecrods();
        const convertedRecords = convertToRecord(records);

        setMarkedDates(convertedRecords);

        setLastUpdated(Date.now());
      } catch (error) {
        console.error('Error fetching cycle data:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to fetch cycle data',
        );
      } finally {
        setIsLoading(false);
      }
    },

    // Add new period dates
    addPeriodDates: async (
      startDate: moment.Moment,
      endDate: moment.Moment,
      total_cycle_days = 28,
    ) => {
      const {
        setIsLoading,
        setError,
        setLastUpdated,
        generateContinuesDate,
        convertToList,
        fetchCycleData,
        markedDates,
        adjustCycleAndPredictions,
      } = get().cycle;

      try {
        setIsLoading(true);
        setError(undefined);

        if (startDate.isAfter(endDate)) {
          throw new Error('Start date cannot be after end date');
        }

        if (startDate.isAfter(moment())) {
          throw new Error('Start date cannot be in the future');
        }

        // Check if there's existing cycle data or if the start date already exists
        const hasExistingData = Object.keys(markedDates).length > 0;
        const existingRecordForStartDate = await fetchCycleRecordByDate(
          startDate.format('YYYY-MM-DD'),
        );

        if (hasExistingData || existingRecordForStartDate) {
          console.log(
            'Existing cycle data or start date found, adjusting predictions accordingly...',
          );
          await adjustCycleAndPredictions(startDate, total_cycle_days);
          return; // Exit the function after adjusting predictions
        }

        // Generate the cycle dates
        const newDates = generateContinuesDate(startDate, total_cycle_days);
        const dateList = convertToList(newDates);

        // Save to SQLite
        await insertMultipleCycleRecords(dateList);

        // Refresh the data from SQLite
        await fetchCycleData();
        setLastUpdated(Date.now());
      } catch (error: any) {
        console.error('Error adding period dates:', error);
        setError(error.message || 'Failed to add period dates');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    // Adjust cycle and predictions
    adjustCycleAndPredictions: async (
      newStartDate: moment.Moment,
      total_cycle_days = 28,
    ) => {
      const {
        setIsLoading,
        setError,
        setLastUpdated,
        generateContinuesDate,
        convertToList,
        fetchCycleData,
      } = get().cycle;

      try {
        setIsLoading(true);
        setError(undefined);
        console.log(
          'adjustCycleAndPredictions: Starting adjustment for new start date:',
          newStartDate.format('YYYY-MM-DD'),
          'with total cycle days:',
          total_cycle_days,
        );

        // Format the new start date to 'YYYY-MM-DD' for the database query
        const newStartDateString = newStartDate.format('YYYY-MM-DD');
        console.log(
          'adjustCycleAndPredictions: Deleting future records from:',
          newStartDateString,
        );

        // Delete all future cycle records from the new start date onwards
        const deleteSuccess = await deleteFutureCycleRecords(
          newStartDateString,
        );
        console.log(
          'adjustCycleAndPredictions: deleteFutureCycleRecords success:',
          deleteSuccess,
        );
        if (!deleteSuccess) {
          throw new Error('Failed to delete future cycle predictions');
        }

        // Generate the new cycle dates
        console.log(
          'adjustCycleAndPredictions: Generating new cycle dates with start date:',
          newStartDate.format('YYYY-MM-DD'),
          'and total days:',
          total_cycle_days,
        );
        const newDates = generateContinuesDate(newStartDate, total_cycle_days);
        console.log(
          'adjustCycleAndPredictions: Generated new dates count:',
          Object.keys(newDates).length,
        );
        const dateList = convertToList(newDates);
        console.log(
          'adjustCycleAndPredictions: Converted to list count:',
          dateList.length,
        );

        if (dateList.length === 0) {
          throw new Error('No cycle dates generated for prediction.');
        }

        // Save to SQLite
        console.log(
          'adjustCycleAndPredictions: Inserting new cycle records...',
        );
        await insertMultipleCycleRecords(dateList);
        console.log(
          'adjustCycleAndPredictions: New cycle records inserted successfully.',
        );

        // Refresh the data from SQLite
        await fetchCycleData();
        setLastUpdated(Date.now());
      } catch (error: any) {
        console.error('Error adjusting cycle and predictions:', error);
        setError(error.message || 'Failed to adjust cycle and predictions');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    // Update period date
    updatePeriodDate: async (id: string, newDate: string) => {
      const {setIsLoading, setError, fetchCycleData} = get().cycle;

      try {
        setIsLoading(true);
        setError(undefined);

        await updateCycleRecordDateByID(id, newDate);
        await fetchCycleData();
      } catch (error) {
        console.error('Error updating period date:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to update period date',
        );
      } finally {
        setIsLoading(false);
      }
    },

    // Delete period date
    deletePeriodDate: async (date: string) => {
      const {setIsLoading, setError, fetchCycleData} = get().cycle;

      try {
        setIsLoading(true);
        setError(undefined);

        await deleteCycleRecordByDate(date);
        await fetchCycleData();
      } catch (error) {
        console.error('Error deleting period date:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to delete period date',
        );
      } finally {
        setIsLoading(false);
      }
    },

    // State setters
    setMarkedDates: (markedDates: Record<string, DateRecord>) => {
      set(state => ({
        cycle: {
          ...state.cycle,
          markedDates,
        },
      }));
    },

    setLastDate: (lastDate: string) => {
      set(state => ({
        cycle: {
          ...state.cycle,
          lastDate,
        },
      }));
    },

    setIsLoading: (isLoading: boolean) => {
      set(state => ({
        cycle: {
          ...state.cycle,
          isLoading,
        },
      }));
    },

    setError: (error: string | undefined) => {
      set(state => ({
        cycle: {
          ...state.cycle,
          error,
        },
      }));
    },

    // Utility functions (moved from your calendar screen)
    generateContinuesDate: (startDate: moment.Moment, total_days = 28) => {
      let dateRecords: Record<string, DateRecord> = {};
      let current_date = startDate.clone();
      let last_date = startDate.format('YYYY-MM-DD');

      let cycle_day = 1;

      const markDates = (
        date: moment.Moment,
        color: BlockColorType,
        count: number,
        isLuteal: boolean = false,
        lutealStartDay: number = 0,
      ) => {
        if (count <= 0) {
          console.log(
            `generateContinuesDate: Skipping markDates for ${date.format(
              'YYYY-MM-DD',
            )} due to count <= 0 (${count}).`,
          );
          return; // Don't mark dates if count is zero or negative
        }

        for (let i = 0; i < count; i++) {
          const inst_date = date.clone().add(i, 'days').format('YYYY-MM-DD');

          // Determine textColor based on phase and luteal high-risk days
          let textColor = 'black';
          if (isLuteal && lutealStartDay > 0) {
            const lutealDay = cycle_day - lutealStartDay + 1;
            // High-risk days: days 4-6 of luteal phase
            if (lutealDay >= 4 && lutealDay <= 6) {
              textColor = '#FFDAB9'; // Peach color
            }
          }

          if (i === 0 && i === count - 1) {
            dateRecords[inst_date] = {
              color: color,
              startingDay: true,
              endingDay: true,
              textColor: textColor,
              day: i,
              cycleDay: cycle_day,
            };
          } else if (i === 0) {
            dateRecords[inst_date] = {
              color: color,
              startingDay: true,
              textColor: textColor,
              day: i,
              cycleDay: cycle_day,
            };
          } else if (i === count - 1) {
            dateRecords[inst_date] = {
              color: color,
              endingDay: true,
              textColor: textColor,
              day: i,
              cycleDay: cycle_day,
            };
            last_date = inst_date;
          } else {
            dateRecords[inst_date] = {
              color: color,
              textColor: textColor,
              day: i,
              cycleDay: cycle_day,
            };
          }
          cycle_day += 1;
        }
      };

      console.log(
        `generateContinuesDate: Calculating phase days for total_days: ${total_days}`,
      );
      const {menstrual, follicular, ovulation, luteal} =
        getCyclePhaseDays(total_days);
      console.log(
        `generateContinuesDate: Phases - Menstrual: ${menstrual}, Follicular: ${follicular}, Ovulation: ${ovulation}, Luteal: ${luteal}`,
      );

      // Ensure total_days is at least the sum of minimum phase days
      const minPhaseDays = menstrual + ovulation + luteal;
      if (total_days < minPhaseDays) {
        console.error(
          `generateContinuesDate: Invalid total_days (${total_days}). Must be at least ${minPhaseDays} for valid phase calculation.`,
        );
        throw new Error('Invalid cycle length for prediction.');
      }

      for (let i = 0; i < 20; i++) {
        const lutealStart = cycle_day + menstrual + follicular + ovulation;
        markDates(current_date.clone(), '#FCE8EB', menstrual);
        current_date.add(menstrual, 'days');
        markDates(current_date.clone(), '#E6E0FF', follicular);
        current_date.add(follicular, 'days');
        markDates(current_date.clone(), '#FFF4D8', ovulation);
        current_date.add(ovulation, 'days');
        markDates(current_date.clone(), '#DDF7F4', luteal, true, lutealStart);
        current_date.add(luteal, 'days');
        cycle_day = 1;
      }

      if (dateRecords[last_date]) {
        const lastDateRecord = dateRecords[last_date];
        if (lastDateRecord) {
          dateRecords[last_date] = {
            ...lastDateRecord,
            lastDay: true,
          };
        }
      }

      return dateRecords;
    },

    convertToList: (records: Record<string, DateRecord>) => {
      return Object.entries(records)
        .map(([date, props]) => ({
          date: date,
          color: props.color,
          start_date: props.startingDay ? 1 : 0,
          end_date: props.endingDay ? 1 : 0,
          is_last_date: props.lastDay ? 1 : 0,
          day: props.day,
          cycle_day: props.cycleDay,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },

    convertToRecord: (list: DateRecordWithDate[]) => {
      return list.reduce((acc, item) => {
        const record: DateRecord = {
          color: item.color as BlockColorType,
          startingDay: item.start_date === 1,
          endingDay: item.end_date === 1,
          lastDay: item.is_last_date === 1,
          day: item.day,
          textColor: 'black',
          cycleDay: item.cycle_day,
        };

        if (item.id) {
          record.id = item.id;
        }

        acc[item.date] = record;
        return acc;
      }, {} as Record<string, DateRecord>);
    },
  },
});

export default createCycleSlice;
