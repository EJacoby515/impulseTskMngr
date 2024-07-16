import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Platform, Keyboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../Colors';

const TodoModal = ({ list, closeModal, updateList }) => {
  const [newTodo, setNewTodo] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(list.name);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState('');

  const addTodo = () => {
    if (newTodo.trim() === '') return;

    const updatedList = {
      ...list,
      todos: [...(list.todos || []), { id: Date.now().toString(), title: newTodo, completed: false }]
    };
    updateList(updatedList);
    setNewTodo('');
    Keyboard.dismiss();
  };

  const toggleTodoCompleted = (todoId) => {
    const updatedTodos = list.todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    const updatedList = { ...list, todos: updatedTodos };
    updateList(updatedList);
  };

  const handleEditTitle = () => {
    setUpdatedTitle(list.name);
    setEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (updatedTitle.trim() === '') return;

    const updatedList = { ...list, name: updatedTitle };
    updateList(updatedList);
    setEditingTitle(false);
  };

  const handleEditTask = (taskId, taskTitle) => {
    setEditingTaskId(taskId);
    setUpdatedTaskTitle(taskTitle);
  };

  const handleSaveTask = () => {
    if (updatedTaskTitle.trim() === '') return;

    const updatedTodos = list.todos.map(todo =>
      todo.id === editingTaskId ? { ...todo, title: updatedTaskTitle } : todo
    );
    const updatedList = { ...list, todos: updatedTodos };
    updateList(updatedList);
    setEditingTaskId(null);
    setUpdatedTaskTitle('');
    Keyboard.dismiss();
  };

  const getCompletedCount = () => list.todos ? list.todos.filter(todo => todo.completed).length : 0;
  const getRemainingCount = () => list.todos ? list.todos.length - getCompletedCount() : 0;

  const getColor = () => {
    if (list.todos && list.todos.length > 0 && getRemainingCount() === 0) return colors.green;
    return list.color;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <AntDesign name="close" size={24} color={colors.black} />
        </TouchableOpacity>

        <View style={[styles.header, { backgroundColor: getColor() }]}>
          <View style={styles.titleContainer}>
            {editingTitle ? (
              <TextInput
                style={styles.titleInput}
                value={updatedTitle}
                onChangeText={setUpdatedTitle}
                autoFocus
                onBlur={handleSaveTitle}
                onSubmitEditing={handleSaveTitle}
              />
            ) : (
              <Text style={styles.title}>{list.name}</Text>
            )}
            <TouchableOpacity onPress={handleEditTitle}>
              <AntDesign name="edit" size={20} color={colors.white} style={styles.editButton} />
            </TouchableOpacity>
          </View>
          <Text style={styles.taskCount}>
            {`${getCompletedCount()} of ${list.todos ? list.todos.length : 0} tasks`}
          </Text>
        </View>

        <FlatList
          data={list.todos || []}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <TouchableOpacity onPress={() => toggleTodoCompleted(item.id)}>
                <View style={[styles.todoCheckbox, item.completed && styles.todoCheckboxCompleted]}>
                  {item.completed && <AntDesign name="check" size={16} color={colors.white} />}
                </View>
              </TouchableOpacity>
              {editingTaskId === item.id ? (
                <TextInput
                  style={styles.taskInput}
                  value={updatedTaskTitle}
                  onChangeText={setUpdatedTaskTitle}
                  autoFocus
                  onBlur={handleSaveTask}
                  onSubmitEditing={handleSaveTask}
                />
              ) : (
                <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>{item.title}</Text>
              )}
              <TouchableOpacity onPress={() => handleEditTask(item.id, item.title)}>
                <AntDesign name="edit" size={16} color={colors.blue} style={styles.taskEditButton} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            onChangeText={setNewTodo}
            value={newTodo}
            placeholder="Add a task..."
            placeholderTextColor={colors.gray}
          />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: getColor() }]} onPress={addTodo}>
            <AntDesign name="plus" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    marginRight: 10,
  },
  editButton: {
    marginLeft: 10,
  },
  taskEditButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.white,
  },
  taskCount: {
    fontSize: 14,
    color: colors.white,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.blue,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoCheckboxCompleted: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  todoText: {
    fontSize: 16,
    color: colors.black,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.gray,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.lightGray,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.black,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default TodoModal;