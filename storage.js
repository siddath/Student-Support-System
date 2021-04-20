class Storage {
    login = [];
    notifications = [];
    subjectList = [];
    attendance = [];
    following = [];
    contacts = [];
    newsTags = [];
    tagsIndex = [];

}

const StorageInstance = new Storage();
export {StorageInstance as Storage};