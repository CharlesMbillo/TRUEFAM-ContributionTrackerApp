import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LogEntry {
  id: string;
  timestamp: string;
  senderName: string;
  amount: number;
  memberId: string;
  source: 'SMS' | 'Email';
  status: 'success' | 'failed' | 'pending';
  message: string;
  parseError?: string;
}

class LogService {
  private storageKey = 'activity_logs';

  async getAllLogs(): Promise<LogEntry[]> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading logs:', error);
      return [];
    }
  }

  async addLog(log: Omit<LogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const logs = await this.getAllLogs();
      const newLog: LogEntry = {
        ...log,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      
      logs.push(newLog);
      
      // Keep only last 1000 logs to prevent storage overflow
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  }

  async getLogsByDateRange(startDate: Date, endDate: Date): Promise<LogEntry[]> {
    try {
      const logs = await this.getAllLogs();
      return logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    } catch (error) {
      console.error('Error filtering logs by date:', error);
      return [];
    }
  }

  async getLogsByStatus(status: 'success' | 'failed' | 'pending'): Promise<LogEntry[]> {
    try {
      const logs = await this.getAllLogs();
      return logs.filter(log => log.status === status);
    } catch (error) {
      console.error('Error filtering logs by status:', error);
      return [];
    }
  }

  async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing logs:', error);
      throw error;
    }
  }

  async exportLogs(logs: LogEntry[]): Promise<void> {
    try {
      // Mock export functionality
      // In real implementation, convert to CSV and save/share
      const csvData = this.convertToCSV(logs);
      console.log('Exporting logs:', csvData);
      
      // Here you would typically use expo-sharing or similar to share the file
    } catch (error) {
      console.error('Error exporting logs:', error);
      throw error;
    }
  }

  private convertToCSV(logs: LogEntry[]): string {
    const headers = ['Timestamp', 'Sender', 'Amount', 'Member ID', 'Source', 'Status', 'Message'];
    const csvRows = [headers.join(',')];
    
    logs.forEach(log => {
      const row = [
        log.timestamp,
        log.senderName,
        log.amount.toString(),
        log.memberId,
        log.source,
        log.status,
        `"${log.message.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
}

export const logService = new LogService();