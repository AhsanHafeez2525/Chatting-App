import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Image, FlatList } from 'react-native'
import { useState, useEffect } from 'react'
import {
    getAuth
} from 'firebase/auth';

import { addDoc, getFirestore, doc, collection, getDocs, onSnapshot, arrayRemove } from "firebase/firestore";
import app from '../firebase'
import { async } from '@firebase/util';

const ChatScreen = (props) => {
    console.log(props)
    const db = getFirestore(app)

    const auth = getAuth()
    let dummyData = [
        { msg: 'Hi', msgFrom: auth.currentUser.email },
        { msg: 'hello', msgFrom: 'abc@gmail.com' },
        { msg: 'Apko Pata hai mera pass bhut nikami class hai', msgFrom: auth.currentUser.email },
        { msg: 'G G nazar a raha hai', msgFrom: 'eRozgar@pitb.gov.pk' },


    ]

    const [msg, setMsg] = useState(null)
    const [data, setData] = useState([])

    const onSendPressed = async () => {
        try {
            let res = await addDoc(collection(db, "Chat"), {
                msg: msg,
                msgFrom: auth.currentUser.email,
                timeStamp: new Date()
            })
            setMsg('')
        } catch (e) {
            console.log(e)
        }
    }
    const renderItem = ({ item }) => {
        return (
            auth.currentUser.email == item.msgFrom ? <View style={{
                backgroundColor: '#90EE90',
                width: '30%',
                padding: 10,
                borderRadius: 10,
                alignSelf: 'flex-end',
                margin: 5
            }}>
                <Text style={{ fontWeight: 'bold' }}>You</Text>
                <Text>
                    {item.msg}
                </Text>
            </View>
                : <View style={{
                    backgroundColor: '#FAF9F6',
                    alignSelf: 'flex-start',
                    width: '40%',
                    padding: 10,
                    borderRadius: 10,
                    margin: 5

                }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.msgFrom}</Text>
                    <Text>
                        {item.msg}
                    </Text>
                </View>

        )
    }


    useEffect(() => {
        const unsub = onSnapshot(collection(db, "Chat"), (docs) => {
            try {
                let msgs = []
                docs.forEach((doc) => {
                    console.log(doc.data())
                    msgs.push(doc.data())
                })
                setData(msgs)

            } catch (e) {

            }
        })
    }, [])


    return (
        <View style={styles.container}>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View style={{
                flexDirection: 'row',

            }}>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        value={msg}
                        style={styles.msgField}
                        placeholder='Write your message here'
                        onChangeText={(t) => setMsg(t)}
                    />

                    <TouchableOpacity
                        style={{ width: '12%', marginTop: 3 }}
                        onPress={() => onSendPressed()}
                    >
                        <Image
                            style={styles.img}
                            source={require('../assets/send.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    msgField: {
        margin: 5,
        width: '88%',
        height: 35,
        padding: 2,
        backgroundColor: '#d3d3d3',
        borderRadius: 10
    },
    img: {
        width: 35,
        height: 35
    }
})



export default ChatScreen;