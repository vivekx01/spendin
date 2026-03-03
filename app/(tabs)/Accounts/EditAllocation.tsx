// app/EditAllocation.tsx
import { View, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { deleteAllocation, updateAllocation } from '@/db/allocations';
import AmountInput from '@/components/AddNewSpend/AmountInput';
import TxtInput from '@/components/Accounts/TxtInput';
import { useTheme } from '@/context/ThemeContext';

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
    const { theme } = useTheme();

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

    const handleDelete = async () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this allocation?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const success = await deleteAllocation(allocationId);
                    if (success) {
                        router.back()
                        Alert.alert('Deleted successfully');
                    } else {
                        Alert.alert('Failed to delete');
                    }
                },
            },
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Edit Allocation</Text>
            <View>
                {/* <TextInput
                    value={editedName}
                    onChangeText={setEditedName}
                    style={styles.input}
                    placeholder="Allocation Name"
                    placeholderTextColor="#999"
                /> */}
                {/* <TextInput
                    value={editedAmount}
                    onChangeText={setEditedAmount}
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Amount"
                    placeholderTextColor="#999"
                /> */}
                <TxtInput text={editedName} setText={setEditedName} placeholder={"Enter Allocation Name"}></TxtInput>
                <AmountInput number={editedAmount} setNumber={setEditedAmount} />
                <View style={styles.buttonContainer}
                >
                    <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: theme.colors.text }]}>
                        <Text style={{ color: theme.colors.background, textAlign: 'center', fontSize: 16 }}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={[styles.deletebutton, { backgroundColor: theme.colors.expense }]}>
                        <Text style={{ color: theme.colors.card, textAlign: 'center', fontSize: 16 }}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()} style={[styles.cancelbutton, { backgroundColor: theme.colors.card }]}>
                        <Text style={{ color: theme.colors.text, textAlign: 'center', fontSize: 16 }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.buttonRow}>
                    <Button title="Save" onPress={handleSave} />
                    <Button title="Delete" onPress={handleDelete} />
                    <View style={{ marginLeft: 8 }}>
                        <Button title="Cancel" onPress={() => router.back()} color="gray" />
                    </View>
                </View> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: '100%' },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingTop: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
        color: 'black',
        fontSize: 16,
    },
    // buttonRow: {
    //     flexDirection: 'row',
    //     marginTop: 10,
    // },
    buttonContainer: { flexDirection:'column', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 25, gap: 10},
    button: { paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
    cancelbutton: { paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
    deletebutton: { paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50}
});

export default EditAllocation;
