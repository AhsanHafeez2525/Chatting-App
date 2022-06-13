import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Button, TextInput, TouchableOpacity, Image } from 'react-native'
import {
    signOut,
    getAuth
} from 'firebase/auth';
import { doc, getFirestore } from "firebase/firestore";
import { collection, setDoc, getDoc, updateDoc } from "firebase/firestore";
import app from '../firebase'
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const CreatePrfoile = (props) => {
    const auth = getAuth()
    console.log(auth)
    const db = getFirestore(app)
    const storage = getStorage();


    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [phoneNumer, setPhoneNumber] = useState()
    const [age, setAge] = useState()
    const [image, setImage] = useState(null);
    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phoneNumer: '', age: '' })


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            console.log(result.uri)
            setImage(result.uri);
            const storageRef = ref(storage, auth.currentUser.email);

            uploadString(storageRef, result.uri, 'data_url').then((snapshot) => {
                console.log(snapshot)
                console.log('Uploaded a base64 string!');
                getDownloadURL(snapshot.ref).then(async (url) => {
                    const docRef = await updateDoc(doc(db, "users", auth.currentUser.email), {
                        img: url
                    });
                })
            });

        }
    };


    async function loadData() {

        // const docRef = doc(db, "users", auth.currentUser.email)
        const docSnap = await getDoc(doc(db, "users", auth.currentUser.email));
        console.log(docSnap)
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setImage(docSnap.data().img)
            setFirstName(docSnap.data().firstName)
            setLastName(docSnap.data().lastName)
            setPhoneNumber(docSnap.data().phoneNumer)
            setAge(docSnap.data().age.toString())

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }


    }

    const updateProfile = async () => {
        try {

            // const docRef = await addDoc(collection(db, "users"), {
            //     first: "Ada",
            //     last: "Lovelace",
            //     born: 1815
            //   });

            const docRef = await updateDoc(doc(db, "users", auth.currentUser.email), {
                firstName: firstName,
                lastName: lastName,
                phoneNumer: phoneNumer,
                age: age
            });

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    const onAddImagePressed = async () => {
        await pickImage()
    }
    useEffect(() => {
        loadData()
    }, [])
    return (
        <View style={styles.container}>
            <Button
                title='Select Image'
                onPress={() => pickImage()}
            />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

            {/* <TouchableOpacity style={styles.img} onPress={() => pickImage()}>
                <Image style={styles.img} source={require('../assets/add-user-image.png')} />
            </TouchableOpacity> */}
            <TextInput
                placeholder='Enter First Name'
                style={styles.textInput}
                onChangeText={(t) => {
                    setFirstName(t)
                }}
                value={firstName}
            />
            <TextInput
                placeholder='Enter Last Name'
                style={styles.textInput}
                onChangeText={(t) => {
                    setLastName(t)
                }}
                value={lastName}


            />
            <TextInput
                placeholder='Enter Phone Number'
                style={styles.textInput}
                onChangeText={(t) => {
                    setPhoneNumber(t)
                }}
                keyboardType={'number-pad'}
                value={phoneNumer}

            />
            <TextInput
                placeholder='Age'
                style={styles.textInput}
                onChangeText={(t) => {
                    setAge(t)
                }}
                keyboardType={'number-pad'}
                value={age}
            />
            <Button
                title='Update profile'
                onPress={() => updateProfile()}
            />
            <Button
                title='View profile'
                onPress={() => props.navigation.navigate('View Profile')}
            />
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
export default CreatePrfoile