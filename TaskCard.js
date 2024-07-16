import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const TaskCard = ({ task }) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: task.color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{task.title}</Text>
        <AntDesign name="delete" size={24} color="#FFF" />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardText}>{task.remaining} remaining</Text>
        <Text style={styles.cardText}>{task.completed} completed</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
});

export default TaskCard;