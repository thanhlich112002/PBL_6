import React, { useState } from 'react';
import './Loading.css'
const LoadingModal = () => {

  return (
    <div>
        <div className="modal-overlay_load">
            <div className="loader_load"></div>
        </div>
    </div>
  );
};

export default LoadingModal;
