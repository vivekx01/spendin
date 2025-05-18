// app/EditAllocation.tsx
import { View, TextInput, Alert, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '@/components/Button';
import { updateAllocation } from '@/db/allocations';

const EditAllocation = () => {
    const {
        allocationId,
        allocationName,
        allocationAmount,
        allocationAccount,
    } = useLocalSearchParams<{
        allocationId: string;
        allocationName: string;
        allocationAmount: string;
        allocationAccount: string;
    }>();

    const [editedName, setEditedName] = useState(allocationName);
    const [editedAmount, setEditedAmount] = useState(allocationAmount);

    const handleSave = async () => {
        if (!editedName || !editedAmount) {
            Alert.alert('Please fill all fields');
            return;
        }

        const isSuccess = await updateAllocation({
            allocationId,
            allocationAccountId: allocationAccount,
            allocationName: editedName,
            allocationAmount: parseFloat(editedAmount),
        });

        if (isSuccess) {
            Alert.alert('Allocation updated!');
            router.back();
        } else {
            Alert.alert('Failed to update. Try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Allocation</Text>
            <TextInput
                value={editedName}
                onChangeText={setEditedName}
                style={styles.input}
                placeholder="Allocation Name"
                placeholderTextColor="#999"
            />
            <TextInput
                value={editedAmount}
                onChangeText={setEditedAmount}
                style={styles.input}
                keyboardType="numeric"
                placeholder="Amount"
                placeholderTextColor="#999"
            />
            <View style={styles.buttonRow}>
                <Button title="Save" onPress={handleSave} />
                <View style={{ marginLeft: 8 }}>
                    <Button title="Cancel" onPress={() => router.back()} color="gray" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
        color: 'black',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
});

export default EditAllocation;
