import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const SpendNameInput = ({ spendName, setSpendName }) => {
    return (
        <View style={styles.wrapper}>
            <TextInput
                style={styles.input}
                onChangeText={setSpendName}
                value={spendName}
                placeholder="Enter transaction name (optional)"
                placeholderTextColor="#6a7581"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    input: {
        backgroundColor: '#f1f2f4',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#121416',
        height: 56,
    },
});


export default SpendNameInput;
