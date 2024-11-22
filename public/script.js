const form = document.getElementById('convert-form');
const output = document.getElementById('output');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    output.textContent = 'Converting...';

    try {
        const res = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('Conversion failed.');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        // create temporary link
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.png';
        a.click();

        // cleanup
        URL.revokeObjectURL(url);
        output.textContent = 'Conversion complete!';
    } catch (err) {
        output.textContent = 'Error: ' + err.message;
    }
});