import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../Colors';

const LeaderboardTicker = ({ leaderboard, fetchLeaderboard }) => {
  const [timePeriod, setTimePeriod] = useState('daily');

  useEffect(() => {
    fetchLeaderboard(timePeriod);
  }, [timePeriod]);

  if (leaderboard.length === 0) {
    return null;
  }

  const renderLeaderboardItem = (user, index) => (
    <View key={user.id} style={styles.leaderboardItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.score}>{user.score} tasks</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.leaderboard}>
        <Text style={styles.leaderboardTitle}>Leaderboard</Text>
        {leaderboard.map(renderLeaderboardItem)}
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, timePeriod === 'daily' && styles.activeFilterButton]}
          onPress={() => setTimePeriod('daily')}
        >
          <Text style={styles.filterButtonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, timePeriod === 'weekly' && styles.activeFilterButton]}
          onPress={() => setTimePeriod('weekly')}
        >
          <Text style={styles.filterButtonText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, timePeriod === 'monthly' && styles.activeFilterButton]}
          onPress={() => setTimePeriod('monthly')}
        >
          <Text style={styles.filterButtonText}>Monthly</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
  },
  leaderboard: {
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
  },
  score: {
    fontSize: 16,
    color: colors.gray,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: colors.blue,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
});

export default LeaderboardTicker;