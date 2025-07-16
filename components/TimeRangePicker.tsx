import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';

interface TimeRangePickerProps {
  startDate: Date;
  endDate: Date;
  onTimeRangeChange: (range: { startDate: Date; endDate: Date }) => void;
}

export function TimeRangePicker({ startDate, endDate, onTimeRangeChange }: TimeRangePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const setQuickRange = (hours: number) => {
    const now = new Date();
    const end = new Date(now.getTime() + hours * 60 * 60 * 1000);
    onTimeRangeChange({ startDate: now, endDate: end });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateRange}>
        <TouchableOpacity style={styles.dateButton}>
          <Calendar size={16} color="#3B82F6" />
          <Text style={styles.dateText}>From: {formatDate(startDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton}>
          <Clock size={16} color="#3B82F6" />
          <Text style={styles.dateText}>To: {formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.quickRanges}>
        <TouchableOpacity 
          style={styles.quickButton}
          onPress={() => setQuickRange(1)}
        >
          <Text style={styles.quickButtonText}>1 Hour</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickButton}
          onPress={() => setQuickRange(24)}
        >
          <Text style={styles.quickButtonText}>24 Hours</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickButton}
          onPress={() => setQuickRange(168)}
        >
          <Text style={styles.quickButtonText}>1 Week</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  dateRange: {
    marginBottom: 15,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  quickRanges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});