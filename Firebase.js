import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc , deleteDoc, getDoc, onSnapshot, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from '@env'


const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

class Fire {
  async signUpWithEmail(email, password, firstName, lastName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName,
        lastName,
        completedTasks: 0, 
        lists: []
      });

      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }


  async signOutUser() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  async updateUserScore(userId, completedTasks) {
    const userRef = doc(db, 'users', userId);
    const timestamp = new Date().toISOString();
    await updateDoc(userRef, { 
      completedTasks,
      lastUpdated: timestamp
    });
  }
  
  async getLeaderboard(timePeriod = 'all', limitCount = 5) {
    const usersRef = collection(db, 'users');
    const now = new Date();
    let startDate;
  
    switch (timePeriod) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        break;
      case 'monthly':
        startDate = new Date(now.setDate(1));
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }
  
    
    const q = query(
      usersRef,
      orderBy('completedTasks', 'desc'),
      limit(limitCount)
    );
  
    const querySnapshot = await getDocs(q);
    const leaderboardData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: `${doc.data().firstName} ${doc.data().lastName}`,
      score: doc.data().completedTasks || 0,
      lastUpdated: doc.data().lastUpdated
    }));
  
    
    return leaderboardData.filter(user => {
      return new Date(user.lastUpdated) >= startDate;
    });
  }
  
  getLists(callback) {
    if (!auth.currentUser) {
      callback('No user logged in', null);
      return;
    };

    const userRef = doc(db, 'users', auth.currentUser.uid);

    return onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData && userData.lists) {
          callback(null, userData.lists);
        } else {
          callback(null, []);
        }
     } else {
      callback(null, []);
     }
    }, error => {
      callback(error, null);
    });
  }
  async addList(list) {
    if (!auth.currentUser) throw new Error('No user logged in');
  
    const userRef = doc(db, 'users', auth.currentUser.uid);
    
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const updatedLists = [...(userData.lists || []), { ...list, id: `list_${Date.now()}` }];
        await updateDoc(userRef, { lists: updatedLists });
      } else {
        await setDoc(userRef, { lists: [{ ...list, id: `list_${Date.now()}` }] });
      }
    } catch (error) {
      console.error("Error adding list:", error);
      throw error;
    }
  }

  async updateList(updatedList) {
    if (!auth.currentUser) throw new Error('No user logged in');
  
    const userRef = doc(db, 'users', auth.currentUser.uid);
    
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const updatedLists = userData.lists.map(list => 
          list.id === updatedList.id ? updatedList : list
        );
        await updateDoc(userRef, { lists: updatedLists });
  
        
        const completedTasks = updatedLists.reduce((total, list) => 
          total + (list.todos ? list.todos.filter(todo => todo.completed).length : 0), 0);
        await this.updateUserScore(auth.currentUser.uid, completedTasks);
      } else {
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error("Error updating list:", error);
      throw error;
    }
  }

  async deleteList(listId) {
    if (!auth.currentUser) throw new Error('No user logged in');

    const userRef = doc(db, 'users', auth.currentUser.uid);
    
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const updatedLists = userData.lists.filter(list => list.id !== listId);
        await updateDoc(userRef, { lists: updatedLists });
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  }
}

const firebaseInstance = new Fire();
export { firebaseInstance as Fire, auth, db }