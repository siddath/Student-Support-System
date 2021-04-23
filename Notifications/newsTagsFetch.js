import {Storage} from '../storage.js';
async function getNewsTags(){
    const db=firebase.firestore();
    let newsTagsData = db.collection('news-tags').get().then(snapshot => {
        snapshot.docs.forEach(docs =>{
            for(var tag in docs.data()){
                var value = docs.get(tag);
                Storage.newsTags.push({tag: tag, fullvalue : value});
            }
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await newsTagsData;
}
export {getNewsTags as getNewsTags};