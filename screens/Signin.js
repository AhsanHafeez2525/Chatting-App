import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image, Platform, ActivityIndicator as ActivityIndicator2 } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import firbase from '../firebase'
import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import * as Notifications from 'expo-notifications';
import {
    AdMobBanner,
    setTestDeviceIDAsync,

} from 'expo-ads-admob';
import { ActivityIndicator, Colors, Banner } from 'react-native-paper';

const SignIn = (props) => {

    // async function loadData() {
    //     await setTestDeviceIDAsync('EMULATOR');
    // }
    const auth = getAuth();

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);


    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

 
    useEffect(() => {

        // loadData()
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
        if (auth.currentUser)
            props.navigation.navigate('MainScreen')

    }, [])

    const signIn = () => {
        setLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                alert('User Signed In Successfully')
                // ...
                props.navigation.navigate('MainScreen')
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
                setLoading(false)
            });
    }


    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
            />

            <ActivityIndicator
                size="small"
                animating={loading}
                color="#0000ff"

            />



            <TextInput
                placeholder='Enter Email/Username'
                style={styles.textInput}
                onChangeText={(t) => {
                    setEmail(t)
                }}
            />
            <TextInput
                placeholder='Enter Password Here'
                style={styles.textInput}
                onChangeText={(t) => {
                    setPassword(t)
                }}
                secureTextEntry={true}
            />
            <Button
                title='Sign'
                onPress={() => signIn()}
            />
            <Button
                title='Do not have an account, Sign Up'
                onPress={() => {
                    props.navigation.navigate('Signup')
                }}
            />
            <Button
                title='Forget Password ? Click here'
                onPress={() => {
                    props.navigation.navigate('ForgetPassword')
                }}
            />
            <StatusBar style="auto" />
            <AdMobBanner
                style={{ position: 'absolute', bottom: 0 }}
                bannerSize="smartBannerPortrait"
                adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds // true or false
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d3d3d3',
        justifyContent: 'center',
        alignItems: 'center'

    },
    textInput: {
        borderWidth: 1,
        height: 40,
        width: '80%',
        margin: 5
    }
});

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

export default SignIn;
