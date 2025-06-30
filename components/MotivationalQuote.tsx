import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MotivationalQuoteProps {
  isDark: boolean;
}

const islamicQuotes = [
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    english: "And whoever fears Allah, He will make for him a way out",
    reference: "Quran 65:2"
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "Indeed, with hardship comes ease",
    reference: "Quran 94:6"
  },
  {
    arabic: "وَاللَّهُ يُحِبُّ الصَّابِرِينَ",
    english: "And Allah loves the patient",
    reference: "Quran 3:146"
  },
  {
    arabic: "وَمَن جَاهَدَ فَإِنَّمَا يُجَاهِدُ لِنَفْسِهِ",
    english: "And whoever strives, strives only for himself",
    reference: "Quran 29:6"
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    english: "Indeed, Allah will not change the condition of a people until they change what is in themselves",
    reference: "Quran 13:11"
  },
  {
    arabic: "وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ",
    english: "And those who guard their private parts",
    reference: "Quran 23:5"
  },
  {
    arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
    english: "Indeed, Allah loves those who repent and those who purify themselves",
    reference: "Quran 2:222"
  },
];

export default function MotivationalQuote({ isDark }: MotivationalQuoteProps) {
  const [currentQuote, setCurrentQuote] = useState(islamicQuotes[0]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const loadDailyQuote = async () => {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('lastQuoteDate');
      const storedIndex = await AsyncStorage.getItem('currentQuoteIndex');
      
      if (storedDate !== today) {
        // New day, get next quote
        const newIndex = storedIndex ? (parseInt(storedIndex) + 1) % islamicQuotes.length : 0;
        setQuoteIndex(newIndex);
        setCurrentQuote(islamicQuotes[newIndex]);
        
        await AsyncStorage.setItem('lastQuoteDate', today);
        await AsyncStorage.setItem('currentQuoteIndex', newIndex.toString());
      } else if (storedIndex) {
        // Same day, use stored quote
        const index = parseInt(storedIndex);
        setQuoteIndex(index);
        setCurrentQuote(islamicQuotes[index]);
      }
    } catch (error) {
      console.error('Error loading daily quote:', error);
    }
  };

  const handleNextQuote = async () => {
    const newIndex = (quoteIndex + 1) % islamicQuotes.length;
    setQuoteIndex(newIndex);
    setCurrentQuote(islamicQuotes[newIndex]);
    
    try {
      await AsyncStorage.setItem('currentQuoteIndex', newIndex.toString());
    } catch (error) {
      console.error('Error saving quote index:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🌙</Text>
        <Text style={[styles.headerText, { color: isDark ? '#fff' : '#000' }]}>Daily Inspiration</Text>
      </View>
      
      <View style={styles.quoteContainer}>
        <Text style={styles.arabicText}>{currentQuote.arabic}</Text>
        <Text style={[styles.englishText, { color: isDark ? '#ccc' : '#555' }]}>
          "{currentQuote.english}"
        </Text>
        <Text style={styles.reference}>- {currentQuote.reference}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={handleNextQuote}
      >
        <Text style={styles.nextButtonText}>Next Quote →</Text>
      </TouchableOpacity>
      
      <View style={styles.indicator}>
        <Text style={[styles.indicatorText, { color: isDark ? '#666' : '#999' }]}>
          {quoteIndex + 1} of {islamicQuotes.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quoteContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  arabicText: {
    fontSize: 20,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  englishText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 24,
  },
  reference: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 10,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  indicator: {
    alignItems: 'center',
  },
  indicatorText: {
    fontSize: 12,
  },
});