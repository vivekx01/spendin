// oauth.ts
import { useEffect, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { clearCredentials, storeCredentials } from '../authStorage';
import { parseIfJson } from '../parseIfJson';

const CLIENT_ID = '100681010203-9q6q5cuoi3h5cuettfe7l2bmc5c00jpm.apps.googleusercontent.com';

export const useGoogleAuth = () => {
    const [userInfo, setUserInfo] = useState<any | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly'],
            webClientId: CLIENT_ID, // Use Web client ID here
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });

        checkIfAlreadySignedIn();
    }, []);

    const checkIfAlreadySignedIn = async () => {
        try {
            const user:any = await GoogleSignin.getCurrentUser();
            if (user) {
                setUserInfo(user);
                const tokens = await GoogleSignin.getTokens();
                setAccessToken(tokens.accessToken);
                storeCredentials(user.email, tokens.accessToken);
            }
        } catch (err) {
            console.log('Silent login failed:', err);
        }
    };


    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            let user: any = await GoogleSignin.signIn();
            const tokens = await GoogleSignin.getTokens();
            user = parseIfJson(user);
            // return {user, tokens};
            setUserInfo(user);
            setAccessToken(tokens.accessToken);
            storeCredentials(user.email, tokens.accessToken);
            Alert.alert('Success', 'The sign in was successful');
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Cancelled', 'Sign in was cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert('In Progress', 'Sign in is in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Play Services error', 'Google Play Services not available or outdated');
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUserInfo(null);
            setAccessToken(null);
            clearCredentials();
            Alert.alert("You are signed out successfully");
        } catch (error) {
            console.error('Sign out error', error);
        }
    };

    return {
        signIn,     // call this on your sign in button
        signOut,    // optional, use to logout
        accessToken,
        userEmail: userInfo?.email ?? null,
        userInfo,
    };
};
