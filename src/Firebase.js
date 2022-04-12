import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.storage = getStorage(this.app);
    this.db = getFirestore();
    this.auth = getAuth();

    enableIndexedDbPersistence(this.db);
  }

  async signIn(email, password) {
    const userCredentials = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    return userCredentials.user;
  }

  signOut() {
    return signOut(this.auth);
  }

  onAuthChange(cb) {
    return onAuthStateChanged(this.auth, (user) => {
      cb && cb(user);
    });
  }

  async uploadFiles(files) {
    const date = Date.now();

    const snapshots = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(this.storage, `images/${date}/${file.name}`);
      const snapshotPromise = uploadBytes(storageRef, file);

      snapshots.push(snapshotPromise);
    }

    return (await Promise.all(snapshots)).map((snapshot) => snapshot.metadata.fullPath)
  }

  addPost({ location = null, caption, images }) {
    const postCollection = collection(this.db, 'posts');

    return addDoc(postCollection, {
      location,
      caption,
      images,
      created: new Date(),
    });
  }

  subscribeToPosts(cb) {
    const postCollection = collection(this.db, 'posts');
    const q = query(postCollection, orderBy('created', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      cb && cb(docs);
    });
  }

  getImageUrl(imagePath) {
    return `https://firebasestorage.googleapis.com/v0/b/${
      this.app.options.storageBucket
    }/o/${encodeURIComponent(imagePath)}?alt=media`;
  }
}

export default Firebase;
