import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings2, Shield, Bell, MessageSquare, Mail, Database, Key, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SettingsSection } from '@/components/SettingsSection';
import { ConfigurationModal } from '@/components/ConfigurationModal';
import { settingsService } from '@/services/settingsService';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    whatsappEnabled: true,
    emailEnabled: true,
    autoSync: true,
    dailyReports: true,
    weeklyReports: false,
  });
  const [configModal, setConfigModal] = useState({ visible: false, type: null });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await settingsService.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      await settingsService.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleConfigureService = (type) => {
    setConfigModal({ visible: true, type });
  };

  const handleTestConnection = async (service) => {
    try {
      await settingsService.testConnection(service);
      Alert.alert('Success', `${service} connection test successful!`);
    } catch (error) {
      Alert.alert('Error', `${service} connection test failed: ${error.message}`);
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              await settingsService.resetSettings();
              await loadSettings();
              Alert.alert('Success', 'Settings have been reset to default');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity onPress={handleResetSettings} style={styles.resetButton}>
            <RefreshCw size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingsSection
            title="Notifications"
            icon={<Bell size={20} color="#3B82F6" />}
          >
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => handleSettingChange('notifications', value)}
                trackColor={{ false: '#374151', true: '#3B82F6' }}
                thumbColor={settings.notifications ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Daily Reports</Text>
              <Switch
                value={settings.dailyReports}
                onValueChange={(value) => handleSettingChange('dailyReports', value)}
                trackColor={{ false: '#374151', true: '#3B82F6' }}
                thumbColor={settings.dailyReports ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Weekly Reports</Text>
              <Switch
                value={settings.weeklyReports}
                onValueChange={(value) => handleSettingChange('weeklyReports', value)}
                trackColor={{ false: '#374151', true: '#3B82F6' }}
                thumbColor={settings.weeklyReports ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </SettingsSection>

          <SettingsSection
            title="WhatsApp Integration"
            icon={<MessageSquare size={20} color="#10B981" />}
          >
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Enable WhatsApp Reports</Text>
              <Switch
                value={settings.whatsappEnabled}
                onValueChange={(value) => handleSettingChange('whatsappEnabled', value)}
                trackColor={{ false: '#374151', true: '#10B981' }}
                thumbColor={settings.whatsappEnabled ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <TouchableOpacity
              style={styles.configButton}
              onPress={() => handleConfigureService('whatsapp')}
            >
              <Text style={styles.configButtonText}>Configure WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTestConnection('WhatsApp')}
            >
              <Text style={styles.testButtonText}>Test Connection</Text>
            </TouchableOpacity>
          </SettingsSection>

          <SettingsSection
            title="Email Integration"
            icon={<Mail size={20} color="#8B5CF6" />}
          >
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Enable Email Monitoring</Text>
              <Switch
                value={settings.emailEnabled}
                onValueChange={(value) => handleSettingChange('emailEnabled', value)}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor={settings.emailEnabled ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <TouchableOpacity
              style={styles.configButton}
              onPress={() => handleConfigureService('email')}
            >
              <Text style={styles.configButtonText}>Configure Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTestConnection('Email')}
            >
              <Text style={styles.testButtonText}>Test Connection</Text>
            </TouchableOpacity>
          </SettingsSection>

          <SettingsSection
            title="Google Sheets"
            icon={<Database size={20} color="#F59E0B" />}
          >
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Auto-sync to Sheets</Text>
              <Switch
                value={settings.autoSync}
                onValueChange={(value) => handleSettingChange('autoSync', value)}
                trackColor={{ false: '#374151', true: '#F59E0B' }}
                thumbColor={settings.autoSync ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <TouchableOpacity
              style={styles.configButton}
              onPress={() => handleConfigureService('sheets')}
            >
              <Text style={styles.configButtonText}>Configure Sheets</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTestConnection('Google Sheets')}
            >
              <Text style={styles.testButtonText}>Test Connection</Text>
            </TouchableOpacity>
          </SettingsSection>

          <SettingsSection
            title="Security"
            icon={<Shield size={20} color="#EF4444" />}
          >
            <TouchableOpacity
              style={styles.securityButton}
              onPress={() => handleConfigureService('security')}
            >
              <Key size={16} color="#EF4444" />
              <Text style={styles.securityButtonText}>Manage API Keys</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.securityButton}
              onPress={() => handleConfigureService('oauth')}
            >
              <Shield size={16} color="#EF4444" />
              <Text style={styles.securityButtonText}>OAuth Settings</Text>
            </TouchableOpacity>
          </SettingsSection>
        </ScrollView>

        <ConfigurationModal
          visible={configModal.visible}
          type={configModal.type}
          onClose={() => setConfigModal({ visible: false, type: null })}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resetButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  configButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  configButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  testButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  securityButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
});