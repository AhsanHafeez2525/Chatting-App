import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAMDhU4FIjLisqBWzkixmyzukVgPTPFdQc",
    authDomain: "erozgar-training-app.firebaseapp.com",
    projectId: "erozgar-training-app",
    storageBucket: "erozgar-training-app.appspot.com",
    messagingSenderId: "145583590677",
    appId: "1:145583590677:web:658359bff504160ed72d1c",
    measurementId: "G-65H9CWQ5T6"
};

const app = initializeApp(firebaseConfig);
export default app ;
