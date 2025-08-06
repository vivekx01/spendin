// oauth.ts
import { useAuthRequest, makeRedirectUri, DiscoveryDocument, AuthSessionResult } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { storeCredentials } from '../authStorage';
import { Alert } from 'react-native';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin'


// WebBrowser.maybeCompleteAuthSession();

const discovery: DiscoveryDocument = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Replace with your actual client IDs from Google Cloud Console
const CLIENT_IDS = {
    android: "100681010203-5k753hmtdbrgafma9rh9h7cgoq5r4ems.apps.googleusercontent.com",
    web: "100681010203-2af6gglqtl1b8v4guq0dh7nkrfucsg2d.apps.googleusercontent.com"
};

const SCOPES = ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'];

export const useGoogleAuth = async () => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        const token = await GoogleSignin.getTokens();
        await storeCredentials(userInfo.data?.user.email || "", token.accessToken)
        return true;
        
    } catch (error: any) {
        return error;
    }
};


// export const useGoogleAuth = () => {
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [userEmail, setUserEmail] = useState<string | null>(null);
//     const [request, response, promptAsync] = useAuthRequest(
//         {
//             clientId: CLIENT_IDS.android, // or pick appropriate clientID for your platform
//             scopes: SCOPES,
//             redirectUri: makeRedirectUri({
//                 scheme: 'com.vivekx01.spendin',
//                 path: 'Home/Settings'
//             }),
//         },
//         discovery
//     );

//     useEffect(() => {
//         if (response?.type === 'success' && response.authentication?.accessToken) {
//             setAccessToken(response.authentication.accessToken);
//             fetchUserEmail(response.authentication.accessToken, storeCredentials);
//             Alert.alert("Success", "The sign in was successful")
//         }
//     }, [request,response]);

//     // Fetch user's email using the access token
//     const fetchUserEmail = async (token: string, callback: (email: string, token: string) => void) => {
//         try {
//             const resp = await fetch('https://www.googleapis.com/userinfo/v2/me', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await resp.json();
//             setUserEmail(data.email);
//             callback(data.email, token); // store in AsyncStorage
//         } catch (err) {
//             setUserEmail(null);
//         }
//     };

//     return {
//         // Use this in your button
//         promptAsync,
//         accessToken,
//         userEmail, // Will be set after successful auth
//         request,
//     };
// };