"use strict";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, getBlob } from "firebase/storage";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const config = {
    apiKey: "AIzaSyCdJBLaoA_iNKHHg_OiAgMQUUhYRs1bkKM",
    authDomain: "heqed-house-d1ea0.firebaseapp.com",
    projectId: "heqed-house-d1ea0",
    storageBucket: "heqed-house-d1ea0.appspot.com",
    messagingSenderId: "448791487673",
    appId: "1:448791487673:web:e08164efe419be071f6768"
};

const app = initializeApp(config);
const storage = getStorage(app);

export async function uploadFile(fileRef, file) {
    const storageRef = ref(storage, `${IS_PRODUCTION ? "prodcution/" : "development/"}${fileRef}`);
    await uploadBytes(storageRef, file);
}

export async function getFile(fileRef) {
    const storageRef = ref(storage, `${IS_PRODUCTION ? "prodcution/" : "development/"}${fileRef}`);
    return await getBlob(storageRef);
}