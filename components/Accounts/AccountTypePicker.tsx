import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/context/ThemeContext';

const AccountTypePicker = ({ selectedAccountType, setSelectedAccountType, accountTypes, placeholder = "Select Account Type" }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.pickerWrapper}>
            <View style={[styles.pickerContainer, { backgroundColor: theme.colors.card }]}>
                <Picker
                    selectedValue={selectedAccountType}
                    onValueChange={(itemValue) => {
                        setSelectedAccountType(itemValue);
                    }}
                    style={[styles.picker, { color: theme.colors.text }]}
                    dropdownIconColor={theme.colors.text}
                    mode='dialog'
                >
                    <Picker.Item label={placeholder} value="" color={theme.colors.textSecondary} />
                    {accountTypes.map((account: any) => (
                        <Picker.Item
                            key={account}
                            label={account}
                            value={account}
                            color={theme.colors.text}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pickerWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    pickerContainer: {
        backgroundColor: '#f1f2f4',
        borderRadius: 16, // rounded-xl
        overflow: 'hidden',
        height: 56, // consistent with text input
        justifyContent: 'center',
    },
    picker: {
        height: 56,
        paddingHorizontal: 16,
        color: '#121416',
    },
});


export default AccountTypePicker;
