import { smsService } from './smsService';
import { emailService } from './emailService';
import { contributionService } from './contributionService';

interface MonitoringStats {
  smsProcessed: number;
  emailsProcessed: number;
  successfulParsed: number;
  failedParsed: number;
}

class MonitoringService {
  private startTime: Date | null = null;
  private endTime: Date | null = null;
  private isActive = false;

  async startMonitoring(startTime: Date, endTime: Date): Promise<void> {
    try {
      this.startTime = startTime;
      this.endTime = endTime;
      this.isActive = true;

      // Start SMS and email monitoring
      await smsService.startMonitoring();
      await emailService.startMonitoring();

      console.log('Monitoring started successfully');
    } catch (error) {
      console.error('Error starting monitoring:', error);
      throw error;
    }
  }

  async stopMonitoring(): Promise<void> {
    try {
      this.isActive = false;
      
      // Stop SMS and email monitoring
      await smsService.stopMonitoring();
      await emailService.stopMonitoring();

      console.log('Monitoring stopped successfully');
    } catch (error) {
      console.error('Error stopping monitoring:', error);
      throw error;
    }
  }

  async getStats(): Promise<MonitoringStats> {
    try {
      const contributions = await contributionService.getAllContributions();
      
      // Filter by monitoring time range if active
      let filteredContributions = contributions;
      if (this.isActive && this.startTime && this.endTime) {
        filteredContributions = contributions.filter(c => {
          const contributionDate = new Date(c.timestamp);
          return contributionDate >= this.startTime! && contributionDate <= this.endTime!;
        });
      }

      const smsProcessed = filteredContributions.filter(c => c.source === 'SMS').length;
      const emailsProcessed = filteredContributions.filter(c => c.source === 'Email').length;
      const successfulParsed = filteredContributions.filter(c => c.parseStatus === 'success').length;
      const failedParsed = filteredContributions.filter(c => c.parseStatus === 'failed').length;

      return {
        smsProcessed,
        emailsProcessed,
        successfulParsed,
        failedParsed,
      };
    } catch (error) {
      console.error('Error getting monitoring stats:', error);
      return {
        smsProcessed: 0,
        emailsProcessed: 0,
        successfulParsed: 0,
        failedParsed: 0,
      };
    }
  }

  isMonitoringActive(): boolean {
    return this.isActive;
  }

  getMonitoringTimeRange(): { startTime: Date | null; endTime: Date | null } {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }
}

export const monitoringService = new MonitoringService();