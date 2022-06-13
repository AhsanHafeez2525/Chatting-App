import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import app from '../firebase'
import { collection, getDocs, getDoc, query, where, doc, getFirestore } from "firebase/firestore";
import { async } from '@firebase/util';


export default function App(props) {

    const [location, setLocation] = useState(null);
    const [selectedUserLocation, setSelectedUserLocation] = useState(null)

    const { selectedUser } = props.route.params
    const db = getFirestore(app)

    const loadSelectedUserLocation = async () => {
        const docRef = doc(db, "users", selectedUser)

        const querySnapshot = await getDoc(docRef);
        setSelectedUserLocation(querySnapshot.data().location)
    }
    useEffect(() => {


        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            loadSelectedUserLocation()

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
        loadSelectedUserLocation()
    }, []);

    // Location.watchPositionAsync({
    //   enableHighAccuracy: true
    // }).then((loc) => {
    //   alert(loc.toString())
    // }).catch(() => {
    //   alert('Sorry there is an error')
    // })



    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: '29.928708731673133',
                    longitude: '71.844114549753'

                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >

                { selectedUserLocation.coords ? <Marker
                    title={selectedUser}
                    coordinate={{
                        latitude: selectedUserLocation.coords.latitude,
                        longitude: selectedUserLocation.coords.longitude

                    }} /> : null}
            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
