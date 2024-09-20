const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyBLBnbseeSF0sUuKWjI6rpMZa6dTGA82-0",
    authDomain: "flutter-app-ff477.firebaseapp.com",
    projectId: "flutter-app-ff477",
    storageBucket: "flutter-app-ff477.appspot.com",
    messagingSenderId: "131705640251",
    appId: "1:131705640251:web:f9d3a70b895aebc36c931e",
    measurementId: "G-1SL1KXQ406"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app);

exports.registUser = async (req, h) => {
    const { email, uid } = req.payload;
    if (!email & !uid) {
        return h.response({ message: "Email and uid are required!" }).code(400);
    }
    
    const userRef = doc(db, "users", uid);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return h.response({ message: "User already exists, login successful" }).code(200);
        }

        await setDoc(userRef, {
            email: email,
        });
        return h.response({ message: "User registered successfully" }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

// Login User
exports.loginUser = (req, h) => {
    const { email, password } = req.payload;
    if (!email || !password) {
        return h.response({ message: "Email and password are required!" }).code(400);
    }

    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user.getIdToken().then(idToken => {
                return h.response({
                    message: "User logged in successfully",
                    userId: userCredential.user.uid,
                    idToken: idToken,
                    refreshToken: userCredential.user.refreshToken,
                    displayName: userCredential.user.displayName
                }).code(200);
            });
        })
        .catch((error) => {
            return h.response({ message: error.message }).code(500);
        });
};

exports.updateUser = async (req, h) => {
    const { uid, ...updateData } = req.payload;

    if (!uid || Object.keys(updateData).length === 0) {
        return h.response({ message: "User ID and at least one field to update are required!" }).code(400);
    }

    const userRef = doc(db, "users", uid);
    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            return h.response({ message: "User not found!" }).code(404);
        }

        await updateDoc(userRef, updateData);
        return h.response({ message: "User updated successfully" }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};