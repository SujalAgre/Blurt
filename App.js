import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import sounds from './sounds.js';
import { useState } from 'react';

import Darkmode from './assets/icons/dark-mode.svg'
import Lightmode from './assets/icons/light-mode.svg'

export default function App() {
  const player = useAudioPlayer();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  const playSound = (index) => {
    player.replace(sounds[index].sound);
    player.seekTo(0);
    player.play();
  }

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? '#171717' : '#fff'}]}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        {isDarkMode ? <Darkmode height={40} width={40} /> : <Lightmode height={40} width={40} />}
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {sounds.map((sound, index) => (
          <TouchableOpacity key={index} onPress={() => playSound(index)} style={styles.button}>
            <Text style={styles.buttonText}>{sound.emoji}</Text>
          </TouchableOpacity>
        ))}
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
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 10,
  },

  button: {
    padding: 10,
    margin: 10,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#595959',
    boxShadow: '3px 3px 0px 0px rgb(88, 88, 88)',
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 30,
  }
});
