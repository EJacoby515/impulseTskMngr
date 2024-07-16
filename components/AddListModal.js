import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import colors from '../Colors';

const AddListModal = ({ closeModal, addList }) => {
  const backgroundColors = [colors.red, colors.yellow];
  const priorityLabels = ['High Priority', 'Low Priority'];

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  const createTodo = () => {
    if (!name) {
      alert('Please enter a list name');
      return;
    }

    const list = { 
      name, 
      color: selectedColor, 
      priority: selectedColor === colors.red ? 'high' : 'low',
      todos: []
    };
    addList(list);
    setName('');
    closeModal();
  };

  const renderColors = () => {
    return backgroundColors.map((bgColor, index) => {
      const isSelected = bgColor === selectedColor;
      const colorStyle = {
        backgroundColor: bgColor,
        opacity: isSelected ? 0.3 : 1,
      };

      return (
        <TouchableOpacity 
          key={bgColor} 
          style={[styles.colorSelect, colorStyle]} 
          onPress={() => setSelectedColor(bgColor)} 
        >
          <Text style={styles.colorSelectText}>{priorityLabels[index]}</Text>
        </TouchableOpacity>
      );
    });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <AntDesign name='close' size={24} color={colors.black} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Create New Task</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Task Name" 
          onChangeText={text => setName(text)}
          value={name}
        />

        <View style={styles.colorContainer}>
          {renderColors()}
        </View>

        <TouchableOpacity 
          style={styles.create}
          onPress={createTodo}
        >
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 64,
    right: 32,
  },
  content: {
    alignSelf: 'stretch',
    marginHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.blue,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.black,
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  colorSelect: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  colorSelectText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default AddListModal;