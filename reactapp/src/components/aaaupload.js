import React, { useEffect, useState, } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

const Aaaupload = () => {

const [photo, setPhoto] = useState([]);
const [photoString, setPhotoString] = useState('');

     const onChange = ({ fileList: newPhoto }) => {
          setPhoto(newPhoto);
     };

     useEffect (() => {
          if (photo.length > 0) {
               setPhotoString(photo[0].thumbUrl)
               // console.log('photo -------------', photo);
               // console.log('photo[0] -------------', photo[0].thumbUrl);
               // console.log('photo[0].thumbUrl -------------', photo[0].thumbUrl);
          }
     },
     [photo])

     useEffect (() => {
          if (photoString.length > 0) {
               // console.log('photoString -----------',photoString);
               // console.log('src ----------', src);
          }
     },
     [])


     const onPreview = async file => {
          let src = file.url;
          if (!src) {
               src = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj);
                    reader.onload = () => resolve(reader.result);
               });
          }
          const image = new Image();
          image.src = src;
          const imgWindow = window.open(src);
          imgWindow.document.write(image.outerHTML);
          console.log('image ----------', image);
     };

     const successRequest = ({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        };

     return (
          <div>

               <ImgCrop rotate>
                    <Upload
                         // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                         listType="picture-card"
                         fileList={photo}
                         onChange={onChange}
                         onPreview={onPreview}
                         customRequest={successRequest}
                    >
                         {photo.length < 1 && 'Ajoutez une photo'}
                    </Upload>
               </ImgCrop>


          </div>
     );
};

export default Aaaupload;


