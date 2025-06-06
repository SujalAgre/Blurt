export const styles = {
    container: {
      flex: 1,
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
      width: '80%',
      alignSelf: 'center',
    },
    button: {
      margin: 8,
      borderRadius: 20,
      borderWidth: 4,
      borderColor: '#595959',
      boxShadow: '2px 2px 0px 0px rgb(0, 0, 0)',
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
      
      borderRadius: 100,
      boxShadow: '1px 1px 0px 0px rgb(255, 64, 64)',
      zIndex: 1000,
    },
    addComponent: {
      flex: 1,
      justifyContent:'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2000,
    }
  }