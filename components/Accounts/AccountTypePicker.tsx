import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Make sure to install this if not yet

const AccountTypePicker = ({ selectedAccountType, setSelectedAccountType, accountTypes, placeholder = "Select Account Type" }) => {
    return (
        <View style={styles.pickerWrapper}>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedAccountType}
                    onValueChange={(itemValue) => {
                        setSelectedAccountType(itemValue);
                    }}
                    style={styles.picker}
                    dropdownIconColor="#121416"
                    mode='dialog'
                >
                    <Picker.Item label={placeholder} value="" color="#6a7581" />
                    {accountTypes.map((account: any) => (
                        <Picker.Item
                            key={account}
                            label={account}
                            value={account}
                            color="#121416"
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
