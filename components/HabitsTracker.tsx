import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HabitsTrackerProps {
  isDark: boolean;
}

interface Habit {
  id: string;
  name: string;
  enabled: boolean;
  streak: number;
  completedToday: boolean;
}

const defaultHabits: Habit[] = [
  { id: 'namaz', name: 'Namaz (5 times)', enabled: true, streak: 0, completedToday: false },
  { id: 'workout', name: 'Workout', enabled: true, streak: 0, completedToday: false },
  { id: 'coldshower', name: 'Cold Shower', enabled: true, streak: 0, completedToday: false },
];

export default function HabitsTracker({ isDark }: HabitsTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [animations] = useState(habits.map(() => new Animated.Value(1)));

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      if (stored) {
        const loadedHabits = JSON.parse(stored);
        setHabits(loadedHabits);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const toggleHabit = (id: string, index: number) => {
    const updated = habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    });
    
    // Animate the button
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    saveHabits(updated);
  };

  const enabledHabits = habits.filter(habit => habit.enabled);
  const completedCount = enabledHabits.filter(habit => habit.completedToday).length;
  const completionPercentage = enabledHabits.length > 0 ? (completedCount / enabledHabits.length) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>⚡</Text>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Daily Habits</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
            {completedCount}/{enabledHabits.length} completed ({Math.round(completionPercentage)}%)
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBackground, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
          <View 
            style={[styles.progressBar, { width: `${completionPercentage}%` }]}
          />
        </View>
      </View>

      <View style={styles.habitsContainer}>
        {enabledHabits.map((habit, index) => (
          <Animated.View 
            key={habit.id} 
            style={[{ transform: [{ scale: animations[index] }] }]}
          >
            <TouchableOpacity
              style={[
                styles.habitCard,
                {
                  backgroundColor: habit.completedToday 
                    ? (isDark ? '#2E7D32' : '#4CAF50')
                    : (isDark ? '#2a2a3e' : '#f8f8f8'),
                  borderColor: habit.completedToday ? '#4CAF50' : (isDark ? '#444' : '#ddd')
                }
              ]}
              onPress={() => toggleHabit(habit.id, index)}
              activeOpacity={0.8}
            >
              <View style={styles.habitContent}>
                <View style={styles.habitInfo}>
                  <Text style={[
                    styles.habitName,
                    { color: habit.completedToday ? '#fff' : (isDark ? '#fff' : '#000') }
                  ]}>
                    {habit.name}
                  </Text>
                  <Text style={[
                    styles.streakText,
                    { color: habit.completedToday ? '#fff' : (isDark ? '#4CAF50' : '#2E7D32') }
                  ]}>
                    🔥 {habit.streak} days
                  </Text>
                </View>
                <View style={[
                  styles.checkIcon,
                  { backgroundColor: habit.completedToday ? '#fff' : 'transparent' }
                ]}>
                  <Text style={[
                    styles.checkText,
                    { color: habit.completedToday ? '#4CAF50' : (isDark ? '#666' : '#ccc') }
                  ]}>
                    {habit.completedToday ? '✓' : '○'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Text style={[styles.motivationText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
        "Small daily improvements lead to stunning results"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  habitsContainer: {
    gap: 12,
  },
  habitCard: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  checkText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  motivationText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
  },
});