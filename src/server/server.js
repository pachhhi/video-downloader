const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const { stdout } = require('process');
const path = require('path')

const app = express();
const PORT = 3000;

const cors = require('cors')

app.use(cors());

app.get('/', async (req,res) => {  //obtener URL como una consulta req.query.rul
    const videoUrl = req.query.url;

    if (!videoUrl) { 
        return res.status(400).send('URL is required')
    }
    
    const outputDir = path.join(__dirname, 'downloads')
    const outputFilePath = path.join(outputDir, 'downloaded_video.mp4') // construye una ruta para guardar el video descargado en una carpeta llamada downloads

    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const command = `yt-dlp -o "${outputFilePath}" ${videoUrl}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Failed to download video')
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }
        console.log(`Stdout: ${stdout}`);

        if (fs.existsSync(outputFilePath)) {
            console.log(`File Exists: ${outputFilePath}`);
            res.download(outputFilePath, 'downloaded_video.mp4', (err) => { //setear headers y enviar archivo
                if (err) {
                    console.error(`Error sending file: ${err.message}`);
                    res.status(500).send('Failed to send file')
                }
    
                fs.unlink(outputFilePath, (unlinkErr) => { //limpiar archivo despues de enviar
                    if (unlinkErr) {
                        console.error(`Error deleting file: ${unlinkErr.message}`);
                    }
                });
            })
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});