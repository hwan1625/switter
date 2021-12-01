import {ref, uploadString, getDownloadURL} from 'firebase/storage';
import {v4 as uuidv4} from 'uuid';
import {dbService, storageService} from 'fbase';
import {addDoc, collection} from 'firebase/firestore';
import {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faTimes} from '@fortawesome/free-solid-svg-icons'

const SwitFactory = ({userObj}) => {
    const [swit, setSwit] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        if(swit === "") {
            return;
        }
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
        if(Boolean(theFile)) {
            reader.readAsDataURL(theFile);
        }
    }

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" value={swit} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file" type="file" accept="image/*" onChange={onFileChange} style={{opacity: 0,}} />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{backgroundImage: attachment,}} />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default SwitFactory;