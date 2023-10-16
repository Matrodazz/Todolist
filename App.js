import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, Modal, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 min

  const openTimerModal = () => {
    setTimerRunning(true);
    setTimerModalVisible(true);
  };

  const stopTimer = () => {
    setTimerModalVisible(false);
    setTimerRunning(false);
  };

  useEffect(() => {
    let interval;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining <= 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const formattedTime = `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`;



  const openModal = (index) => {
    if (index !== null) {
      setTitle(tasks[index].title);
      setDescription(tasks[index].description);
    } else {
      setTitle('');
      setDescription('');
    }
    setEditIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveTask = () => {
    if (title && description) {
      if (editIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = { title, description };
        setTasks(updatedTasks);
      } else {
        setTasks([...tasks, { title, description }]);
      }
      closeModal();
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your To-do List</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity onPress={() => openModal(index)}>
              <View style={styles.taskContainer}>
                <View style={styles.header}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={() => deleteTask(index)}><Ionicons name="trash-outline" color={"#fa644d"} size={20} /></TouchableOpacity>
                </View>
                <Text>{item.description}</Text>
                <TouchableOpacity style={styles.button} onPress={() => openTimerModal()}>Start</TouchableOpacity>

              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={timerModalVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainerTimer}>
          <View style={styles.header}>
            <Text style={styles.title2}>Timer</Text>
            <TouchableOpacity style={styles.close} onPress={stopTimer}><Ionicons name="close-outline" color={"#fa644d"} size={25} /></TouchableOpacity>
          </View>
          <Text style={styles.timer}>{formattedTime}</Text>
           
        </View>
      </Modal>



   
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title2}>Task Manager</Text>
            <TouchableOpacity style={styles.close} onPress={closeModal}><Ionicons name="close-outline" color={"#fa644d"} size={25} /></TouchableOpacity>
          </View>
          
          <TextInput style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput style={styles.input}
            placeholder="Notes"
            value={description}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setDescription(text)}
          />
          <TouchableOpacity style={styles.button} onPress={saveTask}>Save</TouchableOpacity>
          
        </View>
      </Modal>
       <TouchableOpacity style={styles.button} onPress={() => openModal(null)}>Add To Do</TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  modalContainer: {
    backgroundColor: '#f0fcff',
    padding: 10,
  },

  modalContainerTimer: {
    backgroundColor: '#f0fcff',
    padding: 10,
    flex: 1,
  },

  title: {
    justifyContent: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },

  title2: {
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },

  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
   
  },

  taskContainer: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },


  button: {
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 9,
    backgroundColor: '#00aacc',
    borderRadius: 18,
    alignSelf: 'flex-end',
    fontFamily: 'calibri'
  },

  close: {
    textAlign: 'center',
    padding: 10,
    alignSelf: 'flex-end',
  },

  input: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 15,
  },  

   timer: {
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',

  },  
 
});
