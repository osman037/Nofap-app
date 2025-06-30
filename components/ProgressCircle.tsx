import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressCircleProps {
  isDark: boolean;
}

export default function ProgressCircle({ isDark }: ProgressCircleProps) {
  const [days, setDays] = useState(0);
  const [timeString, setTimeString] = useState('00:00:00');
  const [animatedValue] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    startPulseAnimation();
    return () => clearInterval(interval);
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const updateProgress = async () => {
    try {
      const startTime = await AsyncStorage.getItem('challengeStartTime');
      if (startTime) {
        const start = new Date(startTime);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        
        const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setDays(daysPassed);
        setTimeString(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        
        // Animate progress fill
        Animated.timing(animatedValue, {
          toValue: Math.min(daysPassed / 90, 1), // Fill over 90 days
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getMotivationalMessage = () => {
    if (days === 0) return "🌱 Your journey begins now!";
    if (days < 7) return "💪 Building momentum...";
    if (days < 30) return "🔥 Forming new habits!";
    if (days < 90) return "⚡ Transformation in progress!";
    return "🏆 You're unstoppable!";
  };

  const getMilestoneReward = () => {
    if (days >= 90) return "🎖️ Master";
    if (days >= 30) return "🥉 Champion";
    if (days >= 7) return "🏅 Warrior";
    if (days >= 1) return "⭐ Beginner";
    return "🌟 Starter";
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
        🎯 Challenge Progress
      </Text>
      
      <Animated.View style={[styles.circleContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={[styles.outerRing, { borderColor: isDark ? '#4CAF50' : '#2E7D32' }]}>
          <View style={[styles.middleRing, { borderColor: isDark ? '#66BB6A' : '#4CAF50' }]}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  height: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(46, 125, 50, 0.3)',
                }
              ]}
            />
            <View style={styles.innerContent}>
              <Text style={styles.rewardBadge}>{getMilestoneReward()}</Text>
              <Text style={[styles.daysText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                {days}
              </Text>
              <Text style={[styles.daysLabel, { color: isDark ? '#fff' : '#000' }]}>
                {days === 1 ? 'Day' : 'Days'} Clean
              </Text>
              <View style={[styles.timeContainer, { backgroundColor: isDark ? '#2a2a3e' : '#f0f0f0' }]}>
                <Text style={[styles.timeText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                  {timeString}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
      
      <View style={styles.messageContainer}>
        <Text style={[styles.motivationMessage, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
          {getMotivationalMessage()}
        </Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8' }]}>
          <Text style={[styles.statIcon]}>⏰</Text>
          <Text style={[styles.statNumber, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>{days * 24}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Hours</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8' }]}>
          <Text style={[styles.statIcon]}>💎</Text>
          <Text style={[styles.statNumber, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>{Math.floor(days / 7)}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Weeks</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8' }]}>
          <Text style={[styles.statIcon]}>🔥</Text>
          <Text style={[styles.statNumber, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>{days}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Streak</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 85,
  },
  innerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardBadge: {
    fontSize: 16,
    marginBottom: 5,
  },
  daysText: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  timeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 85,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});