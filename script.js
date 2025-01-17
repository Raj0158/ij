const dropArea = document.getElementById('dropArea');
const imageInput = document.getElementById('imageInput');
const previewArea = document.getElementById('previewArea');
const selectImageBtn = document.getElementById('selectImageBtn');
const addImageBtn = document.getElementById('addImageBtn');

selectImageBtn.addEventListener('click', () => imageInput.click());
addImageBtn.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', (event) => handleFiles(event.target.files));

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('active');
});

dropArea.addEventListener('dragleave', () => dropArea.classList.remove('active'));

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('active');
    handleFiles(event.dataTransfer.files);
});

function handleFiles(files) {
    dropArea.classList.add('hidden');
    addImageBtn.classList.remove('hidden');

    Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // JPEG Data URL
                    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);

                    createPreview(e.target.result, jpegDataUrl);
                };
            };

            reader.readAsDataURL(file);
        }
    });
}

function createPreview(originalSrc, jpegSrc) {
    const previewCard = document.createElement('div');
    previewCard.classList.add('preview-card');

    const originalPreview = document.createElement('div');
    originalPreview.classList.add('image-preview');
    originalPreview.innerHTML = `<img src="${originalSrc}" alt="Original Image"><p>Original Image</p>`;

    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    arrow.textContent = '↓';

    const jpegPreview = document.createElement('div');
    jpegPreview.classList.add('jpg-preview');
    jpegPreview.innerHTML = `<img src="${jpegSrc}" alt="JPEG Image"><p>JPEG Image</p>`;

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download JPEG';
    downloadButton.classList.add('download-btn');
    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = jpegSrc;
        link.download = 'image.jpeg';
        link.click();
    });

    previewCard.appendChild(originalPreview);
    previewCard.appendChild(arrow);
    previewCard.appendChild(jpegPreview);
    previewCard.appendChild(downloadButton);

    previewArea.appendChild(previewCard);
}
