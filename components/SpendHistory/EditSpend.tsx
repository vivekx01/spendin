import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { deleteSpend, updateSpend } from '@/db';
import { getAllAccounts } from '@/db/accounts';
import { getAllocationsByAccountId } from '@/db/allocations';
import { useTheme } from '@/context/ThemeContext';

export default function EditSpendModal({ visible, spend, onClose, onUpdated, setSpends }) {
    const [name, setName] = useState(spend.spendName);
    const [amount, setAmount] = useState(spend.spendAmount.toString());
    const [notes, setNotes] = useState(spend.spendNotes || '');
    const [spendSource, setSpendSource] = useState(spend.spendSource);
    const [spendCategory, setSpendCategory] = useState(spend.spendCategory);

    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        if (visible) {
            setName(spend.spendName);
            setAmount(spend.spendAmount.toString());
            setNotes(spend.spendNotes || '');
            setSpendSource(spend.spendSource);
            setSpendCategory(spend.spendCategory);

            const loadData = async () => {
                const accs = await getAllAccounts();
                const cats = await getAllocationsByAccountId(spend.spendSourceId);
                setAccounts(accs);
                setCategories(cats);
            };
            loadData();
        }
    }, [visible]);

    const handleSave = async () => {
        const success = await updateSpend({
            spendId: spend.id,
            newSpendSource: spendSource,
            newSpendCategory: spendCategory ? spendCategory : null,
            newAmount: parseFloat(amount),
            newTransactionType: spend.transactionType,
            newDatetime: spend.spendDatetime,
            newName: name,
            newNotes: notes,
        });

        if (success) onUpdated();
        else alert('Failed to update spend');
    };

    const handleDeleteSpend = async (spendId: string) => {
        const isSuccess = await deleteSpend(spendId);
        if (isSuccess) {
            setSpends(prevSpends => prevSpends.filter(spend => spend.id !== spendId));
            Alert.alert('Success', 'Spend deleted successfully');
        } else {
            Alert.alert('Error', 'Failed to delete spend');
        }
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Edit Spend</Text>

                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                    />
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Amount"
                        keyboardType="numeric"
                        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                    />
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Notes (optional)"
                        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                    />

                    <Text style={[styles.label, { color: theme.colors.text } ]}>Account</Text>
                    <Picker
                        selectedValue={spendSource}
                        onValueChange={(value) => setSpendSource(value)}
                        style={styles.picker}
                    >
                        {accounts.map((acc) => (
                            <Picker.Item key={acc.id} label={acc.account_name} value={acc.id} />
                        ))}
                    </Picker>


                    {categories.length > 0 && (
                        <>
                            <Text style={[styles.label, { color: theme.colors.text }]}>Category</Text>
                            <Picker
                                selectedValue={spend.spendCategory}
                                onValueChange={(value) => setSpendCategory(value)}
                                style={styles.picker}
                            >
                                {categories.map((cat) => (
                                    <Picker.Item key={cat.id} label={cat.allocation_name} value={cat.id} />
                                ))}
                                <Picker.Item key="0" label="Others" value="" />

                            </Picker>
                        </>
                    )}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.button, { backgroundColor: theme.colors.income }]}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleDeleteSpend(spend.id);
                            }}
                            style={[styles.button, { backgroundColor: theme.colors.expense }]}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, { backgroundColor: theme.colors.background }]}
                        >
                            <Text style={{color: theme.colors.text}}>Cancel</Text>
                        </TouchableOpacity>
                </View>
            </View>
        </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000099',
    },
    modalContent: {
        width: '85%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
        color: 'black',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 4,
        color: 'black',
    },
    picker: {
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        padding: 10,
        borderRadius: 6,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
