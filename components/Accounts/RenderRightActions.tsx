import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const renderRightActions = (accountId: string, handleDeleteAccount: (id: string) => void) => (

    <TouchableOpacity
        onPress={() => handleDeleteAccount(accountId)}
        style={styles.deleteButton}
    >
        <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>

);

export default renderRightActions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    deleteButton: {
        backgroundColor: '#e53935',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
