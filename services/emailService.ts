import { contributionService } from './contributionService';
import { parsePaymentMessage } from '../utils/messageParser';

class EmailService {
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  async startMonitoring(): Promise<void> {
    try {
      this.isMonitoring = true;
      this.monitoringInterval = setInterval(() => {
        this.checkForNewEmails();
      }, 30000); // Check every 30 seconds

      console.log('Email monitoring started');
    } catch (error) {
      console.error('Error starting email monitoring:', error);
      throw error;
    }
  }

  async stopMonitoring(): Promise<void> {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Email monitoring stopped');
  }

  private async checkForNewEmails(): Promise<void> {
    try {
      // Mock email reading - in real implementation, use IMAP to connect to Gmail
      const mockEmails = this.getMockEmails();
      
      for (const email of mockEmails) {
        await this.processEmail(email);
      }
    } catch (error) {
      console.error('Error checking for new emails:', error);
    }
  }

  private async processEmail(email: any): Promise<void> {
    try {
      const parsed = parsePaymentMessage(email.body, 'Email');
      
      if (parsed) {
        await contributionService.addContribution({
          senderName: parsed.senderName,
          amount: parsed.amount,
          memberId: parsed.memberId,
          date: parsed.date,
          source: 'Email',
          parseStatus: 'success',
          rawMessage: email.body,
        });
      } else {
        // Failed to parse - add as failed for manual review
        await contributionService.addContribution({
          senderName: email.from || 'Unknown',
          amount: 0,
          memberId: 'Unknown',
          date: new Date().toISOString(),
          source: 'Email',
          parseStatus: 'failed',
          rawMessage: email.body,
        });
      }
    } catch (error) {
      console.error('Error processing email:', error);
    }
  }

  private getMockEmails() {
    // Mock emails for testing
    return [
      {
        from: 'noreply@venmo.com',
        subject: 'You received a payment',
        body: 'Hi! You received $20.00 from Sarah Johnson for Member ID: 892374',
        date: Date.now(),
      },
      {
        from: 'noreply@cash.app',
        subject: 'You received $15.00',
        body: 'Cash App: You received $15.00 from Mike Brown. Note: Account No 673892',
        date: Date.now(),
      },
    ];
  }

  async testConnection(): Promise<void> {
    // Mock test - in real implementation, test IMAP connection
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email connection test successful');
    } catch (error) {
      throw new Error('Email connection test failed');
    }
  }

  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }
}

export const emailService = new EmailService();