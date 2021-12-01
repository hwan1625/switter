import { dbService, storageService } from 'fbase';
import {doc, deleteDoc, updateDoc} from 'firebase/firestore';
import {deleteObject, ref} from 'firebase/storage';
import {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faPencilAlt} from '@fortawesome/free-solid-svg-icons';

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
        <div className="swit">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container switEdit">
                        <input onChange={onChange} value={newSwit} required placeholder="Edit youer swit" autoFocus className="formInput" />
                        <input type="submit" value="Update Swit" className="formBtn" />
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                </>
            ) : (
                <>
                    <h4>{switObj.text}</h4>
                    {switObj.attachmentUrl && (<img src={switObj.attachmentUrl} width="50px" height="50px" />)}
                    {isOwner && (
                        <div className="swit__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span> 
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}         
                </>
            )}
        </div>
    );
};

export default Swit;