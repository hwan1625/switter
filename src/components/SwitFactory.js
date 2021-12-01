import {ref, uploadString, getDownloadURL} from 'firebase/storage';
import {v4 as uuidv4} from 'uuid';
import {dbService, storageService} from 'fbase';
import {addDoc, collection} from 'firebase/firestore';
import {useState} from 'react';

const SwitFactory = ({userObj}) => {
    const [swit, setSwit] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const uploadTask = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(uploadTask.ref);
        }
        await addDoc(collection(dbService, "swits"), {
            text: swit,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });
        setSwit("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {target: {value}} = event;
        setSwit(value);
    };

    const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit}>
            <input value={swit} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Swit" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    );
};

export default SwitFactory;