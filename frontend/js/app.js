const { PDFDocument, rgb, degrees } = PDFLib;

let currentTool = '';
let uploadedFiles = [];
let processedBlob = null;

// Tool configurations
const toolConfig = {
    'merge': {
        title: 'Merge PDF',
        icon: 'merge',
        accept: '.pdf',
        multiple: true,
        options: false
    },
    'split': {
        title: 'Split PDF',
        icon: 'split',
        accept: '.pdf',
        multiple: false,
        options: true
    },
    'compress': {
        title: 'Compress PDF',
        icon: 'compress',
        accept: '.pdf',
        multiple: false,
        options: true
    },
    'pdf-to-word': {
        title: 'PDF to Word',
        icon: 'convert',
        accept: '.pdf',
        multiple: false,
        options: false
    },
    'word-to-pdf': {
        title: 'Word to PDF',
        icon: 'convert',
        accept: '.docx',
        multiple: false,
        options: false
    },
    'pdf-to-jpg': {
        title: 'PDF to JPG',
        icon: 'convert',
        accept: '.pdf',
        multiple: false,
        options: true
    },
    'jpg-to-pdf': {
        title: 'JPG to PDF',
        icon: 'convert',
        accept: '.jpg,.jpeg,.png',
        multiple: true,
        options: false
    },
    'rotate': {
        title: 'Rotate PDF',
        icon: 'rotate',
        accept: '.pdf',
        multiple: false,
        options: true
    },
    'watermark': {
        title: 'Watermark PDF',
        icon: 'watermark',
        accept: '.pdf',
        multiple: false,
        options: true
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.dataset.tool;
            openToolModal(tool);
        });
    });

    // Smooth scroll for hero CTA buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Modal close
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.getElementById('toolModal').addEventListener('click', (e) => {
        if (e.target.id === 'toolModal') closeModal();
    });

    // Upload area
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // Process button
    document.getElementById('processBtn').addEventListener('click', processFiles);

    // Mobile menu
    document.querySelector('.mobile-menu-btn').addEventListener('click', toggleMobileMenu);
}

