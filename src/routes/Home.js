import {useEffect, useState} from 'react';
import {addDoc, onSnapshot, collection} from 'firebase/firestore';
import {dbService} from 'fbase';
import Swit from 'components/Swit';

const Home = ({userObj}) => {
    const [swit, setSwit] = useState("");
    const [swits, setSwits] = useState([]);

    // 데이터베이스 불러오기 (새로고침해야 업데이트 됨)
    // const getSwits = async () => {
    //     const dbSwits = await getDocs(collection(dbService, "swits"));
    //     dbSwits.forEach((document) => { 
    //         const switObject = {...document.data(), id: document.id};
    //         setSwits((prev) => [switObject, ...prev]);
    //     });
    // };
    
    useEffect(() => {
        // getSwits();
        
        // 실시간 데이터베이스
        onSnapshot(collection(dbService, "swits"), (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }))
            setSwits(newArray);
        });
    }, []);
    
    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService, "swits"), {
            text: swit,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setSwit("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {target: {value}} = event;
        setSwit(value);
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={swit} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Swit" />
            </form>
            <div>
                {swits.map((swit) => (
                    <Swit key={swit.id} switObj={swit} isOwner={swit.creatorId === userObj.uid} />
                ))}
            </div>
        </>
    );
}

export default Home;