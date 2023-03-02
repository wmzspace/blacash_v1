import {serverIPP} from '../values/strings';
import {globalVal, userInfo} from '../values/global';

export const getNftImgs = () => {
  fetch('http:/' + serverIPP + '/nftimg', {
    method: 'GET',
  })
    .then(res => {
      if (res.ok) {
        res.json().then(resData => {
          // console.log(resData);
          // setnftImgs(resData);
          globalVal.allNfts = resData;
          userInfo.ownedNfts = resData
            ?.map((nftImg, index) => {
              return nftImg?.owner === userInfo.email ? nftImg : null;
            })
            .filter(n => n);

          // console.log(userInfo.ownedNfts);
        });
      } else {
        console.error('res error when getting nftImgs!');
      }
    })
    .catch(e => {
      console.log(e.message);
    });
};
