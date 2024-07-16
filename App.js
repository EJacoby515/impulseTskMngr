import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Modal, ActivityIndicator, StatusBar, SafeAreaView, LogBox } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from './Colors';
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import { Fire, auth, db } from './Firebase';
import AuthScreen from './AuthScreens';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import LeaderboardTicker from './components/LeaderboardTicker';

// Ignore non-passive event listener warning
LogBox.ignoreLogs(['Added non-passive event listener']);

export default function App() {
  const [user, setUser] = useState(null);
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchLists();
        fetchLeaderboard('all'); 
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const fetchLeaderboard = async (timePeriod) => {
    try {
      console.log('Fetching leaderboard...', timePeriod);
      const leaderboardData = await Fire.getLeaderboard(timePeriod, 5);
      console.log('Leaderboard data:', leaderboardData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    }
  };

  const updateUserScore = async () => {
    if (user) {
      const completedTasks = lists.reduce((total, list) => 
        total + (list.todos ? list.todos.filter(todo => todo.completed).length : 0), 0);
      await Fire.updateUserScore(user.uid, completedTasks);
      fetchLeaderboard('all');
    }
  };

  const fetchLists = () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setLists(doc.data().lists || []);
      } else {
        setLists([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching lists:", error);
      setLoading(false);
    });
  
    return unsubscribe;
  };

  const addList = async (list) => {
    try {
      await Fire.addList(list);
      console.log('List added successfully');
      fetchLists();
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };
  
  const updateList = async (list) => {
    try {
      await Fire.updateList(list);
      console.log('List updated successfully');
      updateUserScore();
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };
  
  const deleteList = async (listId) => {
    try {
      await Fire.deleteList(listId);
      console.log('List deleted successfully');
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  const renderTodoList = ({ item }) => {
    return (
      <TodoList 
        list={item} 
        updateList={updateList} 
        deleteList={deleteList}
      />
    );
  };

  const handleLogout = () => {
    auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={() => setUser(auth.currentUser)}/>;
  }

  console.log('Rendering lists:', lists);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Modal
        animationType="slide"
        visible={addTodoVisible}
        onRequestClose={toggleAddTodoModal}>
        <AddListModal closeModal={toggleAddTodoModal} addList={addList} />
      </Modal>
      <View style={styles.header}>
        <Text style={styles.title}>
          TSK<Text style={styles.titleAccent}>MNGR</Text>
        </Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color={colors.blue} />
        </Pressable>
      </View>
      <Pressable style={styles.addList} onPress={toggleAddTodoModal}>
        <AntDesign name="plus" size={16} color={colors.blue} />
        <Text style={styles.add}>Add Task</Text>
      </Pressable>
      <View style={styles.listsContainer}>
        <FlatList
          data={lists}
          keyExtractor={item => item.id.toString()}
          renderItem={renderTodoList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <LeaderboardTicker leaderboard={leaderboard} fetchLeaderboard={fetchLeaderboard} />
    </SafeAreaView>
  );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.black,
  },
  titleAccent: {
    fontWeight: '300',
    color: colors.blue,
  },
  logoutButton: {
    padding: 10,
  },
  addList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  add: {
    color: colors.blue,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  listsContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  listContent: {
    paddingRight: 30,
  },
});

export { Fire, auth, db };