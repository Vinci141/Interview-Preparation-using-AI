import { PracticeSessionRecord } from '../types';

const HISTORY_STORAGE_KEY = 'interviewPrepHistory';

/**
 * Retrieves the practice session history from localStorage.
 * @returns An array of practice session records, sorted with the newest first.
 */
export const getHistory = (): PracticeSessionRecord[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (historyJson) {
      const records = JSON.parse(historyJson) as PracticeSessionRecord[];
      // Sort by date descending (newest first)
      return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  } catch (error) {
    console.error("Failed to retrieve history from localStorage", error);
    return [];
  }
};

/**
 * Saves a completed practice session to localStorage.
 * @param session The practice session record to save.
 */
export const saveSessionToHistory = (session: PracticeSessionRecord): void => {
  try {
    // We get the unsorted history to avoid sorting twice unnecessarily
    const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
    const currentHistory = historyJson ? JSON.parse(historyJson) : [];
    const updatedHistory = [session, ...currentHistory];
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save session to localStorage", error);
  }
};
