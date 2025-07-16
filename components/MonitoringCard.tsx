import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TestTube } from 'lucide-react-native';

interface MonitoringCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  onTest?: () => void;
}

export function MonitoringCard({ title, value, icon, color, onTest }: MonitoringCardProps) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {onTest && (
        <TouchableOpacity style={styles.testButton} onPress={onTest}>
          <TestTube size={14} color="#9CA3AF" />
          <Text style={styles.testButtonText}>Test</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    width: '48%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 6,
    borderRadius: 6,
  },
  testButtonText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});