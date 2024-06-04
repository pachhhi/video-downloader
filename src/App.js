import './App.css';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('')

  const handleDownload = async () => {
   
    if (!url) {
      alert('URL is required');
      return;
    }
   
    try {
      const responseUrl = `http://localhost:3000/?url=${encodeURIComponent(url)}`
      console.log(`Requesting: ${responseUrl}`)
      const response = await axios.get(responseUrl, {
        responseType: 'blob'
      })

      const urlBlob = URL.createObjectURL(response.data);

      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = 'download_video.mp4'
      a.click();
      URL.revokeObjectURL(urlBlob);

      
   } catch (error) {
      console.error('Failed to download video:', error)
   }
  }; 

  return (
    <div className="App">
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder='Enter file URL'/>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default App;
