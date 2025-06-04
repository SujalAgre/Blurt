import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import EmojiSelector from './emoji-selector/index.js'

const Add = ({ setIsAddOpen, setAllSounds, saveSoundsToStorage, isDarkMode }) => {

    const [result, setResult] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    //handle emoji select
    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji);
        setShowEmojiPicker(false);
    };

    //pick audio
    const pickAudio = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true
            });

            if (result.canceled) {
                return;
            }
            setResult(result);

        } catch (err) {
            Alert.alert('Error', 'Failed to pick audio file');
        }
    }

    //add sound
    const addSound = () => {
        const newSound = {
            emoji: selectedEmoji,
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

        setIsAddOpen(false);
        setResult(null);
        setSelectedEmoji(null);
    }

    return (
        <>
            {/* emoji picker */}
            {showEmojiPicker && (
                <View style={[styles.emojiPickerContainer, {backgroundColor: isDarkMode ? '#191919' : '#fff',}]}>
                    {/* emoji selector */}
                    <EmojiSelector
                        onEmojiSelected={handleEmojiSelect}
                        showTabs={false}
                        showSectionTitles={false}
                        columns={7}
                    />

                    <TouchableOpacity style={[styles.actionButton, { marginTop: 10, borderColor: '#FF4B4B', boxShadow: '2px 2px 0px 0px #CF2121' }]} onPress={() => setShowEmojiPicker(false)}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingRight: 14, paddingLeft: 14, color: '#FF4B4B' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>

            )}

            {/* add container */}
            <View style={[styles.addContainer, {backgroundColor: isDarkMode ? '#111111' : '#fff',}]}>

                {/* button container */}
                <TouchableOpacity style={[styles.button, {backgroundColor: isDarkMode ? '#191919' : '#fff',}]} onPress={() => setShowEmojiPicker(true)}>
                    <Text style={{ fontSize: selectedEmoji ? 25 : 20, fontWeight: 'bold', color: '#929292' }}>{selectedEmoji ? selectedEmoji : 'Select emoji'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {backgroundColor: isDarkMode ? '#191919' : '#fff',}]} onPress={pickAudio}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#929292' }}>{result?.assets[0]?.name ? result?.assets[0]?.name.slice(0, 12) + '...' : 'Choose a file'}</Text>
                </TouchableOpacity>
                

                {/* action container */}
                <View style={styles.actionContainer}>

                    {/* cancel button */}
                    <TouchableOpacity style={[styles.actionButton, { marginLeft: 17, borderColor: '#FF4B4B', boxShadow: '2px 2px 0px 0px #CF2121', backgroundColor: isDarkMode ? '#191919' : 'white' }]} onPress={() => {
                        setIsAddOpen(false);
                        setResult(null);
                        setSelectedEmoji(null);
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingRight: 23, paddingLeft: 23, color: '#FF4B4B',  }}>Cancel</Text>
                    </TouchableOpacity>

                    {/* save button */}
                    <TouchableOpacity disabled={!selectedEmoji || !result} style={[styles.actionButton, { marginRight: 17, borderColor: '#4FB242', boxShadow: '2px 2px 0px 0px #007E13', backgroundColor: isDarkMode ? '#191919' : 'white', opacity: !selectedEmoji || !result ? 0.5 : 1 }]} onPress={addSound}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingRight: 27, paddingLeft: 27, color: '#4FB242' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* background */}
            <View style={{ backgroundColor: 'black', width: '100%', height: '100%', position: 'absolute', opacity: 0.3, zIndex: -1 }}></View>


        </>
    )
}

const styles = StyleSheet.create({
    addContainer: {
        backgroundColor: '#fff',
        width: '83%',
        height: '28%',
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#595959',
        boxShadow: '3px 3px 0px 0pxrgb(0, 0, 0)',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        height: '27%',
        borderWidth: 3,
        borderColor: '#6E6E6E',
        borderRadius: 40,
        boxShadow: '2px 2px 0px 0px #595959',
        justifyContent: 'center',
        alignItems: 'center'
    },    
    actionContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionButton: {
        padding: 5,
        borderRadius: 30,
        borderWidth: 3,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    emojiPickerContainer: {
        backgroundColor: '#fff',
        width: '85%',
        height: '59%',
        zIndex: 1000,
        position: 'absolute',
        borderWidth: 4,
        borderColor: '#595959',
        borderRadius: 40,
        boxShadow: '4px 4px 0px 0px rgb(88, 88, 88)',
        padding: 20,
    }
})

export default Add;