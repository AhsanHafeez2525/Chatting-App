import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Button, Text, Image, TouchableOpacity } from 'react-native'
import {
    signOut,
    getAuth
} from 'firebase/auth';
import { doc, getFirestore } from "firebase/firestore";
import { collection, getDocs, getDoc, onSnapshot } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';

import app from '../firebase'

const ViewProfile = (props) => {
    const auth = getAuth()
    const db = getFirestore(app)

    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phoneNumer: '', age: '' })



    // async function loadData() {

    //     // const querySnapshot = await getDocs(collection(db, "users"));
    //     // querySnapshot.forEach((doc) => {
    //     //     console.log(`${doc.id} => ${doc.data()  }`);
    //     // });

    //     // const docRef = doc(db, "users", auth.currentUser.email)
    //     // const docSnap = await getDoc(doc(db, "users", auth.currentUser.email));
    //     // console.log(docSnap)
    //     // if (docSnap.exists()) {
    //     //     console.log("Document data:", docSnap.data());
    //     //     setProfileData(docSnap.data())
    //     // } else {
    //     //     // doc.data() will be undefined in this case
    //     //     console.log("No such document!");
    //     // }

    //     // const unsub = onSnapshot(doc(db, "users", auth.currentUser.email), (doc) => {
    //     //     console.log("Current data: ", doc.data());
    //     //     setProfileData(doc.data())
    //     // });
    // }
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "users", auth.currentUser.email), (doc) => {
            console.log("Current data: ", doc.data());
            setProfileData(doc.data())
        });
        
        return () => { unsub(); }

    }, [])

    return (
        <View style={styles.container}>

            <Text style={styles.text}>First Name :{profileData.firstName}</Text>
            <Text style={styles.text}>Last Name :{profileData.lastName}</Text>
            <Text style={styles.text}>Phone :{profileData.phoneNumer}</Text>
            <Text style={styles.text}>Age :{profileData.age}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
        justifyContent: 'center'
    },
    textInput: {
        borderWidth: 1,
        height: 40,
        width: '80%',
        margin: 5
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 2,
        width: '100%',
        textAlign: 'center',
        borderWidth: 1
    },
    img: {
        width: 50,
        height: 50,
        margin: 20
    }
}
)
export default ViewProfile