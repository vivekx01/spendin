import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const RenderRightActions = ({ accountId, handleDeleteAccount }: { accountId: string; handleDeleteAccount: (id: string) => void }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={() => handleDeleteAccount(accountId)}
            style={[styles.deleteButton, { backgroundColor: theme.colors.expense }]}
        >
            <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
    );
};

export default function renderRightActions(accountId: string, handleDeleteAccount: (id: string) => void) {
    return <RenderRightActions accountId={accountId} handleDeleteAccount={handleDeleteAccount} />;
}

const styles = StyleSheet.create({
    deleteButton: {
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
