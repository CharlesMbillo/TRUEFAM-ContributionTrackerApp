import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageSquare, Mail, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface ContributionCardProps {
  contribution: {
    senderName: string;
    amount: number;
    memberId: string;
    date: string;
    source: 'SMS' | 'Email';
    parseStatus: 'success' | 'failed' | 'pending';
  };
}

export function ContributionCard({ contribution }: ContributionCardProps) {
  const getSourceIcon = () => {
    return contribution.source === 'SMS' ? 
      <MessageSquare size={16} color="#3B82F6" /> : 
      <Mail size={16} color="#8B5CF6" />;
  };

  const getStatusIcon = () => {
    switch (contribution.parseStatus) {
      case 'success':
        return <CheckCircle size={16} color="#10B981" />;
      case 'failed':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <View style={styles.sourceInfo}>
          {getSourceIcon()}
          <Text style={styles.source}>{contribution.source}</Text>
        </View>
        {getStatusIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.senderName}>{contribution.senderName}</Text>
        <Text style={styles.amount}>{formatCurrency(contribution.amount)}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.memberId}>ID: {contribution.memberId}</Text>
        <Text style={styles.date}>{contribution.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});