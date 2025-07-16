import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, Save, Eye, EyeOff } from 'lucide-react-native';

interface ConfigurationModalProps {
  visible: boolean;
  type: string | null;
  onClose: () => void;
}

export function ConfigurationModal({ visible, type, onClose }: ConfigurationModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [config, setConfig] = useState({
    whatsapp: {
      accessToken: '',
      phoneNumberId: '',
      businessAccountId: '',
      groupId: '',
    },
    email: {
      host: 'imap.gmail.com',
      port: '993',
      username: '',
      password: '',
      folder: 'INBOX',
    },
    sheets: {
      spreadsheetId: '',
      range: 'Sheet1!A:E',
      clientId: '',
      clientSecret: '',
    },
  });

  const getTitle = () => {
    switch (type) {
      case 'whatsapp':
        return 'WhatsApp Configuration';
      case 'email':
        return 'Email Configuration';
      case 'sheets':
        return 'Google Sheets Configuration';
      case 'security':
        return 'Security Settings';
      case 'oauth':
        return 'OAuth Configuration';
      default:
        return 'Configuration';
    }
  };

  const handleSave = () => {
    // Save configuration logic here
    onClose();
  };

  const renderWhatsAppConfig = () => (
    <View style={styles.configSection}>
      <Text style={styles.label}>Access Token</Text>
      <TextInput
        style={styles.input}
        value={config.whatsapp.accessToken}
        onChangeText={(text) => setConfig({
          ...config,
          whatsapp: { ...config.whatsapp, accessToken: text }
        })}
        placeholder="Enter your WhatsApp access token"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!showPassword}
      />
      
      <Text style={styles.label}>Phone Number ID</Text>
      <TextInput
        style={styles.input}
        value={config.whatsapp.phoneNumberId}
        onChangeText={(text) => setConfig({
          ...config,
          whatsapp: { ...config.whatsapp, phoneNumberId: text }
        })}
        placeholder="Enter phone number ID"
        placeholderTextColor="#9CA3AF"
      />
      
      <Text style={styles.label}>Business Account ID</Text>
      <TextInput
        style={styles.input}
        value={config.whatsapp.businessAccountId}
        onChangeText={(text) => setConfig({
          ...config,
          whatsapp: { ...config.whatsapp, businessAccountId: text }
        })}
        placeholder="Enter business account ID"
        placeholderTextColor="#9CA3AF"
      />
      
      <Text style={styles.label}>Group ID</Text>
      <TextInput
        style={styles.input}
        value={config.whatsapp.groupId}
        onChangeText={(text) => setConfig({
          ...config,
          whatsapp: { ...config.whatsapp, groupId: text }
        })}
        placeholder="Enter WhatsApp group ID"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );

  const renderEmailConfig = () => (
    <View style={styles.configSection}>
      <Text style={styles.label}>IMAP Host</Text>
      <TextInput
        style={styles.input}
        value={config.email.host}
        onChangeText={(text) => setConfig({
          ...config,
          email: { ...config.email, host: text }
        })}
        placeholder="imap.gmail.com"
        placeholderTextColor="#9CA3AF"
      />
      
      <Text style={styles.label}>Port</Text>
      <TextInput
        style={styles.input}
        value={config.email.port}
        onChangeText={(text) => setConfig({
          ...config,
          email: { ...config.email, port: text }
        })}
        placeholder="993"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={config.email.username}
        onChangeText={(text) => setConfig({
          ...config,
          email: { ...config.email, username: text }
        })}
        placeholder="your-email@gmail.com"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
      />
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          value={config.email.password}
          onChangeText={(text) => setConfig({
            ...config,
            email: { ...config.email, password: text }
          })}
          placeholder="App password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSheetsConfig = () => (
    <View style={styles.configSection}>
      <Text style={styles.label}>Spreadsheet ID</Text>
      <TextInput
        style={styles.input}
        value={config.sheets.spreadsheetId}
        onChangeText={(text) => setConfig({
          ...config,
          sheets: { ...config.sheets, spreadsheetId: text }
        })}
        placeholder="Enter Google Sheets ID"
        placeholderTextColor="#9CA3AF"
      />
      
      <Text style={styles.label}>Range</Text>
      <TextInput
        style={styles.input}
        value={config.sheets.range}
        onChangeText={(text) => setConfig({
          ...config,
          sheets: { ...config.sheets, range: text }
        })}
        placeholder="Sheet1!A:E"
        placeholderTextColor="#9CA3AF"
      />
      
      <Text style={styles.label}>Client ID</Text>
      <TextInput
        style={styles.input}
        value={config.sheets.clientId}
        onChangeText={(text) => setConfig({
          ...config,
          sheets: { ...config.sheets, clientId: text }
        })}
        placeholder="Google OAuth Client ID"
        placeholderTextColor="#9CA3AF"
      />
      
      <Text style={styles.label}>Client Secret</Text>
      <TextInput
        style={styles.input}
        value={config.sheets.clientSecret}
        onChangeText={(text) => setConfig({
          ...config,
          sheets: { ...config.sheets, clientSecret: text }
        })}
        placeholder="Google OAuth Client Secret"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!showPassword}
      />
    </View>
  );

  const renderConfig = () => {
    switch (type) {
      case 'whatsapp':
        return renderWhatsAppConfig();
      case 'email':
        return renderEmailConfig();
      case 'sheets':
        return renderSheetsConfig();
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{getTitle()}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {renderConfig()}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  configSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  cancelButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});