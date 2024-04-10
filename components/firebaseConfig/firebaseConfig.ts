import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export const setupFirebase = () => {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_APIKEY,
        authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
        projectId: process.env.NEXT_PUBLIC_PROJECTID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGID,
        appId: process.env.NEXT_PUBLIC_APPID
    };

    const app = initializeApp(firebaseConfig)

    const database = getDatabase(app)

    return database
}