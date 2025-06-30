import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StartChallengeModalProps {
  visible: boolean;
  onStartChallenge: () => void;
}

const { width, height } = Dimensions.get('window');

export default function StartChallengeModal({ visible, onStartChallenge }: StartChallengeModalProps) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartChallenge = async () => {
    setIsStarting(true);
    try {
      const startTime = Date.now();
      await AsyncStorage.setItem('challengeStartTime', startTime.toString());
      await AsyncStorage.setItem('hasStartedChallenge', 'true');
      onStartChallenge();
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
    setIsStarting(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.bismillah}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>
            <Text style={styles.title}>NoFap Journey</Text>
            <Text style={styles.subtitle}>Your Path to Self-Control</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.verse}>"وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ"</Text>
            <Text style={styles.translation}>"And those who guard their private parts"</Text>
            <Text style={styles.reference}>- Quran 23:5</Text>
            
            <Text style={styles.description}>
              Start your journey towards self-discipline and spiritual growth. 
              May Allah give you strength and guidance.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.startButton, isStarting && styles.startButtonDisabled]}
            onPress={handleStartChallenge}
            disabled={isStarting}
          >
            <Text style={styles.startButtonText}>
              {isStarting ? 'Starting...' : 'Start Challenge'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  bismillah: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
  },
  content: {
    alignItems: 'center',
    marginBottom: 30,
  },
  verse: {
    fontSize: 20,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  reference: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#666666',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});