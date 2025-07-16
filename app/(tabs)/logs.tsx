import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, Download } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogEntry } from '@/components/LogEntry';
import { FilterModal } from '@/components/FilterModal';
import { logService } from '@/services/logService';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    dateRange: 'today',
  });

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchQuery, filters]);

  const loadLogs = async () => {
    try {
      const logData = await logService.getAllLogs();
      setLogs(logData);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.memberId.includes(searchQuery) ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    // Apply source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(log => log.source === filters.source);
    }

    // Apply date range filter
    if (filters.dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(log => new Date(log.timestamp) >= today);
    } else if (filters.dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(log => new Date(log.timestamp) >= weekAgo);
    }

    setFilteredLogs(filtered);
  };

  const getStatusStats = () => {
    const stats = {
      success: filteredLogs.filter(log => log.status === 'success').length,
      failed: filteredLogs.filter(log => log.status === 'failed').length,
      pending: filteredLogs.filter(log => log.status === 'pending').length,
    };
    return stats;
  };

  const handleExportLogs = async () => {
    try {
      await logService.exportLogs(filteredLogs);
      // Handle export success
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const statusStats = getStatusStats();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Activity Logs</Text>
          <TouchableOpacity onPress={handleExportLogs} style={styles.exportButton}>
            <Download size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search logs..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Filter size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsBar}>
          <View style={[styles.statItem, { borderColor: '#10B981' }]}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={[styles.statText, { color: '#10B981' }]}>
              {statusStats.success}
            </Text>
          </View>
          <View style={[styles.statItem, { borderColor: '#EF4444' }]}>
            <XCircle size={16} color="#EF4444" />
            <Text style={[styles.statText, { color: '#EF4444' }]}>
              {statusStats.failed}
            </Text>
          </View>
          <View style={[styles.statItem, { borderColor: '#F59E0B' }]}>
            <AlertCircle size={16} color="#F59E0B" />
            <Text style={[styles.statText, { color: '#F59E0B' }]}>
              {statusStats.pending}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.logsList} showsVerticalScrollIndicator={false}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <LogEntry key={index} log={log} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No logs found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </ScrollView>

        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          filters={filters}
          onFiltersChange={setFilters}
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
  exportButton: {
    padding: 8,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  logsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});