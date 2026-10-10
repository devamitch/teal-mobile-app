import DBHelper, {ColumnDefinition} from '@/utils/db-helper';
import {Toast} from '@/utils/toast';

/**
 * Converts a Date object to a local time string in 'YYYY-MM-DDTHH:MM:SS' format.
 * This format is lexicographically sortable and represents the local wall clock time,
 * without timezone information.
 * @param date The date object to format. Defaults to the current date and time.
 * @returns A string representing the local date and time.
 */
const toLocalISOString = (date: Date = new Date()): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const FeminineCycle = new DBHelper('feminine_cycle');

const feminineTrackerSchema: ColumnDefinition[] = [
  {
    column_name: 'id',
    datatype: 'INTEGER',
    isPrimaryKey: true,
    isAutoIncrement: true,
  },
  {column_name: 'date', datatype: 'TEXT', isNull: false},
  {column_name: 'color', datatype: 'TEXT', isNull: false},
  {column_name: 'start_date', datatype: 'INTEGER'},
  {column_name: 'end_date', datatype: 'INTEGER'},
  {column_name: 'is_last_date', datatype: 'INTEGER'},
  {column_name: 'day', datatype: 'INTEGER', isNull: false},
  {column_name: 'cycle_day', datatype: 'INTEGER', isNull: false},
];

interface FeminineTrackerProps {
  date: string;
  color: string;
  start_date?: number;
  end_date?: number;
  is_last_date?: number;
  day: number;
  cycle_day: number;
}

const thoughtRecord: ColumnDefinition[] = [
  {
    column_name: 'id',
    datatype: 'INTEGER',
    isPrimaryKey: true,
    isAutoIncrement: true,
  },
  {column_name: 'timestamp', datatype: 'TEXT', isNull: false},
  {column_name: 'thought', datatype: 'TEXT', isNull: false},
  {column_name: 'feel', datatype: 'TEXT'},
  {column_name: 'evidence_for', datatype: 'TEXT'},
  {column_name: 'evidence_against', datatype: 'TEXT'},
  {column_name: 'what_i_did', datatype: 'TEXT'},
];

export interface ThoughtRecordProps {
  id: number;
  timestamp: string;
  thought: string;
  feel: string;
  evidence_for: string;
  evidence_against: string;
  what_i_did: string;
}

const symptomsTrackerSchema: ColumnDefinition[] = [
  {
    column_name: 'id',
    datatype: 'INTEGER',
    isPrimaryKey: true,
    isAutoIncrement: true,
  },
  {column_name: 'timestamp', datatype: 'TEXT', isNull: false},
  {column_name: 'symptom_type', datatype: 'TEXT', isNull: false},
  {column_name: 'symptom', datatype: 'TEXT', isNull: false},
  {column_name: 'count', datatype: 'INTEGER', defaultValue: 0},
];

interface SymptomTrackerProps {
  date: string;
  symptom_type: string;
  symptom: string;
  count: number;
}

const tableAndDefinitions: Record<string, ColumnDefinition[]> = {
  feminine_tracker: feminineTrackerSchema,
  symptoms_tracker: symptomsTrackerSchema,
  thought_tracker: thoughtRecord,
};

