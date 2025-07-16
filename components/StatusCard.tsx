import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export function StatusCard({ title, value, icon, color }: StatusCardProps) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
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
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});