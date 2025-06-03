import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import EmojiSelector from 'react-native-emoji-selector'

const Add = ({ setIsAddOpen, setAllSounds, saveSoundsToStorage }) => {

    const [result, setResult] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState('🤣');
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
    }

    return (
        <>
            {/* emoji picker */}
            {showEmojiPicker && (
                <View style={styles.emojiPickerContainer}>
                    {/* emoji selector */}
                    <EmojiSelector
                        onEmojiSelected={handleEmojiSelect}
                        showTabs={false}
                        showSectionTitles={false}
                        columns={7}
                    />

                    <TouchableOpacity style={[styles.button, { marginTop: 10, borderColor: '#FF4B4B', boxShadow: '2px 2px 0px 0px #CF2121'}]} onPress={() => setShowEmojiPicker(false)}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingRight: 14, paddingLeft: 14, color: '#FF4B4B' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>

            )}

            {/* add container */}
            <View style={styles.addContainer}>

                {/* button container */}
                
                <View style={styles.buttonContainer}>
                    
                    {/* related emoji*/}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 20, color: '#929292' }}>Related emoji</Text>
                    <TouchableOpacity style={[styles.button, {marginRight: 10}]} onPress={() => setShowEmojiPicker(true)}>
                        <Text style={{ fontSize: 17, paddingRight: 20, paddingLeft: 20 }}>{selectedEmoji}</Text>
                    </TouchableOpacity>
                </View>

                {/* audio picker */}
                <View style={styles.buttonContainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 20, color: '#929292' }}>{result?.assets[0]?.name ? result?.assets[0]?.name.slice(0, 12) + '...' : 'Choose a file'}</Text>
                    <TouchableOpacity style={[styles.button, {marginRight: 10}]} onPress={pickAudio}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', paddingRight: 4, paddingLeft: 4, color: '#6E6E6E' }}>Browse</Text>
                    </TouchableOpacity>
                </View>

                {/* action container */}
                <View style={styles.actionContainer}>
                    
                    {/* cancel button */}
                    <TouchableOpacity style={[styles.button, {marginLeft: 17, borderColor: '#FF4B4B', boxShadow: '2px 2px 0px 0px #CF2121'}]} onPress={() => {
                        setIsAddOpen(false);
                        setResult(null);
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingRight: 23, paddingLeft: 23, color: '#FF4B4B' }}>Cancel</Text>
                    </TouchableOpacity>

                    {/* save button */}
                    <TouchableOpacity style={[styles.button, {marginRight: 17, borderColor: '#4FB242', boxShadow: '2px 2px 0px 0px #007E13'}]} onPress={addSound}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingRight: 27, paddingLeft: 27, color: '#4FB242' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* background */}
            <View style={{backgroundColor: 'black', width: '100%', height: '100%', position: 'absolute', opacity: 0.3, zIndex: -1}}></View>


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
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        height: '27%',
        borderWidth: 3,
        borderColor: '#929292',
        borderRadius: 40,
        boxShadow: '2px 2px 0px 0pxrgb(122, 122, 122)',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        padding: 5,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#6E6E6E',
        boxShadow: '2px 2px 0px 0px #595959',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    actionContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customEmojiPicker: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#595959',
        boxShadow: '2px 2px 0px 0px rgb(88, 88, 88)',
        position: 'absolute',
        zIndex: 1000,
    },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    emojiButton: {
        padding: 8,
        margin: 2,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
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