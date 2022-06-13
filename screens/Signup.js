import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth';
const SingUp = (props) => {
  const auth = getAuth()

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [phoneNumer, setPhoneNumber] = useState()

  const signUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(userCredential)
        alert('User Created')
        // ...
      })
      .catch((error) => {
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error.message)
        // ..
      });
  }

  console.log(props.route.params)
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
      />
      <TextInput
        placeholder='Enter Email'
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
      {/* <TextInput
        placeholder='Enter First Name'
        style={styles.textInput}
        onChangeText={(t) => {
          setFirstName(t)
        }}
      /> */}
      {/* <TextInput
        placeholder='Enter Last Name'
        style={styles.textInput}
        onChangeText={(t) => {
          setLastName(t)
        }}
      />
      <TextInput
        placeholder='Enter Phone Number'
        style={styles.textInput}
        onChangeText={(t) => {
          setPhoneNumber(t)
        }}
      /> */}
      <Button
        title='Sign up'
        onPress={() => signUp()}
      />
      <Button
        title='Already have an account, sign in'
        onPress={() => {
          props.navigation.goBack()
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    height: 40,
    width: '80%',
    margin: 5
  }
});

export default SingUp;
