import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { app } from './index.js';

// Initialize firestore
export const db = getFirestore(app);

export const saveUser = async (
  userName,
  userLastName,
  userEmail,
  userBirthday,
  userPassword,
) => {
  await setDoc(doc(db, 'users', userEmail), {
    name: userName,
    lastName: userLastName,
    email: userEmail,
    birthday: userBirthday,
    password: userPassword,
  });
};
export const newPost = async (user, textToPost) => {
  await addDoc(collection(db, 'posts'), {
    contentPost: textToPost,
    date: new Date().toLocaleString(),
    creator: user,
    likes: [],
  });
};
// eslint-disable-next-line consistent-return
export const showUserName = async (email) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', email));
    if (docSnap.exists()) {
      return `${docSnap.data().name} ${docSnap.data().lastName}`;
    }
  } catch (error) {
    return error;
  }
};
export const listenToPosts = (updateFunction) => {
  const query = collection(db, 'posts');
  const unsubscribe = onSnapshot(query, (snapshot) => {
    const updatedPosts = [];
    snapshot.forEach((postData) => {
      const post = postData.data();
      post.id = postData.id;
      updatedPosts.push(post);
    });
    updateFunction(updatedPosts);
  });
  return unsubscribe;
};

export const editPost = async (id, newText) => {
  const postReference = doc(db, 'posts', id);
  await updateDoc(postReference, {
    contentPost: newText,
  });
};

export const deletePost = async (id) => {
  await deleteDoc(doc(db, 'posts', id));
};

export const addLike = async (idPost, user) => {
  const postReference = doc(db, 'posts', idPost);
  const docSnap = await getDoc(postReference);
  const allLikes = docSnap.data().likes;
  if (!allLikes.includes(user)) {
    allLikes.push(user);
    await updateDoc(postReference, {
      likes: allLikes,
    });
  }
};
export const deleteLike = async (idPost, actualUser) => {
  const postReference = doc(db, 'posts', idPost);
  const docSnap = await getDoc(postReference);
  const allLikes = docSnap.data().likes;
  if (allLikes.includes(actualUser)) {
    delete (allLikes[allLikes.indexOf(actualUser)]);
    await updateDoc(postReference, {
      likes: allLikes.filter((user) => user !== undefined),
    });
  }
};
