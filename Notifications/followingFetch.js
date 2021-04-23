import {Storage} from '../storage.js';
const session = window.sessionStorage;
const loggedInUser = session.getItem("loggedInUser");
async function followingDataFetch(){
    const db=firebase.firestore();
    let followingData = db.collection('following').get().then(snapshot => {
        snapshot.docs.forEach(docs =>{
            if(docs.id==="following-"+loggedInUser){
            for(var folllowEle in docs.data()){
                var value = docs.get(folllowEle);
                for(var tags of value)
                {
                Storage.following.push(tags);
                }
            }
            }
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await followingData;
}
async function newsContentFetch(newsTag){
    const db=firebase.firestore();
    let newsContentData = db.collection(newsTag).get().then(snapshot => {
        snapshot.docs.forEach(docs =>{
            for(var contentElement in docs.data()){
                var str = newsTag;
                var res = str.split("-");
                var contentData = docs.get(contentElement);
                console.log(contentElement);
                Storage.notifications.push({title : contentElement, content: contentData, tag: res[0]});
            }
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await newsContentData;
}
export {followingDataFetch as followingDataFetch, newsContentFetch as newsContentFetch};