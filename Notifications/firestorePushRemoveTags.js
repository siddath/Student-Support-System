import {Storage} from '../storage.js';
const session = window.sessionStorage;
const loggedInUser = session.getItem("loggedInUser");
async function pushTagToFollowing(tagId){
    const i = Storage.following.length + 1;
    const db=firebase.firestore();
    var followingDocRef = db.collection('following').doc('following-'+loggedInUser);
    var setWithMerge = followingDocRef.set({
        i: tagId+'-news',
    }, { merge: true })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });

    const dataFinal = await setWithMerge;
}

async function removeTagFromFollowing(id){
    const db=firebase.firestore();
    var docRefToRemove = db.collection('following').doc('following-'+loggedInUser);
    // Remove the 'capital' field from the document
    var removeFollowingTag = docRefToRemove.update({
        i : firebase.firestore.FieldValue.delete()
    });

    const dataFinal = await removeFollowingTag;
}
export {pushTagToFollowing as pushTagToFollowing, removeTagFromFollowing as removeTagFromFollowing};