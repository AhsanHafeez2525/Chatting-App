import React, { useState, useEffect } from 'react'
import {
    View, StyleSheet,
    Button, Text, Image,
    TouchableOpacity,
    ActivityIndicator,
    FlatList, TextInput, Dimensions,
    ImageBackground
} from 'react-native'
import {
    signOut,
    getAuth
} from 'firebase/auth';
import { doc, getFirestore } from "firebase/firestore";
import { collection, getDocs, getDoc, query, where } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import app from '../firebase'
import { async } from '@firebase/util';

const ViewProfile = (props) => {
    const auth = getAuth()
    const db = getFirestore(app)

    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phoneNumer: '', age: '' })
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState(null)



    async function loadData() {
        const docRef = collection(db, "users")

        const querySnapshot = await getDocs(docRef);
        let users = []
        querySnapshot.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id })
            console.log(` ${doc.data().firstName}  ${doc.data().lastName}`);
            setLoading(false)
        });
        setUsers(users)

        // const docRef = doc(db, "users", auth.currentUser.email)
        // const docSnap = await getDoc(doc(db, "users", auth.currentUser.email));
        // console.log(docSnap)
        // if (docSnap.exists()) {
        //     console.log("Document data:", docSnap.data());
        //     setProfileData(docSnap.data())
        // } else {
        //     // doc.data() will be undefined in this case
        //     console.log("No such document!");
        // }


    }
    useEffect(() => {
        loadData()
    }, [])

    const onUserSelected = (user) => {
        if (user.location) {
            alert('Location available')
            props.navigation.navigate('Maps', { selectedUser: user.id })
        } else {
            alert('Location not available')
        }
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{
                backgroundColor: '#d3d3d3',
                flexDirection: 'row',
                margin: 5
            }
            } onPress={() => onUserSelected(item)}>
                {item.img ?
                    <Image style={{
                        borderRadius: 20,
                        margin: 5,
                        height: 40,
                        width: 40
                    }}
                        source={{ uri: item.img }} />
                    : <Image style={{
                        borderRadius: 20,
                        margin: 5,
                        height: 40,
                        width: 40
                    }}
                        source={require('../assets/add-user-image.png')} />}
                <Text style={{
                    backgroundColor: '#d3d3d3',
                    width: '100%',
                    margin: 5,
                    height: 40,
                    fontWeight: 'bold',
                    padding: 5
                }}>{item.firstName + ' ' + item.lastName}</Text>

                {/* {item.location ?
                    <View style={{ flex: 1 }}>
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                        >
                        </MapView>
                    </View> :
                    null
                } */}
            </TouchableOpacity >
        )
    }

    const onSearchPressed = async () => {
        setLoading(true)
        const usersRef = collection(db, "users");

        const q = query(usersRef, where("age", ">=", parseInt(search)), where('firstName', '==', 'Ahmad'));
        const querySnapshot = await getDocs(q);
        let users = []
        querySnapshot.forEach((doc) => {
            users.push(doc.data())

        });
        setUsers(users)
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    style={{
                        margin: 5,
                        borderWidth: 1,
                        width: '80%',
                        height: 35
                    }}
                    placeholder='Search user by first name'
                    onChangeText={(t) => setSearch(t)}
                />
                <Button
                    title='Search'
                    onPress={() => onSearchPressed()}
                />
            </View>
            <ActivityIndicator
                size="small"
                animating={loading}
                color="#0000ff" />

            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    container: {
        flex: 1,

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
    }, item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
}
)
export default ViewProfile