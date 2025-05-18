import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateSpend } from '@/db';
import { getAllAccounts } from '@/db/accounts';
import { getAllocationsByAccountId } from '@/db/allocations';

export default function EditSpendModal({ visible, spend, onClose, onUpdated }) {
    const [name, setName] = useState(spend.spendName);
    const [amount, setAmount] = useState(spend.spendAmount.toString());
    const [notes, setNotes] = useState(spend.spendNotes || '');
    const [spendSource, setSpendSource] = useState(spend.spendSource);
    const [spendCategory, setSpendCategory] = useState(spend.spendCategory);

    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (visible) {
            setName(spend.spendName);
            setAmount(spend.spendAmount.toString());
            setNotes(spend.spendNotes || '');
            setSpendSource(spend.spendSource);
            setSpendCategory(spend.spendCategory);

            const loadData = async () => {
                const accs = await getAllAccounts();
                console.log('Accounts:', accs);
                const cats = await getAllocationsByAccountId(spend.spendSourceId);
                console.log('Categories:', cats);
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

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Edit Spend</Text>

                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        style={styles.input}
                    />
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Amount"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Notes (optional)"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Account</Text>
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
                            <Text style={styles.label}>Category</Text>
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
                            style={[styles.button, { backgroundColor: '#4CAF50' }]}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, { backgroundColor: '#f44336' }]}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
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
