import DBHelper, {ColumnDefinition} from '@/utils/db-helper';

const ChatData = new DBHelper('messages');

const chatSchema: ColumnDefinition[] = [
  {column_name: 'id', datatype: 'INTEGER'},
  {column_name: 'message', datatype: 'TEXT'},
  {column_name: 'role', datatype: 'TEXT'},
  {column_name: 'date', datatype: 'TEXT'},
];

export interface ChatSchemaProp {
  message: string;
  role: 'user' | 'assistant';
  date?: string;
}

const tableAndDefinitions: Record<string, ColumnDefinition[]> = {
  general_chat: chatSchema,
};

export const createMessageTables = async () => {
  try {
    const tables = Object.keys(tableAndDefinitions);
    for (const tName of tables) {
      await ChatData.createTable(tName, tableAndDefinitions[tName]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const insertGeneralMessage = async (
  chat: Omit<ChatSchemaProp, 'date'>,
) => {
  try {
    await ChatData.insertRecord('general_chat', {
      ...chat,
      date: new Date().toString(),
    });
  } catch (error) {
    console.error(error);
  }
};

export const fetchGeneralMessages = async () => {
  try {
    const records = await ChatData.fetchRecords(
      'general_chat',
      [],
      ['id', 'message', 'role', 'date'],
      {column: 'date', direction: 'DESC'},
    );
    return records;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const clearGeneralMessages = async () => {
  try {
    await ChatData.truncateTable('general_chat');
  } catch (error) {
    console.error(error);
  }
};

export const clearChatDB = async () => {
  try {
    await ChatData.deleteDatabase();
  } catch (error) {
    console.error(error);
  }
}
