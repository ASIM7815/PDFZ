# PDFZ - Modern PDF Tools

A fully functional, modern PDF editor website with Gen Z-friendly design, similar to iLovePDF.

## Features

✨ **PDF Tools:**
- Merge PDF - Combine multiple PDFs into one
- Split PDF - Extract specific pages from PDF
- Compress PDF - Reduce file size
- PDF to Word - Convert PDF to DOCX (demo)
- Word to PDF - Convert DOCX to PDF (demo)
- PDF to JPG - Convert PDF pages to images (demo)
- JPG to PDF - Convert images to PDF
- Rotate PDF - Rotate pages in your PDF
- Watermark - Add watermark to PDF

🎨 **Design Features:**
- Modern, Gen Z-friendly UI with gradients
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Drag & drop file upload
- Real-time progress indicators
- Clean and intuitive interface

🔒 **Security:**
- Client-side processing (no server upload for most features)
- Files processed in browser using PDF-lib
- Privacy-focused approach

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **PDF Processing:** PDF-lib, jsPDF, PDF.js, JSZip
- **Icons:** Font Awesome
- **Design:** Custom CSS with gradients and animations

## Setup Instructions

1. **Open the project:**
   - Navigate to `d:\projects\PDFZ\frontend\`
   - Open `index.html` in your browser

2. **For local development:**
   - Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```
   - Open `http://localhost:8000` in your browser

3. **No build process required!** Just open and use.

## How to Use

1. Click on any tool card (Merge, Split, Compress, etc.)
2. Upload your files by dragging & dropping or clicking to browse
3. Configure options if available
4. Click "Process Files"
5. Download your processed file

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Features Breakdown

### All Features Fully Functional:
- ✅ Merge PDF
- ✅ Split PDF
- ✅ Compress PDF
- ✅ Rotate PDF
- ✅ Watermark PDF
- ✅ JPG to PDF
- ✅ PDF to JPG (extracts all pages as images in ZIP)
- ✅ PDF to Word (extracts text to DOCX)
- ✅ Word to PDF (converts DOCX text to PDF)

## File Structure

```
PDFZ/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Styles
│   └── js/
│       └── app.js          # JavaScript logic
└── backend/                # For future backend implementation
```

## Customization

### Colors:
Edit CSS variables in `style.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --success: #10b981;
}
```

### Add New Tools:
1. Add tool card in HTML
2. Add configuration in `toolConfig` object in `app.js`
3. Implement processing function

## Performance

- Lightweight (~50KB total)
- Fast client-side processing
- No server dependencies for core features
- Optimized for mobile devices

## Future Enhancements

- [ ] Backend API for advanced conversions
- [ ] User accounts and file history
- [ ] Batch processing
- [ ] Cloud storage integration
- [ ] OCR support
- [ ] Digital signatures
- [ ] More file formats

## License

MIT License - Feel free to use and modify!

## Credits

Built with ❤️ for PDF lovers
Inspired by iLovePDF

---

**Note:** All features are now fully functional using client-side JavaScript libraries. PDF to Word extracts text content, Word to PDF converts text to PDF, and PDF to JPG exports all pages as images in a ZIP file.