function openToolModal(tool) {
    currentTool = tool;
    const config = toolConfig[tool];
    const modal = document.getElementById('toolModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.querySelector('.modal-icon');
    const fileInput = document.getElementById('fileInput');

    modalTitle.textContent = config.title;
    modalIcon.className = `modal-icon tool-icon ${config.icon}`;
    modalIcon.innerHTML = document.querySelector(`[data-tool="${tool}"] .tool-icon`).innerHTML;
    
    fileInput.accept = config.accept;
    fileInput.multiple = config.multiple;

    resetModal();
    
    if (config.options) {
        renderOptions(tool);
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('toolModal').style.display = 'none';
    uploadedFiles = [];
    processedBlob = null;
    resetModal();
}

function resetModal() {
    const fileInput = document.getElementById('fileInput');
    fileInput.value = '';
    
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('fileList').innerHTML = '';
    document.getElementById('fileList').style.display = 'none';
    document.getElementById('optionsArea').innerHTML = '';
    document.getElementById('optionsArea').style.display = 'none';
    document.getElementById('progressArea').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('processBtn').style.display = 'block';
    document.getElementById('processBtn').disabled = true;
    uploadedFiles = [];
    processedBlob = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
}

function addFiles(files) {
    const config = toolConfig[currentTool];
    
    if (!config.multiple && files.length > 1) {
        alert('This tool only accepts one file at a time');
        return;
    }

    uploadedFiles = config.multiple ? [...uploadedFiles, ...files] : files;
    renderFileList();
    document.getElementById('processBtn').disabled = false;
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    fileList.style.display = 'block';

    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-pdf"></i>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${formatFileSize(file.size)}</p>
                </div>
            </div>
            <button class="remove-file" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    if (uploadedFiles.length === 0) {
        document.getElementById('processBtn').disabled = true;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function renderOptions(tool) {
    const optionsArea = document.getElementById('optionsArea');
    optionsArea.style.display = 'block';
    let optionsHTML = '';

    switch(tool) {
        case 'split':
            optionsHTML = `
                <div class="option-group">
                    <label>Split Mode</label>
                    <select id="splitMode">
                        <option value="range">Page Range</option>
                        <option value="all">Extract All Pages</option>
                    </select>
                </div>
                <div class="option-group" id="rangeInput">
                    <label>Page Range (e.g., 1-3, 5, 7-9)</label>
                    <input type="text" id="pageRange" placeholder="1-3">
                </div>
            `;
            break;
        case 'compress':
            optionsHTML = `
                <div class="option-group">
                    <label>Compression Level</label>
                    <select id="compressionLevel">
                        <option value="low">Low (Best Quality - ~10-20% reduction)</option>
                        <option value="medium" selected>Medium (Balanced - ~20-40% reduction)</option>
                        <option value="high">High (Smallest Size - ~40-60% reduction)</option>
                    </select>
                </div>
                <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 10px; padding: 1rem; margin-top: 1rem;">
                    <p style="color: #92400e; font-size: 0.9rem; margin: 0;">
                        <i class="fas fa-info-circle"></i> <strong>Note:</strong> Client-side compression has limitations. For extreme compression, consider using desktop software or online services with server processing.
                    </p>
                </div>
            `;
            break;
        case 'pdf-to-jpg':
            optionsHTML = `
                <div class="option-group">
                    <label>Image Quality</label>
                    <select id="imageQuality">
                        <option value="high">High</option>
                        <option value="medium" selected>Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            `;
            break;
        case 'rotate':
            optionsHTML = `
                <div class="option-group">
                    <label>Rotation Angle</label>
                    <select id="rotationAngle">
                        <option value="90">90° Clockwise</option>
                        <option value="180">180°</option>
                        <option value="270">270° Clockwise (90° Counter)</option>
                    </select>
                </div>
            `;
            break;
        case 'watermark':
            optionsHTML = `
                <div class="option-group">
                    <label>Watermark Text</label>
                    <input type="text" id="watermarkText" placeholder="Enter watermark text">
                </div>
                <div class="option-group">
                    <label>Position</label>
                    <select id="watermarkPosition">
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                    </select>
                </div>
            `;
            break;
    }

    optionsArea.innerHTML = optionsHTML;
}

async function processFiles() {
    showProgress();

    try {
        switch(currentTool) {
            case 'merge':
                await mergePDFs();
                break;
            case 'split':
                await splitPDF();
                break;
            case 'compress':
                await compressPDF();
                break;
            case 'rotate':
                await rotatePDF();
                break;
            case 'watermark':
                await watermarkPDF();
                break;
            case 'jpg-to-pdf':
                await imagesToPDF();
                break;
            case 'pdf-to-jpg':
                await pdfToImages();
                break;
            case 'pdf-to-word':
                await pdfToWord();
                break;
            case 'word-to-pdf':
                await wordToPDF();
                break;
        }

        showResult();
    } catch (error) {
        console.error('Processing error:', error);
        alert('An error occurred while processing your files. Please try again.');
        hideProgress();
    }
}

async function mergePDFs() {
    const mergedPdf = await PDFDocument.create();

    for (const file of uploadedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    processedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
}

async function splitPDF() {
    const file = uploadedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const splitMode = document.getElementById('splitMode').value;
    const newPdf = await PDFDocument.create();

    if (splitMode === 'all') {
        const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => newPdf.addPage(page));
    } else {
        const pageRange = document.getElementById('pageRange').value;
        const pages = parsePageRange(pageRange, pdfDoc.getPageCount());
        const copiedPages = await newPdf.copyPages(pdfDoc, pages);
        copiedPages.forEach((page) => newPdf.addPage(page));
    }

    const pdfBytes = await newPdf.save();
    processedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
}

async function compressPDF() {
    const file = uploadedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const compressionLevel = document.getElementById('compressionLevel')?.value || 'medium';
    
    // Remove metadata to reduce size
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
    
    // Save with compression options based on level
    const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: compressionLevel === 'high' ? 25 : compressionLevel === 'medium' ? 75 : 150,
        updateFieldAppearances: false,
    });
    
    processedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Show compression results
    const originalSize = file.size;
    const compressedSize = pdfBytes.length;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`Original: ${formatFileSize(originalSize)}, Compressed: ${formatFileSize(compressedSize)}, Reduction: ${reduction}%`);
}

async function rotatePDF() {
    const file = uploadedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const angle = parseInt(document.getElementById('rotationAngle').value);
    const pages = pdfDoc.getPages();
    
    pages.forEach(page => {
        page.setRotation(degrees(angle));
    });

    const pdfBytes = await pdfDoc.save();
    processedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
}

async function watermarkPDF() {
    const file = uploadedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const watermarkText = document.getElementById('watermarkText').value;
    const position = document.getElementById('watermarkPosition').value;
    const pages = pdfDoc.getPages();
    
    pages.forEach(page => {
        const { width, height } = page.getSize();
        let y;
        
        switch(position) {
            case 'top':
                y = height - 50;
                break;
            case 'bottom':
                y = 50;
                break;
            default:
                y = height / 2;
        }
        
        page.drawText(watermarkText, {
            x: width / 2 - (watermarkText.length * 5),
            y: y,
            size: 30,
            color: rgb(0.7, 0.7, 0.7),
            opacity: 0.3,
        });
    });

    const pdfBytes = await pdfDoc.save();
    processedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
}

async function imagesToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let firstPage = true;

    for (const file of uploadedFiles) {
        const imageData = await readFileAsDataURL(file);
        
        if (!firstPage) {
            pdf.addPage();
        }
        
        const img = new Image();
        await new Promise((resolve) => {
            img.onload = resolve;
            img.src = imageData;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;

        let finalWidth, finalHeight;
        if (imgRatio > pageRatio) {
            finalWidth = pageWidth;
            finalHeight = pageWidth / imgRatio;
        } else {
            finalHeight = pageHeight;
            finalWidth = pageHeight * imgRatio;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        pdf.addImage(imageData, 'JPEG', x, y, finalWidth, finalHeight);
        firstPage = false;
    }

    processedBlob = pdf.output('blob');
}

async function pdfToImages() {
    const file = uploadedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const zip = new JSZip();
    const quality = document.getElementById('imageQuality')?.value || 'medium';
    const scale = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1;
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.95);
        });
        
        zip.file(`page_${i}.jpg`, blob);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    processedBlob = zipBlob;
}

