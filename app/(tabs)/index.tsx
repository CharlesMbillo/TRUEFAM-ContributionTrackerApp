import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, DollarSign, Users, MessageSquare, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusCard } from '@/components/StatusCard';
import { ContributionCard } from '@/components/ContributionCard';
import { WhatsAppPreview } from '@/components/WhatsAppPreview';
import { contributionService } from '@/services/contributionService';
import { whatsappService } from '@/services/whatsappService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalContributions: 0,
    activeMembers: 0,
    failedParsed: 0,
  });
  const [recentContributions, setRecentContributions] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastWhatsAppReport, setLastWhatsAppReport] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const contributions = await contributionService.getAllContributions();
      const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
      const uniqueMembers = new Set(contributions.map(c => c.memberId)).size;
      const failedParsed = contributions.filter(c => c.parseStatus === 'failed').length;

      setStats({
        totalAmount,
        totalContributions: contributions.length,
        activeMembers: uniqueMembers,
        failedParsed,
      });

      setRecentContributions(contributions.slice(-5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleSendWhatsAppReport = async () => {
    try {
      const report = await whatsappService.generateDailyReport();
      await whatsappService.sendReport(report);
      setLastWhatsAppReport(new Date());
      Alert.alert('Success', 'WhatsApp report sent successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send WhatsApp report');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>TRUEFAM Tracker</Text>
            <Text style={styles.subtitle}>Contribution Dashboard</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatusCard
              title="Total Amount"
              value={formatCurrency(stats.totalAmount)}
              icon={<DollarSign size={24} color="#10B981" />}
              color="#10B981"
            />
            <StatusCard
              title="Contributions"
              value={stats.totalContributions.toString()}
              icon={<TrendingUp size={24} color="#3B82F6" />}
              color="#3B82F6"
            />
            <StatusCard
              title="Active Members"
              value={stats.activeMembers.toString()}
              icon={<Users size={24} color="#8B5CF6" />}
              color="#8B5CF6"
            />
            <StatusCard
              title="Failed Parsing"
              value={stats.failedParsed.toString()}
              icon={<AlertTriangle size={24} color="#EF4444" />}
              color="#EF4444"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Contributions</Text>
            {recentContributions.length > 0 ? (
              recentContributions.map((contribution, index) => (
                <ContributionCard
                  key={index}
                  contribution={contribution}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No contributions yet</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WhatsApp Reports</Text>
            <WhatsAppPreview
              lastReport={lastWhatsAppReport}
              onSendReport={handleSendWhatsAppReport}
            />
          </View>

          <View style={styles.monitoringSection}>
            <View style={styles.monitoringHeader}>
              <Clock size={20} color="#F59E0B" />
              <Text style={styles.monitoringTitle}>Monitoring Status</Text>
            </View>
            <View style={[styles.statusIndicator, { backgroundColor: isMonitoring ? '#10B981' : '#EF4444' }]}>
              <Text style={styles.statusText}>
                {isMonitoring ? 'Active' : 'Inactive'}
              </Text>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: '#374151',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  monitoringSection: {
    backgroundColor: '#374151',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  monitoringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  monitoringTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  statusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});