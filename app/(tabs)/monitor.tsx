import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, MessageSquare, Mail, Smartphone, Calendar, Timer } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MonitoringCard } from '@/components/MonitoringCard';
import { TimeRangePicker } from '@/components/TimeRangePicker';
import { smsService } from '@/services/smsService';
import { emailService } from '@/services/emailService';
import { monitoringService } from '@/services/monitoringService';

export default function Monitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [monitoringStats, setMonitoringStats] = useState({
    smsProcessed: 0,
    emailsProcessed: 0,
    successfulParsed: 0,
    failedParsed: 0,
  });
  const [timeRange, setTimeRange] = useState({
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  useEffect(() => {
    loadMonitoringStats();
  }, []);

  const loadMonitoringStats = async () => {
    try {
      const stats = await monitoringService.getStats();
      setMonitoringStats(stats);
    } catch (error) {
      console.error('Error loading monitoring stats:', error);
    }
  };

  const handleStartMonitoring = async () => {
    try {
      if (smsEnabled) {
        await smsService.startMonitoring();
      }
      if (emailEnabled) {
        await emailService.startMonitoring();
      }
      
      await monitoringService.startMonitoring(timeRange.startDate, timeRange.endDate);
      setIsMonitoring(true);
      Alert.alert('Success', 'Monitoring started successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to start monitoring');
    }
  };

  const handleStopMonitoring = async () => {
    try {
      await monitoringService.stopMonitoring();
      setIsMonitoring(false);
      Alert.alert('Success', 'Monitoring stopped successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop monitoring');
    }
  };

  const handleTestConnection = async (service) => {
    try {
      if (service === 'sms') {
        await smsService.testConnection();
      } else if (service === 'email') {
        await emailService.testConnection();
      }
      Alert.alert('Success', `${service.toUpperCase()} connection test successful!`);
    } catch (error) {
      Alert.alert('Error', `${service.toUpperCase()} connection test failed`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Monitoring Center</Text>
            <Text style={styles.subtitle}>SMS & Email Tracking</Text>
          </View>

          <View style={styles.controlPanel}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlTitle}>Monitoring Controls</Text>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: isMonitoring ? '#EF4444' : '#10B981' }]}
                onPress={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
              >
                {isMonitoring ? <Pause size={20} color="#FFFFFF" /> : <Play size={20} color="#FFFFFF" />}
                <Text style={styles.controlButtonText}>
                  {isMonitoring ? 'Stop' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.serviceToggles}>
              <View style={styles.serviceToggle}>
                <View style={styles.serviceInfo}>
                  <Smartphone size={20} color="#3B82F6" />
                  <Text style={styles.serviceLabel}>SMS Monitoring</Text>
                </View>
                <Switch
                  value={smsEnabled}
                  onValueChange={setSmsEnabled}
                  trackColor={{ false: '#374151', true: '#3B82F6' }}
                  thumbColor={smsEnabled ? '#FFFFFF' : '#9CA3AF'}
                />
              </View>

              <View style={styles.serviceToggle}>
                <View style={styles.serviceInfo}>
                  <Mail size={20} color="#8B5CF6" />
                  <Text style={styles.serviceLabel}>Email Monitoring</Text>
                </View>
                <Switch
                  value={emailEnabled}
                  onValueChange={setEmailEnabled}
                  trackColor={{ false: '#374151', true: '#8B5CF6' }}
                  thumbColor={emailEnabled ? '#FFFFFF' : '#9CA3AF'}
                />
              </View>
            </View>
          </View>

          <View style={styles.timeRangeSection}>
            <Text style={styles.sectionTitle}>Monitoring Time Range</Text>
            <TimeRangePicker
              startDate={timeRange.startDate}
              endDate={timeRange.endDate}
              onTimeRangeChange={setTimeRange}
            />
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Real-time Statistics</Text>
            <View style={styles.statsGrid}>
              <MonitoringCard
                title="SMS Processed"
                value={monitoringStats.smsProcessed}
                icon={<MessageSquare size={24} color="#3B82F6" />}
                color="#3B82F6"
                onTest={() => handleTestConnection('sms')}
              />
              <MonitoringCard
                title="Emails Processed"
                value={monitoringStats.emailsProcessed}
                icon={<Mail size={24} color="#8B5CF6" />}
                color="#8B5CF6"
                onTest={() => handleTestConnection('email')}
              />
              <MonitoringCard
                title="Successfully Parsed"
                value={monitoringStats.successfulParsed}
                icon={<Timer size={24} color="#10B981" />}
                color="#10B981"
              />
              <MonitoringCard
                title="Failed Parsing"
                value={monitoringStats.failedParsed}
                icon={<Calendar size={24} color="#EF4444" />}
                color="#EF4444"
              />
            </View>
          </View>

          <View style={styles.supportedServices}>
            <Text style={styles.sectionTitle}>Supported Payment Services</Text>
            <View style={styles.serviceList}>
              {['Zelle', 'Venmo', 'Cash App', 'M-PESA'].map((service) => (
                <View key={service} style={styles.serviceItem}>
                  <View style={styles.serviceStatus} />
                  <Text style={styles.serviceName}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  controlPanel: {
    backgroundColor: '#374151',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  serviceToggles: {
    gap: 15,
  },
  serviceToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  timeRangeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  supportedServices: {
    marginBottom: 30,
  },
  serviceList: {
    backgroundColor: '#374151',
    padding: 20,
    borderRadius: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});