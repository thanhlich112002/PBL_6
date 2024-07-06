import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Image.css';
import Loading from '../../components/Loading/Loading'

function Image({ images, setImages, setDeletedImageUrls, urls, setUrls }) {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState(0);


    const selectFiles = () => {
        fileInputRef.current.click();
    };
    const onFileSelect = (event) => {
        const files = event.target.files;
        const maxImageCount = 6;

        if (files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            if (images.length >= maxImageCount) {
                alert('Bạn đã chọn đủ 9 ảnh. Không thể thêm nữa.');
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
        const deletedImage = images[index];

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
    const ShowImage = (index, image) => {
        setUrls(images[index].url)
        setIndex(index)
    }


    return (
        <div className='cardproduct'>
            <input type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect} hidden>
            </input>
            <div className='Showimage'>
                {isLoading ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}>
                        <Loading />
                    </div>

                ) : (
                    <div className='imgproduct'>
                        <div className='index'>
                            <div className='index1'>
                                {images.map((image, index) => (
                                    <div onClick={() => ShowImage(index, image)}>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span onClick={deleteImage(index)}>
                            X
                        </span>
                        <div className='containerimg'>

                            <img className='img' src={urls} alt />
                        </div>
                    </div>)}

                {/* {images.length < 6 && (
                    <div className='image' style={{ border: '0.1px dotted #818181', borderRadius: '5px' }} role='button' onClick={selectFiles}>
                        <i class="fa-solid fa-upload"></i>
                    </div>
                )} */}


            </div>

        </div>
    );
}

export default Image;
