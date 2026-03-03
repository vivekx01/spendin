import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const TxtInput = ({ text, setText, placeholder = "Enter any string" }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.wrapper}>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                    },
                ]}
                onChangeText={setText}
                value={text}
                placeholder= {placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                multiline
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
        borderWidth: 1,
        padding: 16,
        fontSize: 16,
        color: '#121416',
        minHeight: 56,
        textAlignVertical: 'top', // ensures text starts at the top in multiline
    },
});


export default TxtInput;
