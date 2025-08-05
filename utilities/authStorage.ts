import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeCredentials = async (email: string, token: string) => {
    await AsyncStorage.setItem('userEmail', email);
    await AsyncStorage.setItem('accessToken', token);
};

export const getCredentials = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    const token = await AsyncStorage.getItem('accessToken');
    return { email, token };
};

export const clearCredentials = async () => {
    await AsyncStorage.multiRemove(['userEmail', 'accessToken']);
};
