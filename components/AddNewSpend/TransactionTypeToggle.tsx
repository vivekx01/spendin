import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const TransactionTypeToggle = ({ onChange, defaultValue = 'Expense' }) => {
    const [selected, setSelected] = useState(defaultValue);

    const handleSelect = (value: 'Expense' | 'Income') => {
        setSelected(value);
        onChange?.(value);
    };

    return (
        <View style={styles.container}>
            <View style={styles.toggleGroup}>
                {['Expense', 'Income'].map((type) => (
                    <Pressable
                        key={type}
                        onPress={() => handleSelect(type)}
                        style={[
                            styles.toggleButton,
                            selected === type && styles.selectedButton,
                        ]}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                selected === type && styles.selectedText,
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {type}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        flexDirection: 'row',
    },
    toggleGroup: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#f1f2f4',
        borderRadius: 999,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButton: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        paddingHorizontal: 8,
    },
    selectedButton: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        color: '#6a7581',
        fontWeight: '500',
    },
    selectedText: {
        color: '#121416',
    },
});


export default TransactionTypeToggle;
