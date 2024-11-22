const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');

const app = express();
const PORT = 3000;

// setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// handle webp to png
app.post('/api/convert', upload.single('file'), async (req, res) => {
    const { file } = req;

    if (!file || path.extname(file.originalname).toLowerCase() !== '.webp') {
        return res.status(400).json({ error: 'Only .webp files are supported!' });
    }

    const outputFileName = `${file.filename}.png`;
    const outputPath = path.join(__dirname, 'uploads', outputFileName);

    try {
        await sharp(file.path).toFormat('png').toFile(outputPath);
        await fs.unlink(file.path); // clean up original file async

        return res.json({
            message: 'Conversion successful!',
            download: `/uploads/${outputFileName}`,
        });
    } catch (err) {
        console.error('Conversion error:', err);
        return res.status(500).json({ error: 'Failed to convert file.' });
    }
});

// serve converted files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`jax convert running at http://localhost:${PORT}`));
