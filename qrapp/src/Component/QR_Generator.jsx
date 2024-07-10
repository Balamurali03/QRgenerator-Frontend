import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Styles/Qr_Styles.css'; // Make sure to import the CSS file
import AppLogo from '../Images/AppLogo.png'

const QR_Generator = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

  const validateUrl = (url) => {
    return urlRegex.test(url);
  }

  const generateQRCode = () => {
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      setShowQR(false);
      return;
    }
    setError('');
    setShowQR(true);
  }

  const refreshInput = () => {
    setUrl('');
    setError('');
    setShowQR(false);
  }

  const refreshQR = () => {
    setShowQR(false);
    setError('');
  }

  const downloadImage = (format) => {
    if (!showQR) return;

    const canvas = document.getElementById('qrcode');
    html2canvas(canvas).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, `QRCode.${format}`);
      });
    });
  }

  return (
    <div className="container">
      {!showQR ? (
        <div className="url-input-container">
          <h1><img src={AppLogo} alt="logo" style={{height:"170px", width:"170px"}}/></h1>
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
          <button className="btn" onClick={generateQRCode}>Generate QR</button>
          {error && <p>{error}</p>}
        </div>
      ) : (
        <div className="qr-result-container">
          <h1><img src={AppLogo} alt="logo" style={{height:"170px", width:"170px"}}/></h1>
          <button className="round-button1" onClick={refreshQR}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div id="qrcode" className="qr-image">
            <QRCode value={url} size={160} />
          </div>
          <button className="btn" onClick={() => downloadImage('png')}>Download as PNG</button>
          <button className="btn" onClick={() => downloadImage('jpg')}>Download as JPG</button>
        </div>
      )}
    </div>
  );
}

export default QR_Generator;
