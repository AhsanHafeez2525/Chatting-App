import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import firbase from '../firebase'

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgetPassword = (props) => {
    const auth = getAuth();

    const [email, setEmail] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {

    }, [])

    const forgetPassword = () => {
        setLoading(true)
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                // ..
                alert('Please check your email')
                setLoading(false)

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                alert(error.message)
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

            <Button
                title='Submit'
                onPress={() => forgetPassword()}
            />

            <StatusBar style="auto" />
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

export default ForgetPassword;
