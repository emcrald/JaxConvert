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

        const data = await res.json();
        output.innerHTML = `
        <p>${data.message}</p>
        <a href="${data.download}" download>Download Converted File</a>
      `;
    } catch (err) {
        output.textContent = 'Error: ' + err.message;
    }
});  