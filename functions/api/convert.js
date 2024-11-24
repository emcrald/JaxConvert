const sharp = require('sharp');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body); // parse incoming JSON (base64 file buffer)

    if (!body || !body.file || !body.filename || !body.filename.endsWith('.webp')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Only .webp files are supported!' }),
      };
    }

    // decode base64 file buffer
    const fileBuffer = Buffer.from(body.file, 'base64');

    // convert to png
    const pngBuffer = await sharp(fileBuffer).toFormat('png').toBuffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${body.filename.replace('.webp', '.png')}"`,
      },
      body: pngBuffer,
      isBase64Encoded: false,
    };
  } catch (err) {
    console.error('Conversion error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to convert file.' }) };
  }
};
