import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AllocationPicker = ({ selectedAllocationId, setSelectedAllocationId, allocations }) => {
    return (
        <View style={styles.pickerWrapper}>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedAllocationId}
                    onValueChange={(itemValue) => setSelectedAllocationId(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#121416"
                    mode='dialog'
                >
                    <Picker.Item
                        label="Select Allocation Category (Optional)"
                        value=""
                        color="#6a7581"
                    />
                    {allocations.map((alloc) => (
                        <Picker.Item
                            key={alloc.id}
                            label={alloc.allocation_name}
                            value={alloc.id}
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
        borderRadius: 16,
        overflow: 'hidden',
        height: 56,
        justifyContent: 'center',
    },
    picker: {
        height: 56,
        paddingHorizontal: 16,
        color: '#121416',
    },
});


export default AllocationPicker;
