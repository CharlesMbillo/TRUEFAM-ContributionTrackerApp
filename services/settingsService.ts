import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  notifications: boolean;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  autoSync: boolean;
  dailyReports: boolean;
  weeklyReports: boolean;
}

class SettingsService {
  private storageKey = 'app_settings';

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  async updateSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  async testConnection(service: string): Promise<void> {
    try {
      // Mock connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (service) {
        case 'WhatsApp':
          // Test WhatsApp connection
          break;
        case 'Email':
          // Test email connection
          break;
        case 'Google Sheets':
          // Test Google Sheets connection
          break;
        default:
          throw new Error(`Unknown service: ${service}`);
      }
    } catch (error) {
      throw new Error(`${service} connection test failed`);
    }
  }

  private getDefaultSettings(): AppSettings {
    return {
      notifications: true,
      whatsappEnabled: true,
      emailEnabled: true,
      autoSync: true,
      dailyReports: true,
      weeklyReports: false,
    };
  }
}

export const settingsService = new SettingsService();