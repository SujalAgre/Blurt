import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

//sound imports
import sounds from './sounds.js';

//component imports
import Add from './src/components/Add.js';

//style imports
import { styles } from './src/styles/app-style.js';

//svg icon imports
import Darkmode from './assets/icons/dark-mode.svg'
import Lightmode from './assets/icons/light-mode.svg'
import Edit from './assets/icons/edit.svg'
import Check from './assets/icons/check.svg'
import Cross from './assets/icons/cross.svg'
import Stop from './assets/icons/stop.svg'
import Phone from './assets/icons/phone.svg'
import PhoneShake from './assets/icons/phone-shake.svg'

export default function App() {

  const player = useAudioPlayer(sounds[0].sound);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [allSounds, setAllSounds] = useState(sounds);
  const [editMode, setEditMode] = useState(false);
  const [isShakeEnabled, setIsShakeEnabled] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [selectedSound, setSelectedSound] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    loadSavedSounds();
  }, []);

  //shake to play sound
  useEffect(() => {
    let subscription;

    if (isShakeEnabled) {
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();

        if (acceleration > 1.5 && now - lastShakeTime > 1000) {
          if (selectedSound) {
            playSound(selectedSound);
            setLastShakeTime(now);
          } else {
            playSound(0);
            setLastShakeTime(now);
          }
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isShakeEnabled, lastShakeTime, selectedSound]);

  //load saved sounds
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

  //sound related functions

  //play sound
  const playSound = (index) => {
    const sound = allSounds[index];
    const audioSource = sound.sound.uri ? sound.sound : sound.sound;
    player.replace(audioSource);
    player.seekTo(0);
    player.play();
  }

  //delete sound
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
    <View style={[styles.container, {backgroundColor: editMode ? '#c9c9c9' : isDarkMode ? '#171717' : '#fff',}]}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />

      {/* add sound component */}
      <View style={[styles.addComponent, {display: isAddOpen ? 'flex' : 'none'}]}>
        <Add setIsAddOpen={setIsAddOpen} setAllSounds={setAllSounds} saveSoundsToStorage={saveSoundsToStorage}/>
      </View>

      {/* theme button */}
      <TouchableOpacity style={[styles.themeButton, { display: editMode ? 'none' : 'flex' }]} onPress={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? <Darkmode height={40} width={40} /> : <Lightmode height={40} width={40} />}
      </TouchableOpacity>

      {/* edit button */}
      <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
        {editMode ? <Check height={43} width={43} /> : <Edit height={40} width={40} />}
      </TouchableOpacity>

      {/* button container */}
      <View style={styles.buttonContainer}>
        {allSounds.map((sound, index) => (
          <View key={index}>
            {/* delete button */}
            <TouchableOpacity style={[styles.deleteButton, { display: editMode ? 'flex' : 'none' }]} onPress={() => deleteSound(index)}>
              <Cross height={20} width={20} />
            </TouchableOpacity>
            
            {/* sound button */}
            <TouchableOpacity onPress={() => {
              setSelectedSound(index);
              playSound(index);
            }} style={styles.button} disabled={editMode}>
              <Text style={styles.buttonText}>{sound.emoji}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* add button */}
        <TouchableOpacity style={[styles.button, { display: allSounds.length >= 12 ? 'none' : editMode ? 'none' : 'flex' }]} onPress={()=>{setIsAddOpen(true)}} disabled={editMode}>
          <Text style={{ fontSize: 50, color: '#595959', transform: [{ 'translateY': -5 }] }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* stop button */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', position: 'absolute', bottom: 150, left: 0, right: 0, zIndex: 1000, display: editMode ? 'none' : 'flex' }}>
        <TouchableOpacity style={{position: 'fixed'}} onPress={() => {
          player.pause();
          player.seekTo(0);
        }}>
          <Stop height={60} width={60} />
        </TouchableOpacity>

        {/* shake to play sound button */}
        <TouchableOpacity onPress={() => setIsShakeEnabled(!isShakeEnabled)}>
          {isShakeEnabled ? <PhoneShake height={50} width={50} /> : <Phone height={40} width={40}  />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

StyleSheet.create(styles);
