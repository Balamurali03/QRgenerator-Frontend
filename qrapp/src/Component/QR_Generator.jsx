import React, { useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Styles/Qr_Styles.css'; // Make sure to import the CSS file
import AppLogo from '../Images/AppLogo.png'

const QR_Generator = () => {
    const [url, setUrl] = useState('');
    const [qrImage, setQrImage] = useState(null);
    const [error, setError] = useState('');
  
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  
    const validateUrl = (url) => {
      return urlRegex.test(url);
    }
  
    const execute = () => {
      if (!validateUrl(url)) {
        setError('Please enter a valid URL');
        setQrImage(null);
        return;
      }
      setError('');
  
      axios.get('http://localhost:9003/generate', {
        headers: {
          'url': url
        },
        responseType: 'blob'
      })
      .then((response) => {
        const imageUrl = URL.createObjectURL(response.data);
        setQrImage(imageUrl);
      })
      .catch((error) => {
        console.error(error);
        setQrImage(null);
        setError('Failed to generate QR code');
      });
    }
  
    const refreshInput = () => {
      setUrl('');
      setError('');
    }
  
    const refreshQR = () => {
      setQrImage(null);
      setError('');
    }
    const downloadImage = (format) => {
    if (!qrImage) return;

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `QRCode.${format}`;
    link.click();
  }
  
    return (
        <div className="container">
        {!qrImage ? (
          <div className="url-input-container">
            <h1><img src={AppLogo} alt="logo" style={{height:"150px", width:"200px"}}/></h1>
            <button className="round-button" onClick={refreshInput}>
              <i className="fas fa-sync-alt"></i>
            </button>
            <label>URL :</label>
            <input 
              type="url" 
              placeholder="Provide the URL" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
            />
            <button className="btn" onClick={execute}>Generate QR</button>
            {error && <p>{error}</p>}
          </div>
        ) : (
          <div className="qr-result-container">
            <h1><img src={AppLogo} alt="logo" style={{height:"150px", width:"150px"}}/></h1>
            <button className="round-button1" onClick={refreshQR}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <img src={qrImage} alt="QR Code" />
            </div>
            <button className="btn" onClick={() => downloadImage('jpg')}>Download as JPG</button>
            <button className="btn" onClick={() => downloadImage('pdf')}>Download as PDF</button>
          </div>
        )}
      </div>
    );
  }
  
  export default QR_Generator;
