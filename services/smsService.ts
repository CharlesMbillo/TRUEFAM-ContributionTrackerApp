import { Platform } from 'react-native';
import { contributionService } from './contributionService';
import { parsePaymentMessage } from '../utils/messageParser';

class SmsService {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  async startMonitoring(): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('SMS monitoring not available on web platform');
      return;
    }

    try {
      // Request SMS permissions (Android only)
      const hasPermission = await this.requestSmsPermission();
      if (!hasPermission) {
        throw new Error('SMS permission not granted');
      }

      this.isMonitoring = true;
      this.monitoringInterval = setInterval(() => {
        this.checkForNewSms();
      }, 5000); // Check every 5 seconds

      console.log('SMS monitoring started');
    } catch (error) {
      console.error('Error starting SMS monitoring:', error);
      throw error;
    }
  }

  async stopMonitoring(): Promise<void> {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('SMS monitoring stopped');
  }

  private async requestSmsPermission(): Promise<boolean> {
    // Mock permission request for now
    // In a real implementation, use expo-permissions or react-native-permissions
    return true;
  }

  private async checkForNewSms(): Promise<void> {
    try {
      // Mock SMS reading - in real implementation, use react-native-sms-retriever
      // or similar library to read SMS messages
      const mockSmsMessages = this.getMockSmsMessages();
      
      for (const message of mockSmsMessages) {
        await this.processSmsMessage(message);
      }
    } catch (error) {
      console.error('Error checking for new SMS:', error);
    }
  }

  private async processSmsMessage(message: any): Promise<void> {
    try {
      const parsed = parsePaymentMessage(message.body, 'SMS');
      
      if (parsed) {
        await contributionService.addContribution({
          senderName: parsed.senderName,
          amount: parsed.amount,
          memberId: parsed.memberId,
          date: parsed.date,
          source: 'SMS',
          parseStatus: 'success',
          rawMessage: message.body,
        });
      } else {
        // Failed to parse - add as failed for manual review
        await contributionService.addContribution({
          senderName: 'Unknown',
          amount: 0,
          memberId: 'Unknown',
          date: new Date().toISOString(),
          source: 'SMS',
          parseStatus: 'failed',
          rawMessage: message.body,
        });
      }
    } catch (error) {
      console.error('Error processing SMS message:', error);
    }
  }

  private getMockSmsMessages() {
    // Mock SMS messages for testing
    return [
      {
        body: 'Zelle payment received: $25.00 from Jane Doe. Memo: Member ID 918245',
        address: '+1234567890',
        date: Date.now(),
      },
      {
        body: 'Venmo: You received $30.00 from John Smith. Note: 784293',
        address: '+1234567891',
        date: Date.now(),
      },
    ];
  }

  async testConnection(): Promise<void> {
    if (Platform.OS === 'web') {
      throw new Error('SMS not available on web platform');
    }
    
    // Mock test - in real implementation, test SMS permissions and functionality
    const hasPermission = await this.requestSmsPermission();
    if (!hasPermission) {
      throw new Error('SMS permission not granted');
    }
  }

  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }
}

export const smsService = new SmsService();