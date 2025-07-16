import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, MessageSquare, Mail, CreditCard as Edit } from 'lucide-react-native';

interface LogEntryProps {
  log: {
    id: string;
    timestamp: string;
    senderName: string;
    amount: number;
    memberId: string;
    source: 'SMS' | 'Email';
    status: 'success' | 'failed' | 'pending';
    message: string;
    parseError?: string;
  };
}

export function LogEntry({ log }: LogEntryProps) {
  const getStatusIcon = () => {
    switch (log.status) {
      case 'success':
        return <CheckCircle size={16} color="#10B981" />;
      case 'failed':
        return <XCircle size={16} color="#EF4444" />;
      case 'pending':
        return <AlertCircle size={16} color="#F59E0B" />;
      default:
        return null;
    }
  };

  const getSourceIcon = () => {
    return log.source === 'SMS' ? 
      <MessageSquare size={14} color="#3B82F6" /> : 
      <Mail size={14} color="#8B5CF6" />;
  };

  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(timestamp));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusInfo}>
          {getStatusIcon()}
          <Text style={styles.timestamp}>{formatTime(log.timestamp)}</Text>
        </View>
        <View style={styles.sourceInfo}>
          {getSourceIcon()}
          <Text style={styles.source}>{log.source}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.senderName}>{log.senderName}</Text>
          <Text style={styles.amount}>{formatCurrency(log.amount)}</Text>
        </View>
        <Text style={styles.memberId}>Member ID: {log.memberId}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {log.message}
        </Text>
      </View>
      
      {log.parseError && (
        <View style={styles.errorSection}>
          <Text style={styles.errorText}>Parse Error: {log.parseError}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={14} color="#3B82F6" />
            <Text style={styles.editButtonText}>Fix</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  content: {
    marginBottom: 10,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  memberId: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 18,
  },
  errorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});