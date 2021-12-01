import { dbService, storageService } from 'fbase';
import {doc, deleteDoc, updateDoc} from 'firebase/firestore';
import {deleteObject, ref} from 'firebase/storage';
import {useState} from 'react';

const Swit = ({switObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newSwit, setNewSwit] = useState(switObj.text);

    const onDeleteClick = () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok) {
            deleteDoc(doc(dbService, "swits", switObj.id));
            if(switObj.attachmentUrl !== "") {
                deleteObject(ref(storageService, switObj.attachmentUrl));
            }
        }
    };
    
    const toggleEditing = () => setEditing((prev) => !prev);
    
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewSwit(value);
    };
    
    const onSubmit = async (event) => {
        event.preventDefault();
        updateDoc(doc(dbService, "swits", switObj.id), {text:newSwit});
        
        setEditing(false);
    };

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} value={newSwit} required  />
                        <input type="submit" value="Update Swit" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{switObj.text}</h4>
                    {switObj.attachmentUrl && (<img src={switObj.attachmentUrl} width="50px" height="50px" />)}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Swit</button>  
                            <button onClick={toggleEditing}>Edit Swit</button>
                        </>
                    )}         
                </>
            )}
        </div>
    );
};

export default Swit;