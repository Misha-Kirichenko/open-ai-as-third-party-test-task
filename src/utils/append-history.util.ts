import { promises as fs } from 'fs';
import { DATA_PATH, HISTORY_FILE_NAME } from 'src/constants';

export const appendHistory = async (dataToAppend: string): Promise<void> => {
  const filePath = `${DATA_PATH}/${HISTORY_FILE_NAME}`;
  try {
    await fs.appendFile(filePath, dataToAppend);
    console.log('new message appended to history file successfully.');
  } catch (err) {
    console.error('Error appending to file:', err);
  }
};
