import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageSquare, Send, Clock } from 'lucide-react-native';

interface WhatsAppPreviewProps {
  lastReport: Date | null;
  onSendReport: () => void;
}

export function WhatsAppPreview({ lastReport, onSendReport }: WhatsAppPreviewProps) {
  const formatLastReport = () => {
    if (!lastReport) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(lastReport);
  };

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <View style={styles.messageHeader}>
          <MessageSquare size={16} color="#10B981" />
          <Text style={styles.messageTitle}>Daily Report Preview</Text>
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>
            📊 TRUEFAM Daily Report{'\n'}
            💰 Total: $1,240.00{'\n'}
            📈 Contributions: 24{'\n'}
            👥 Members: 18{'\n'}
            ⚠️ Failed: 2{'\n'}
            🔗 View Sheet: bit.ly/truefam-sheet
          </Text>
        </View>
      </View>
      
      <View style={styles.controls}>
        <View style={styles.lastReportInfo}>
          <Clock size={14} color="#9CA3AF" />
          <Text style={styles.lastReportText}>
            Last sent: {formatLastReport()}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.sendButton} onPress={onSendReport}>
          <Send size={16} color="#FFFFFF" />
          <Text style={styles.sendButtonText}>Send Now</Text>
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
  preview: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 6,
  },
  messageContent: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
  },
  messageText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastReportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastReportText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});