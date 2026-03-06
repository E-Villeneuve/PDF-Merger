import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import download from 'downloadjs'
import Sortable from 'sortablejs'




const selectedFiles = document.getElementById("files");
const fileList = document.getElementById('fileList');
const dynamicFiles = []



async function mergePdfs(files) {
  const mergedPdf = await PDFDocument.create()

  for (const file of files) {

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    for (const page of copiedPages) {
        mergedPdf.addPage(page);
    }


  }
  
  const merged = await mergedPdf.save();
  return merged;
}


const mergeBtn = document.getElementById("mergeBtn");
mergeBtn.addEventListener('click', async () => {
    const files = Array.from(dynamicFiles || []);
    if (files.length === 0) return alert("Select PDFs first.");

    try {
        mergeBtn.disabled = true;
        mergeBtn.textContent = "Merging...";
        const result = await mergePdfs(files);
        download(result, "merged.pdf", "application/pdf");
    }
    finally {
        mergeBtn.disabled = false;
        mergeBtn.textContent = "Merge PDFs";

    }
})

document.getElementById('files').addEventListener('change', () => {
    dynamicFiles.length = 0;
    fileList.innerHTML = '';
    Array.from(selectedFiles.files).forEach((f, i) => {
    dynamicFiles.push(f);
    const div = document.createElement('div');
    div.classList.add('list-group-item');
    div.textContent = f.name;
    fileList.appendChild(div);

})
    if (dynamicFiles.length > 0) {
        mergeBtn.disabled = false;
        mergeBtn.title = "";
    }
    else {
        mergeBtn.disabled = true;
        mergeBtn.title = "You must select your PDFs before you can merge!";
    }
    

    Sortable.create(fileList, { animation: 150, onUpdate: function(evt) {

        
        //[dynamicFiles[evt.oldIndex], dynamicFiles[evt.newIndex]] = [dynamicFiles[evt.newIndex], dynamicFiles[evt.oldIndex]];
        const [moved] = dynamicFiles.splice(evt.oldIndex, 1);
        dynamicFiles.splice(evt.newIndex, 0, moved);


    } });
})