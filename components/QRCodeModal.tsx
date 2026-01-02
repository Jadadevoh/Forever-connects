import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    memorialName: string;
    url: string;
    profileImageUrl?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, memorialName, url, profileImageUrl }) => {
    const [size, setSize] = useState(400); // Default download size
    const [showPhoto, setShowPhoto] = useState(true);
    const qrRef = useRef<HTMLDivElement>(null);

    // Initial check: if no profile image, set showPhoto to false
    useEffect(() => {
        if (!profileImageUrl) setShowPhoto(false);
    }, [profileImageUrl]);

    if (!isOpen) return null;

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `memorial-qr-${memorialName.replace(/\s+/g, '-').toLowerCase()}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const handlePrint = () => {
        // Create a print-friendly window
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const canvas = qrRef.current?.querySelector('canvas');
            const imgUrl = canvas?.toDataURL('image/png');

            printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${memorialName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: 'Playfair Display', serif;
                text-align: center;
                background-color: white;
              }
              .border-container {
                border:  double 6px #1e293b;
                padding: 60px;
                border-radius: 30px;
                max-width: 600px;
                width: 90%;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              h2 { 
                  color: #64748b; 
                  margin: 0 0 10px 0; 
                  font-weight: 400; 
                  font-style: italic; 
                  font-size: 1.5rem;
              }
              h1 { 
                  color: #1e293b; 
                  margin: 0 0 30px 0; 
                  font-size: 3rem; 
                  line-height: 1.2;
              }
              .profile-img {
                  width: 150px;
                  height: 150px;
                  border-radius: 50%;
                  object-fit: cover;
                  border: 3px solid #e2e8f0;
                  margin-bottom: 20px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .qr-img { 
                  width: 250px; 
                  height: 250px; 
                  margin-bottom: 20px;
              }
              p { 
                  color: #64748b; 
                  margin-top: 10px; 
                  font-size: 1.2rem; 
                  font-family: sans-serif;
              }
              .url {
                  font-size: 0.8rem; 
                  margin-top: 20px; 
                  color: #94a3b8;
              }
              @media print {
                  body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="border-container">
              <h2>Forever in our Hearts</h2>
              <h1>${memorialName}</h1>
              ${showPhoto && profileImageUrl ? `<img src="${profileImageUrl}" class="profile-img" alt="${memorialName}" />` : ''}
              <img src="${imgUrl}" class="qr-img" alt="QR Code" />
              <p>Scan to view memorial</p>
              <p class="url">${url}</p>
            </div>
            <script>
              window.onload = function() { setTimeout(function(){ window.print(); window.close(); }, 500); }
            </script>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 text-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif font-bold text-deep-navy">Share Memorial</h3>
                    <button onClick={onClose} className="text-soft-gray hover:text-deep-navy">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex flex-col items-center mb-6" ref={qrRef}>
                    <div className="p-4 bg-white border border-silver rounded-lg shadow-sm">
                        <QRCodeCanvas
                            value={url}
                            size={200} // Display size
                            level={"H"}
                            includeMargin={true}
                        />
                        {/* Hidden canvas for high-res download */}
                        <div style={{ display: 'none' }}>
                            <QRCodeCanvas value={url} size={size} level={"H"} includeMargin={true} />
                        </div>
                    </div>
                    <p className="text-sm text-soft-gray mt-4">Scan to visit the memorial for <span className="font-semibold text-deep-navy">{memorialName}</span></p>
                </div>

                {/* Profile Photo Toggle */}
                {profileImageUrl && (
                    <div className="flex items-center justify-center mb-6">
                        <label className="flex items-center cursor-pointer space-x-2">
                            <input
                                type="checkbox"
                                checked={showPhoto}
                                onChange={(e) => setShowPhoto(e.target.checked)}
                                className="w-5 h-5 text-deep-navy border-gray-300 rounded focus:ring-deep-navy"
                            />
                            <span className="text-deep-navy font-medium">Include Profile Picture in Print</span>
                        </label>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center px-4 py-3 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download QR Code Image
                    </button>

                    <button
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center px-4 py-3 bg-silver hover:bg-soft-gray/80 text-deep-navy font-bold rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Card
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-silver">
                    <p className="text-xs text-soft-gray mb-2">QR Code Resolution (for download)</p>
                    <div className="flex justify-center space-x-2">
                        {[400, 800, 1200].map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`px-3 py-1 text-xs rounded-full border ${size === s ? 'bg-deep-navy text-white border-deep-navy' : 'bg-transparent text-soft-gray border-silver hover:border-deep-navy'}`}
                            >
                                {s}px
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QRCodeModal;