export const fetchLastGeneratedDate = async () => {
  try {
    const date = await FeminineCycle.fetchRecords(
      'feminine_tracker',
      [
        {
          key: 'is_last_date',
          value: 1,
          operator: '=',
        },
      ],
      ['date'],
    );
    return date[0]?.date;
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const fetchCycleRecordByDate = async (date: string) => {
  try {
    const record = await FeminineCycle.fetchRecords('feminine_tracker', [
      {
        key: 'date',
        value: date,
        operator: '=',
      },
    ]);
    return record[0];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const createFeminineHealthTables = async (): Promise<boolean> => {
  try {
    const tableNames = Object.keys(tableAndDefinitions);
    for (const tName of tableNames) {
      const definition = tableAndDefinitions[tName];
      if (definition) {
        await FeminineCycle.createTable(tName, definition);
      }
    }
    console.log('All feminine health tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating feminine health tables:', error);
    return false;
  }
};

export const insertMultipleCycleRecords = async (
  records: FeminineTrackerProps[],
): Promise<boolean> => {
  try {
    for (const rec of records) {
      await FeminineCycle.insertRecord('feminine_tracker', rec);
    }
    console.log(`Successfully inserted ${records.length} cycle records`);
    return true;
  } catch (error) {
    console.error('Error inserting multiple cycle records:', error);
    throw error; // Re-throw the error to propagate it up
  }
};

export const insertSingleCycleRecords = async (
  record: FeminineTrackerProps,
): Promise<boolean> => {
  try {
    await FeminineCycle.insertRecord('feminine_tracker', record);
    console.log('Successfully inserted single cycle record');
    return true;
  } catch (error) {
    console.error('Error inserting single cycle record:', error);
    throw error; // Re-throw the error to propagate it up
  }
};

export const insertThoughtRecord = async (
  record: Omit<ThoughtRecordProps, 'id' | 'timestamp'>,
): Promise<boolean> => {
  try {
    const newRecord = {
      ...record,
      timestamp: toLocalISOString(new Date()),
    };
    await FeminineCycle.insertRecord('thought_tracker', newRecord);
    console.log('Successfully inserted thought record:', newRecord);
    return true;
  } catch (error) {
    console.error('Error inserting thought record:', error);
    return false;
  }
};

export const fetchCycleRecrods = async (): Promise<FeminineTrackerProps[]> => {
  try {
    const records = await FeminineCycle.fetchRecords(
      'feminine_tracker',
      [],
      [
        'id',
        'date',
        'color',
        'start_date',
        'end_date',
        'is_last_date',
        'day',
        'cycle_day',
      ],
      {column: 'date', direction: 'DESC'},
    );
    console.log(`Fetched ${records.length} cycle records`);
    return records;
  } catch (error) {
    console.error('Error fetching cycle records:', error);
    return [];
  }
};

export const updateCycleRecordDateByID = async (
  id: string,
  new_date: string,
): Promise<boolean> => {
  try {
    const rowsAffected = await FeminineCycle.updateRecord(
      'feminine_tracker',
      {date: new_date},
      [
        {
          key: 'id',
          value: id,
          operator: '=',
        },
      ],
    );
    console.log(`Updated cycle record, rows affected: ${rowsAffected}`);
    return true; // Return true if no error occurs
  } catch (error) {
    console.error('Error updating cycle record by ID:', error);
    return false;
  }
};

export const deleteCycleRecordByDate = async (
  date: string,
): Promise<boolean> => {
  try {
    const rowsAffected = await FeminineCycle.deleteRecord('feminine_tracker', [
      {
        key: 'date',
        value: date,
        operator: '=',
      },
    ]);
    console.log(`Deleted cycle record, rows affected: ${rowsAffected}`);
    return true; // Return true if no error occurs
  } catch (error) {
    console.error('Error deleting cycle record by date:', error);
    return false;
  }
};

export const deleteFutureCycleRecords = async (
  date: string,
): Promise<boolean> => {
  try {
    const rowsAffected = await FeminineCycle.deleteRecord('feminine_tracker', [
      {
        key: 'date',
        value: date,
        operator: '>=',
      },
    ]);
    console.log(
      `Deleted future cycle records from ${date} onwards, rows affected: ${rowsAffected}`,
    );
    return true; // Return true if no error occurs
  } catch (error) {
    console.error('Error deleting future cycle records:', error);
    throw error; // Re-throw the error to propagate it up
  }
};

export const insertSymptomTrackerRecord = async (
  record: Omit<SymptomTrackerProps, 'date'>,
  date?: string,
): Promise<boolean> => {
  try {
    console.log('Inserting symptom record:', record);

    const insertId = await FeminineCycle.insertRecord('symptoms_tracker', {
      symptom_type: record.symptom_type,
      symptom: record.symptom,
      count: record.count || 0,
      // MODIFIED: Use the new helper to get local time string instead of UTC
      timestamp: date ?? toLocalISOString(new Date()),
    });

    console.log(`Successfully inserted symptom record with ID: ${insertId}`);
    Toast(`${record.symptom_type} logged successfully.`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error inserting symptom record:', errorMessage);
    Toast(`Error in logging ${record.symptom_type}: ${errorMessage}`);
    return false;
  }
};

export type SymptomTrackerRecord = {
  id: number;
  symptom_type: string;
  symptom: string;
  timestamp: string; // Local time string
};

export const fetchSymptomRecordCounts = async (
  conditions: (Omit<SymptomTrackerProps, 'date' | 'count'> & {
    from: Date;
    to: Date;
  })[],
): Promise<Record<string, Record<string, number>>> => {
  const result: Record<string, Record<string, number>> = {};

  try {
    for (const con of conditions) {
      try {
        const count = await FeminineCycle.countRecords('symptoms_tracker', [
          {key: 'symptom', value: con.symptom, operator: '='},
          {key: 'symptom_type', value: con.symptom_type, operator: '='},
          // MODIFIED: Use the new helper to format query dates to local time
          {key: 'timestamp', value: toLocalISOString(con.from), operator: '>='},
          {key: 'timestamp', value: toLocalISOString(con.to), operator: '<='},
        ]);

        if (!result[con.symptom_type]) {
          result[con.symptom_type] = {};
        }

        result[con.symptom_type][con.symptom] =
          typeof count === 'number' ? count : 0;

        console.log(`Count for ${con.symptom_type}/${con.symptom}:`, count);
      } catch (error) {
        console.error(
          `Error counting records for ${con.symptom_type}/${con.symptom}:`,
          error,
        );
        if (!result[con.symptom_type]) {
          result[con.symptom_type] = {};
        }
        result[con.symptom_type][con.symptom] = 0;
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching symptom record counts:', error);
    return {};
  }
};

export const fetchSymptomAndMoodLogsByDate = async (
  from: Date,
  to: Date,
): Promise<Record<string, SymptomTrackerRecord[]>> => {
  try {
    // MODIFIED: Use the new helper for logging to show local time
    console.log(
      'Fetching symptom logs from',
      toLocalISOString(from),
      'to',
      toLocalISOString(to),
    );

    const records = await FeminineCycle.fetchRecords(
      'symptoms_tracker',
      [
        // MODIFIED: Use the new helper to format query dates to local time
        {key: 'timestamp', value: toLocalISOString(from), operator: '>='},
        {key: 'timestamp', value: toLocalISOString(to), operator: '<='},
      ],
      ['id', 'symptom_type', 'symptom', 'timestamp'],
      {column: 'timestamp', direction: 'ASC'},
    );

    console.log('Fetched symptom records:', records.length);

    // Group records by date
    const grouped: Record<string, SymptomTrackerRecord[]> = {};

    records.forEach(record => {
      if (record && record.timestamp) {
        const date = record.timestamp.slice(0, 10); // 'YYYY-MM-DD'
        const list = grouped[date] || [];
        list.push({
          id: record.id,
          symptom_type: record.symptom_type,
          symptom: record.symptom,
          timestamp: record.timestamp,
        });
        grouped[date] = list;
      }
    });

    console.log(
      'Grouped symptom logs by date:',
      Object.keys(grouped).length,
      'days with logs',
    );
    return grouped;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching symptom and mood logs:', errorMessage);
    throw new Error(`Failed to fetch symptom logs: ${errorMessage}`);
  }
};

export const fetchThoughtRecordsByDate = async (
  from: Date,
  to: Date,
): Promise<Record<string, ThoughtRecordProps[]>> => {
  try {
    console.log(
      'Fetching thought records from',
      toLocalISOString(from),
      'to',
      toLocalISOString(to),
    );
    const records = await FeminineCycle.fetchRecords(
      'thought_tracker',
      [
        {key: 'timestamp', value: toLocalISOString(from), operator: '>='},
        {key: 'timestamp', value: toLocalISOString(to), operator: '<='},
      ],
      [
        'id',
        'timestamp',
        'thought',
        'feel',
        'evidence_for',
        'evidence_against',
        'what_i_did',
      ],
      {column: 'timestamp', direction: 'ASC'},
    );

    console.log('Fetched thought records:', records.length);

    const grouped: Record<string, ThoughtRecordProps[]> = {};
    records.forEach(record => {
      if (record && record.timestamp) {
        const date = record.timestamp.slice(0, 10); // 'YYYY-MM-DD'
        const list = grouped[date] || [];
        list.push(record);
        grouped[date] = list;
      }
    });

    console.log(
      'Grouped thought records by date:',
      Object.keys(grouped).length,
      'days with logs',
    );
    return grouped;
  } catch (error) {
    console.error('Error fetching thought records:', error);
    return {};
  }
};

export const fetchAllThoughtRecords = async (): Promise<
  ThoughtRecordProps[]
> => {
  try {
    const records = await FeminineCycle.fetchRecords(
      'thought_tracker',
      [],
      [
        'id',
        'timestamp',
        'thought',
        'feel',
        'evidence_for',
        'evidence_against',
        'what_i_did',
      ],
      {column: 'timestamp', direction: 'DESC'},
    );
    console.log(`Fetched ${records.length} thought records`);
    return records;
  } catch (error) {
    console.error('Error fetching thought records:', error);
    return [];
  }
};

export const recreateSymptomsTable = async (): Promise<boolean> => {
  try {
    // Drop the existing table
    await FeminineCycle.deleteTable('symptoms_tracker');

    // Recreate with the updated schema
    await FeminineCycle.createTable('symptoms_tracker', symptomsTrackerSchema);

    console.log('Symptoms tracker table recreated successfully');
    return true;
  } catch (error) {
    console.error('Error recreating symptoms tracker table:', error);
    return false;
  }
};

// Add initialization function to ensure database is ready
export const initializeFeminineHealthDatabase = async (): Promise<boolean> => {
  try {
    console.log('Initializing feminine health database...');

    // Create tables first
    const tablesCreated = await createFeminineHealthTables();

    if (!tablesCreated) {
      throw new Error('Failed to create tables');
    }

    // Check and migrate thought_tracker table if needed
    const thoughtTrackerExists = await FeminineCycle.tableExists(
      'thought_tracker',
    );
    if (thoughtTrackerExists) {
      const thoughtTrackerInfo = await FeminineCycle.getTableInfo(
        'thought_tracker',
      );
      const columnNames = thoughtTrackerInfo.map(col => col.name);
      if (
        !columnNames.includes('evidence_for') ||
        !columnNames.includes('timestamp')
      ) {
        console.log('Old thought_tracker schema detected. Recreating table...');
        await FeminineCycle.deleteTable('thought_tracker');
        const thoughtTrackerSchema = tableAndDefinitions.thought_tracker;
        if (thoughtTrackerSchema) {
          await FeminineCycle.createTable(
            'thought_tracker',
            thoughtTrackerSchema,
          );
        }
        console.log('thought_tracker table recreated successfully.');
      }
    }

    // Also initialize activity responses table
    const {createActivityResponsesTables} = await import(
      './activity-responses'
    );
    const activityTablesCreated = await createActivityResponsesTables();

    if (!activityTablesCreated) {
      console.warn('Failed to create activity responses tables');
    }

    console.log('Feminine health database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing feminine health database:', error);
    return false;
  }
};

export const deleteLastUpdatedSypmtomRecord = async (
  symptom: string,
  symptom_type: string,
  count: number,
) => {
  try {
    const records = await FeminineCycle.fetchRecords('symptoms_tracker', [
      {
        key: 'symptom',
        value: symptom,
        operator: '=',
      },
      {
        key: 'symptom_type',
        value: symptom_type,
        operator: '=',
      },
      {
        key: 'count',
        value: count,
        operator: '=',
      },
    ]);
    if (records.length === 1) {
      const recordToDelete = records[0]!; // Non-null assertion
      await FeminineCycle.deleteRecord('symptoms_tracker', [
        {
          key: 'id',
          value: recordToDelete.id!, // Non-null assertion
          operator: '=',
        },
      ]);
    } else {
      if (records.length === 0) throw new Error('No record found');
      else throw new Error('Multiple records found');
    }
  } catch (error) {
    console.error(error);
  }
};

export const clearAllCycleData = async (): Promise<boolean> => {
  try {
    console.log('Clearing all cycle data from feminine_tracker table...');
    const success = await FeminineCycle.truncateTable('feminine_tracker');
    if (success) {
      console.log('All cycle data cleared successfully');
    }
    return success;
  } catch (error) {
    console.error('Error clearing cycle data:', error);
    return false;
  }
};

export const clearAllSymptomsData = async (): Promise<boolean> => {
  try {
    console.log('Clearing all symptoms data from symptoms_tracker table...');
    const success = await FeminineCycle.truncateTable('symptoms_tracker');
    if (success) {
      console.log('All symptoms data cleared successfully');
    }
    return success;
  } catch (error) {
    console.error('Error clearing symptoms data:', error);
    return false;
  }
};

export const clearAllCycleAndSymptomsData = async (): Promise<boolean> => {
  try {
    console.log('Clearing all cycle and symptoms data...');
    const cycleCleared = await clearAllCycleData();
    const symptomsCleared = await clearAllSymptomsData();

    if (cycleCleared && symptomsCleared) {
      console.log('All cycle and symptoms data cleared successfully');
      return true;
    } else {
      console.warn('Some data may not have been cleared properly');
      return false;
    }
  } catch (error) {
    console.error('Error clearing cycle and symptoms data:', error);
    return false;
  }
};

export const clearCycleDataOnly = async (): Promise<boolean> => {
  try {
    console.log('Clearing cycle data only...');
    const cycleCleared = await clearAllCycleData();

    if (cycleCleared) {
      console.log('Cycle data cleared successfully');
      return true;
    } else {
      console.warn('Cycle data may not have been cleared properly');
      return false;
    }
  } catch (error) {
    console.error('Error clearing cycle data:', error);
    return false;
  }
};

export const clearFemHealthDB = async () => {
  try {
    await FeminineCycle.deleteDatabase();
  } catch (error) {
    console.error(error);
  }
};
