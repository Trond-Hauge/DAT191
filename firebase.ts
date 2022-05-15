"use strict";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getBlob, deleteObject } from "firebase/storage";

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

function getStorageRef(fileRef) {
    return ref(storage, `${IS_PRODUCTION ? "production/" : "development/"}${fileRef}`);
}

export async function uploadFile(fileRef, file) {
    const storageRef = getStorageRef(fileRef);
    await uploadBytes(storageRef, file);
}

export async function getFile(fileRef) {
    const storageRef = getStorageRef(fileRef);
    return await getBlob(storageRef);
}

export async function deleteFile(fileRef) {
    const storageRef = getStorageRef(fileRef);
    await deleteObject(storageRef);
}