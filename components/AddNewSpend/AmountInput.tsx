import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const AmountInput = ({ number, setNumber }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setNumber}
                value={number}
                placeholder="Amount"
                placeholderTextColor="#6a7581"
                keyboardType="numeric"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: 16,
        maxWidth: 480,
        width: '100%',
    },
    input: {
        flex: 1,
        height: 56, // equivalent to h-14
        backgroundColor: '#f1f2f4',
        borderRadius: 16, // rounded-xl
        padding: 16, // p-4
        fontSize: 16,
        color: '#121416',
    },
});


export default AmountInput;
