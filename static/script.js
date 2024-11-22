form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
  
    if (!file || !file.name.endsWith('.webp')) {
      output.textContent = 'Only .webp files are supported!';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1]; // remove "data:..." prefix
      output.textContent = 'Converting...';
  
      try {
        const res = await fetch('/.netlify/functions/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, filename: file.name }),
        });
  
        if (!res.ok) throw new Error('Conversion failed.');
  
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace('.webp', '.png');
        a.click();
  
        URL.revokeObjectURL(url);
        output.textContent = 'Conversion complete!';
      } catch (err) {
        output.textContent = 'Error: ' + err.message;
      }
    };
  
    reader.readAsDataURL(file);
  });
  