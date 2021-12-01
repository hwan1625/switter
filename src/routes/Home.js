import {useEffect, useState} from 'react';
import {onSnapshot, collection, orderBy, query} from 'firebase/firestore';
import {dbService} from 'fbase';
import Swit from 'components/Swit';
import SwitFactory from 'components/SwitFactory';

const Home = ({userObj}) => {
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
        const q = query(collection(dbService, "swits"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }))
            setSwits(newArray);
        });
    }, []);
    

    return (
        <div className="container">
          <SwitFactory userObj={userObj} />  
            <div style={{marginTop: 30}}>
                {swits.map((swit) => (
                    <Swit key={swit.id} switObj={swit} isOwner={swit.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
}

export default Home;