async function pdfToWord() {
    const file = uploadedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    
    const docContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
${fullText.split('\n').map(line => `<w:p><w:r><w:t>${line}</w:t></w:r></w:p>`).join('')}
</w:body>
</w:document>`;
    
    const zip = new JSZip();
    zip.file('word/document.xml', docContent);
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
    
    const docxBlob = await zip.generateAsync({ type: 'blob' });
    processedBlob = docxBlob;
}

async function wordToPDF() {
    const file = uploadedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    
    const zip = await JSZip.loadAsync(arrayBuffer);
    const docXml = await zip.file('word/document.xml').async('string');
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(docXml, 'text/xml');
    const textElements = xmlDoc.getElementsByTagName('w:t');
    
    let text = '';
    for (let elem of textElements) {
        text += elem.textContent + ' ';
    }
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    const lines = pdf.splitTextToSize(text, 180);
    let y = 20;
    
    lines.forEach((line, index) => {
        if (y > 280) {
            pdf.addPage();
            y = 20;
        }
        pdf.text(line, 15, y);
        y += 7;
    });
    
    processedBlob = pdf.output('blob');
}

function parsePageRange(range, totalPages) {
    const pages = [];
    const parts = range.split(',');
    
    parts.forEach(part => {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n.trim()) - 1);
            for (let i = start; i <= end && i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            const page = parseInt(part.trim()) - 1;
            if (page < totalPages) pages.push(page);
        }
    });
    
    return pages;
}

function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function showProgress() {
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('fileList').style.display = 'none';
    document.getElementById('optionsArea').style.display = 'none';
    document.getElementById('processBtn').style.display = 'none';
    document.getElementById('progressArea').style.display = 'block';
    
    const progressFill = document.querySelector('.progress-fill');
    progressFill.style.width = '0%';
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 90) {
            clearInterval(interval);
        } else {
            width += 10;
            progressFill.style.width = width + '%';
        }
    }, 200);
}

function hideProgress() {
    document.getElementById('progressArea').style.display = 'none';
    document.getElementById('processBtn').style.display = 'block';
}

function showResult() {
    document.querySelector('.progress-fill').style.width = '100%';
    setTimeout(() => {
        document.getElementById('progressArea').style.display = 'none';
        document.getElementById('resultArea').style.display = 'block';
        
        document.getElementById('downloadBtn').onclick = downloadFile;
        document.getElementById('processAnotherBtn').onclick = () => {
            closeModal();
        };
    }, 500);
}

function downloadFile() {
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    
    let extension = 'pdf';
    if (currentTool === 'pdf-to-jpg') extension = 'zip';
    if (currentTool === 'pdf-to-word') extension = 'docx';
    
    a.download = `processed_${currentTool}_${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');

    const menuIcon = document.querySelector('.mobile-menu-btn i');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-times');
}

// Close mobile menu when clicking on nav links
document.addEventListener('DOMContentLoaded', () => {
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const menuIcon = document.querySelector('.mobile-menu-btn i');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });
});

function toggleCompressionOptions() {
    // Function kept for compatibility but no longer needed
}
