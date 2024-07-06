import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Image.css';

function Image({ images, setImages, setDeletedImageUrls }) {
  const fileInputRef = useRef(null);
  const [imgDelete, setDelete] = useState([]);
  useEffect(() => {
    setDeletedImageUrls([]);
  }, []);
  const selectFiles = () => {
    fileInputRef.current.click();
    console.log(images);
  };
  const onFileSelect = (event) => {
    const files = event.target.files;
    const maxImageCount = 6;

    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (images.length >= maxImageCount) {
        alert('Bạn đã chọn đủ 6 ảnh. Không thể thêm nữa.');
        break;
      }

      if (files[i].type.split('/')[0] !== 'image') continue;

      if (!images.some((e) => e.name === files[i].name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            file: files[i],
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
        ]);
      }
    }
  };


  const deleteImage = (index) => {

    setDeletedImageUrls((prevImages) => [
      ...prevImages,
      {
        url: images[index].url,
      },
    ]);

    setImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };


  return (
    <div className='card'>
      <input type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect} hidden>
      </input>
      <div className='container1'>
        {images.map((image, index) => (
          <div className='image' key={index}>
            <span className='delete' onClick={() => deleteImage(index)}>
              x
            </span>
            <img className='anh' src={image.url} alt={image.name} />
          </div>
        ))}
        {images.length < 6 && (
          <div className='image' style={{ border: '0.1px dotted #818181', borderRadius: '5px' }} role='button' onClick={selectFiles}>
            <i class="fa-solid fa-upload"></i>
          </div>
        )}

      </div>
    </div>
  );
}

export default Image;
