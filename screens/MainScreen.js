import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Button, TextInput, Text } from 'react-native'
import {
    signOut,
    getAuth
} from 'firebase/auth';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";

import app from '../firebase'
import { async } from '@firebase/util';
import * as Location from 'expo-location';
import PDFReader from 'rn-pdf-reader-js'
import axios from 'axios';
import { TEMP_CITY } from '../res/string';

const MainScreen = (props) => {
    const [temp, setTemp] = useState()

    const auth = getAuth()
    const db = getFirestore(app)

    Location.watchPositionAsync({
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1,
        timeInterval: 5000,
    }, async loc => {
        let updateLocation = await updateDoc(doc(db, "users", auth.currentUser.email), {
            location: loc
        })
    })



    const signout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            props.navigation.goBack()
        }).catch((error) => {
            // An error happened.
            alert('Sorry there is an error')
        });

    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            let updateLocation = await updateDoc(doc(db, "users", auth.currentUser.email), {
                location: location
            })
            let weather = await axios.get('http://api.weatherapi.com/v1/current.json?key=575728534cb84f3abca53909220806&q=' + TEMP_CITY + '&aqi=no');
            console.log(weather.data)
            setTemp(weather.data.current.feelslike_c)
        })();
    }, []);
    return (
        <View style={styles.container}>
            <Text style={{
                alignSelf: 'flex-end',
                fontWeight: 'bold',
                padding: 10,
            }}>{TEMP_CITY}:{temp}°c</Text>
            <Button
                title='Sign out'
                onPress={() => signout()}
            />
            <Button
                title='Update profile'
                onPress={() => props.navigation.navigate('Update Profile')}
            />

            <Button
                title='View profile'
                onPress={() => props.navigation.navigate('View Profile')}
            />
            <Button
                title='View Users'
                onPress={() => props.navigation.navigate('View Users')}
            />
            <Button
                title='Group Chat'
                onPress={() => props.navigation.navigate('Chat')}
            />
             <Button
                title='Individual Chat'
                onPress={() => props.navigation.navigate('Users')}
            />
            {/* <PDFReader
                customStyle={{ width: '100%', height: 500 }}
                style={{ width: '100%', height: 500 }}
                source={{
                    uri: 'http://islamabad.comsats.edu.pk/NEFiles/prospectus/Graduate-Prospectus-2019-20.pdf',
                }}
            /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    textInput: {
        borderWidth: 1,
        height: 40,
        width: '80%',
        margin: 5
    }
})
export default MainScreen