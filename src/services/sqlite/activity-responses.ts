import DBHelper, {ColumnDefinition} from '@/utils/db-helper';

const ActivityResponsesDB = new DBHelper('activity_responses');

const activityResponsesSchema: ColumnDefinition[] = [
  {
    column_name: 'id',
    datatype: 'INTEGER',
    isPrimaryKey: true,
    isAutoIncrement: true,
  },
  {column_name: 'video_id', datatype: 'TEXT', isNull: false},
  {column_name: 'activity_id', datatype: 'TEXT', isNull: false},
  {column_name: 'response_text', datatype: 'TEXT', isNull: false},
  {column_name: 'response_type', datatype: 'TEXT', isNull: false}, // 'single' or 'multiple'
  {column_name: 'created_at', datatype: 'TEXT', isNull: false},
  {column_name: 'updated_at', datatype: 'TEXT', isNull: false},
];

export interface ActivityResponseRecord {
  id?: number;
  video_id: string;
  activity_id: string;
  response_text: string;
  response_type: 'single' | 'multiple';
  created_at?: string;
  updated_at?: string;
}

const tableAndDefinitions: Record<string, ColumnDefinition[]> = {
  activity_responses: activityResponsesSchema,
};

export const createActivityResponsesTables = async (): Promise<boolean> => {
  try {
    const tables = Object.keys(tableAndDefinitions);
    for (const tName of tables) {
      const schema = tableAndDefinitions[tName];
      if (schema) {
        await ActivityResponsesDB.createTable(tName, schema);
      }
    }
    console.log('Activity responses tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating activity responses tables:', error);
    return false;
  }
};

export const saveActivityResponseToDB = async (
  record: Omit<ActivityResponseRecord, 'id' | 'created_at' | 'updated_at'>,
): Promise<number | null> => {
  try {
    const now = new Date().toISOString();

    // Check if record already exists
    const existingRecords = await ActivityResponsesDB.fetchRecords(
      'activity_responses',
      [
        {key: 'video_id', operator: '=', value: record.video_id},
        {key: 'activity_id', operator: '=', value: record.activity_id},
      ],
    );

    if (existingRecords.length > 0) {
      // Update existing record
      await ActivityResponsesDB.updateRecord(
        'activity_responses',
        {
          response_text: record.response_text,
          response_type: record.response_type,
          updated_at: now,
        },
        [
          {key: 'video_id', operator: '=', value: record.video_id},
          {key: 'activity_id', operator: '=', value: record.activity_id},
        ],
      );
      console.log('Activity response updated successfully');
      return existingRecords[0].id;
    } else {
      // Insert new record
      const insertId = await ActivityResponsesDB.insertRecord(
        'activity_responses',
        {
          ...record,
          created_at: now,
          updated_at: now,
        },
      );
      console.log('Activity response saved successfully');
      return insertId;
    }
  } catch (error) {
    console.error('Error saving activity response:', error);
    return null;
  }
};

export const getActivityResponseFromDB = async (
  videoId: string,
  activityId: string,
): Promise<ActivityResponseRecord | null> => {
  try {
    const records = await ActivityResponsesDB.fetchRecords(
      'activity_responses',
      [
        {key: 'video_id', operator: '=', value: videoId},
        {key: 'activity_id', operator: '=', value: activityId},
      ],
    );
    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error fetching activity response:', error);
    return null;
  }
};

export const getAllActivityResponsesFromDB = async (
  videoId?: string,
): Promise<ActivityResponseRecord[]> => {
  try {
    const conditions = videoId
      ? [{key: 'video_id', operator: '=' as const, value: videoId}]
      : [];

    const records = await ActivityResponsesDB.fetchRecords(
      'activity_responses',
      conditions,
      ['*'],
      {column: 'created_at', direction: 'DESC'},
    );
    return records;
  } catch (error) {
    console.error('Error fetching activity responses:', error);
    return [];
  }
};

export const deleteActivityResponseFromDB = async (
  videoId: string,
  activityId: string,
): Promise<boolean> => {
  try {
    await ActivityResponsesDB.deleteRecord('activity_responses', [
      {key: 'video_id', operator: '=' as const, value: videoId},
      {key: 'activity_id', operator: '=' as const, value: activityId},
    ]);
    console.log('Activity response deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting activity response:', error);
    return false;
  }
};
