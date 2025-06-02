import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sounds from './sounds.js';
import { useState, useEffect } from 'react';

import Darkmode from './assets/icons/dark-mode.svg'
import Lightmode from './assets/icons/light-mode.svg'
import Edit from './assets/icons/edit.svg'
import Check from './assets/icons/check.svg'
import Cross from './assets/icons/cross.svg'
import Stop from './assets/icons/stop.svg'

export default function App() {
  const player = useAudioPlayer();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [allSounds, setAllSounds] = useState(sounds);
  const [editMode, setEditMode] = useState(false);
  const maxSound = 12;

  useEffect(() => {
    loadSavedSounds();
  }, []);

  const loadSavedSounds = async () => {
    try {
      const savedSounds = await AsyncStorage.getItem('customSounds');
      if (savedSounds) {
        const parsedSounds = JSON.parse(savedSounds);
        setAllSounds([...sounds, ...parsedSounds]);
      }
    } catch (error) {
      console.error('Error loading saved sounds:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  const playSound = (index) => {
    const sound = allSounds[index];
    const audioSource = sound.sound.uri ? sound.sound : sound.sound;
    player.replace(audioSource);
    player.seekTo(0);
    player.play();
  }

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const newSound = {
        emoji: '🎵',
        name: result.assets[0].name,
        sound: {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType || 'audio/mpeg'
        }
      };

      setAllSounds(prevSounds => {
        const updatedSounds = [...prevSounds, newSound];
        saveSoundsToStorage(updatedSounds);
        return updatedSounds;
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to pick audio file');
    }
  }

  const deleteSound = (index) => {
    setAllSounds(prevSounds => {
      const updatedSounds = prevSounds.filter((_, i) => i !== index);
      saveSoundsToStorage(updatedSounds);
      return updatedSounds;
    });
  }

  const saveSoundsToStorage = async (soundsToSave) => {
    try {
      const customSounds = soundsToSave.filter(sound => sound.sound.uri);
      await AsyncStorage.setItem('customSounds', JSON.stringify(customSounds));
    } catch (error) {
      console.error('Error saving sounds:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#171717' : '#fff' }, { backgroundColor: editMode ? '#c9c9c9' : '#fff' }]}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />

      <TouchableOpacity style={[styles.themeButton, { display: editMode ? 'none' : 'flex' }]} onPress={toggleTheme}>
        {isDarkMode ? <Darkmode height={40} width={40} /> : <Lightmode height={40} width={40} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
        {editMode ? <Check height={43} width={43} /> : <Edit height={40} width={40} />}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        {allSounds.map((sound, index) => (
          <View key={index}>
            <TouchableOpacity style={[styles.deleteButton, { display: editMode ? 'flex' : 'none' }]} onPress={() => deleteSound(index)}>

              <Cross height={20} width={20} />

            </TouchableOpacity>
            <TouchableOpacity onPress={() => playSound(index)} style={styles.button}>
              <Text style={styles.buttonText}>{sound.emoji}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={[styles.button, { display: allSounds.length >= maxSound ? 'none' : 'flex' }, { display: editMode ? 'none' : 'flex' }]} onPress={pickAudio} disabled={editMode}>
          <Text style={{ fontSize: 50, color: '#595959', transform: [{ 'translateY': -5 }] }}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 150, left: 0, right: 0, zIndex: 1000 }}>
        <TouchableOpacity onPress={() => {
          player.pause();
          player.seekTo(0);
        }}>
          <Stop height={60} width={60} style={{ display: editMode ? 'none' : 'flex' }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  themeButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 1000,
  },
  editButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 1000,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 10,
    marginBottom: 120,
  },
  button: {
    margin: 8,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#595959',
    boxShadow: '2px 2px 0px 0px rgb(88, 88, 88)',
    backgroundColor: '#fff',
    height: 68,
    width: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
  },
  deleteButton: {
    borderColor: '#ff4040',
    position: 'absolute',
    right: 0,
    borderWidth: 3,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 100,
    boxShadow: '1px 1px 0px 0px rgb(255, 64, 64)',
    zIndex: 1000,
  }
});
