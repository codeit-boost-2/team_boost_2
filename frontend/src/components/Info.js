import Like from './Like.js';
import './Info.css';
import { useState } from "react";
import InfoChangeModal from "./Info_change_modal.js"
import InfoDeleteModal from "./Info_delete_modal.js"

//D day 계산
function calculateDaysDifference(createdAt) {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const difference = now - createdDate;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return "D+0";
    } else {
      return `D+${days}`;
    }
  }

const style={
    boxSizing:'border-box',
    display: 'flex',
    fontFamily: 'Spoqa Han Sans Neo, Sans-Serif',
    fontWeight: '400'
};

//그룹 정보 나타내는 info 컴포넌트
function Info({ items }){
    const{
        name,
        image,
        introduction,
        isPublic,
        likeCount,
        createdAt,
        postCount,
      } = items;
    const [like, setLike] = useState(likeCount);
    const [changeModal, setChangeModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    
    const handleLikeClick = () => {
        const afterLike = like +1;
        setLike(afterLike);
    }
    const dday = calculateDaysDifference(createdAt);
    let imageUrl = `http://ec2-43-201-103-14.ap-northeast-2.compute.amazonaws.com:3000/images/${image}`;
    if(image === null)
    {
        imageUrl = `http://ec2-43-201-103-14.ap-northeast-2.compute.amazonaws.com:3000/images/default.jpg`;
    }
      return(
        <>
        <div style={style}>
            <div className='infoImage'>
                {isPublic === true && (
                <img style={{width:'262px', height:'273px',objectFit:"cover"}}src={imageUrl} alt='그룹이미지' />
                )}
            </div>     
            <div style={{flexGrow:'1', margin:'10px'}}>
                <div className='groupInfo'>
                    <div style={{display:'flex', flexDirection:'row'}}>
                    <div className='dday'>{dday}</div>
                    <div className='line'></div>
                    <div className='status'>{isPublic === true ? '공개' : '비공개'}</div>
                    </div>
                    <div>
                    <button className='infoButton' onClick={() => setChangeModal(!changeModal)}>그룹 정보 수정하기</button>
                    {
                        changeModal === true ? <InfoChangeModal items={items} setModal={setChangeModal}/> : null
                    }
                    <button className='infoButton' style={{color:"gray"}} onClick={() => setDeleteModal(!deleteModal)}>그룹 삭제하기</button>
                    {
                        deleteModal === true ? <InfoDeleteModal setModal={setDeleteModal} id={items.id} /> : null
                    }
                    </div>
                </div>
                <div className='infoTitle'>
                    <h2>{name}</h2>
                    <div className='titleHeader'>
                        <div style={{padding:'0 20px'}}>추억 {postCount}</div>
                        <div className='line'></div>
                        <div style={{paddingLeft:'10px'}}>그룹 공감 {like}</div>
                    </div>
                </div>
                <div className='infoBody'>
                    {introduction}
                </div>
                <div className='badge'>
                    <div />
                    <Like handleLikeClick={handleLikeClick}/>
                </div>
                
            </div>
           
        </div>
        </>
    );
}

export default Info;
