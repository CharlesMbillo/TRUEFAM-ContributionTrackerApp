import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Contribution {
  id: string;
  senderName: string;
  amount: number;
  memberId: string;
  date: string;
  source: 'SMS' | 'Email';
  parseStatus: 'success' | 'failed' | 'pending';
  rawMessage: string;
  timestamp: string;
}

class ContributionService {
  private storageKey = 'contributions';

  async getAllContributions(): Promise<Contribution[]> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading contributions:', error);
      return [];
    }
  }

  async addContribution(contribution: Omit<Contribution, 'id' | 'timestamp'>): Promise<void> {
    try {
      const contributions = await this.getAllContributions();
      const newContribution: Contribution = {
        ...contribution,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      
      contributions.push(newContribution);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(contributions));
    } catch (error) {
      console.error('Error adding contribution:', error);
      throw error;
    }
  }

  async updateContribution(id: string, updates: Partial<Contribution>): Promise<void> {
    try {
      const contributions = await this.getAllContributions();
      const index = contributions.findIndex(c => c.id === id);
      
      if (index !== -1) {
        contributions[index] = { ...contributions[index], ...updates };
        await AsyncStorage.setItem(this.storageKey, JSON.stringify(contributions));
      }
    } catch (error) {
      console.error('Error updating contribution:', error);
      throw error;
    }
  }

  async deleteContribution(id: string): Promise<void> {
    try {
      const contributions = await this.getAllContributions();
      const filtered = contributions.filter(c => c.id !== id);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting contribution:', error);
      throw error;
    }
  }

  async getContributionsByDateRange(startDate: Date, endDate: Date): Promise<Contribution[]> {
    try {
      const contributions = await this.getAllContributions();
      return contributions.filter(c => {
        const contributionDate = new Date(c.timestamp);
        return contributionDate >= startDate && contributionDate <= endDate;
      });
    } catch (error) {
      console.error('Error filtering contributions by date:', error);
      return [];
    }
  }

  async getContributionsByStatus(status: 'success' | 'failed' | 'pending'): Promise<Contribution[]> {
    try {
      const contributions = await this.getAllContributions();
      return contributions.filter(c => c.parseStatus === status);
    } catch (error) {
      console.error('Error filtering contributions by status:', error);
      return [];
    }
  }

  async clearAllContributions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing contributions:', error);
      throw error;
    }
  }
}

export const contributionService = new ContributionService();