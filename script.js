

const light = document.getElementById('box');
const concise = document.getElementById('concise');
const first = document.getElementById('first');
const second = document.getElementById('second');
const third = document.getElementById('third');
const revealUp = document.getElementById('revealUp');
const main = document.getElementById('main');
const summary = document.getElementById('summary');
const summaryResult = document.getElementById('summaryResult');
const choose = document.getElementById('choose');
const fileInput = document.getElementById('fileInput');
const statusUpdate = document.getElementById('status');
const lottie = document.getElementById('lottie');
const finalContent = document.getElementById('finalContent');
const scrollToMain = document.getElementById('scrollToMain');
const text = document.getElementById('text');
const menu = document.getElementById('menu');
const info = document.getElementById('info');
const menuClose = document.getElementById('menuClose');
const upload = document.getElementById('upload');


const PROD_API_BASE = 'https://pdfsummarize-5ija4xia5-emmanuels-projects-97cc2533.vercel.app';

async function callSummarizeEndpoint(chunk) {
  
  try {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: chunk
    });
    if (res.ok) return res.json();
    throw new Error(`Relative API failed: ${res.status}`);
  } catch (e) {
   
    if (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      const res2 = await fetch(`${PROD_API_BASE}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: chunk
      });
      if (!res2.ok) throw new Error(`Prod API failed: ${res2.status}`);
      return res2.json();
    }
    throw e;
  }
}

const CHUNK_SIZE = 2 * 1024 * 1024;
let body = document.body;

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


gsap.fromTo(light, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'linear' });

gsap.to('#box', {
  rotation: -4,
  transformOrigin: '50% 0%',
  duration: 1,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut'
});

ScrollTrigger.create({
  trigger: concise,
  start: 'top',
  onEnter: () => {
    document.body.style.backgroundColor = 'white';
    light.style.borderBottomColor = 'white';
  }
});

gsap.from(first, { x: -1020, duration: 1.4, scrollTrigger: { trigger: concise, start: 'bottom', scrub: 2 } });
gsap.from(second, { y: 1020, duration: 1.4, scrollTrigger: { trigger: concise, start: 'bottom', scrub: 2 } });
gsap.from(third, { x: 1020, duration: 1.4, scrollTrigger: { trigger: concise, start: 'bottom', scrub: 2 } });
gsap.from(revealUp, { y: 400, duration: 1.4, scrollTrigger: { trigger: concise, start: 'bottom', scrub: 2 } });

ScrollTrigger.create({
  trigger: concise,
  start: 'top',
  onEnter: () => gsap.to(body, { backgroundColor: 'white', duration: 0.3 }),
  onLeaveBack: () => gsap.to(body, { backgroundColor: 'black', duration: 0.3 })
});

ScrollTrigger.create({
  trigger: concise,
  start: 'bottom',
  onEnter: () => { main.style.display = 'block'; }
});


menu.addEventListener('click', () => {
  if (info.style.opacity == '1') {
    
    info.style.opacity = '0';
    info.style.transform = 'translateY(0px)';  
    info.style.transition = '0.5s ease';
    menuClose.className = 'fa-solid fa-bars';
    info.style.pointerEvents = 'none';
  } else {
    info.style.opacity = '1';
    info.style.transform = 'translateY(30px)';
    info.style.transition = '0.5s ease';
    menuClose.className = 'fa-solid fa-xmark';
    info.style.pointerEvents = 'auto';
  }
});


upload.addEventListener("click", () => {
  const target = document.getElementById('main');
  target.style.display = 'block';
  gsap.to(window, { duration: 0.4, scrollTo: target, ease: "linear" });
});

scrollToMain.addEventListener('click', () => {
  const target = document.getElementById('main');
  target.style.display = 'block';
  gsap.to(window, { duration: 0.4, scrollTo: target, ease: 'linear' });
});


  function move() {
      const target = document.getElementById('summary');
  gsap.to(window, { duration: 0.4, scrollTo: target, ease: 'linear' });
  }

choose.addEventListener('click', () => { fileInput.click(); });

fileInput.addEventListener('change', async e => {
  
   summaryResult.style.display = "flex"
  lottie.style.display = "flex"
  summary.style.display = "flex"
  
  const file = e.target.files[0];
  if (!file) return;

if (file.type !== 'application/pdf') {
move();
summary.style.opacity = 1
    fileInput.value = '';
   statusUpdate.textContent = "Invalid PDF format"

  //    try {
  //   const typedArray = new Uint8Array(await file.arrayBuffer());
  //   const pdf = await pdfjsLib.getDocument(typedArray).promise;
  //   console.log('PDF loaded successfully:', pdf.numPages);

  // } 
  // catch (err) {
  //   console.error('Failed to load PDF:', err);
  //   alert('This PDF is invalid or corrupted.');
  // }
return;

  }


  if (file.size > 50000000) {
    alert('File too large! Must be under 50MB.');
    return;
  }

move();
 
  summary.style.opacity = 1;
  lottie.style.opacity = 1;
  summary.style.transition = '3s ease';
  statusUpdate.textContent = 'Extracting text from PDF...';

  const text = await extractTextFromPDF(file);
  statusUpdate.textContent = 'Splitting into chunks...';
  const chunks = chunkText(text, 2000);
console.log(text);
  statusUpdate.textContent = `Summarizing ${chunks.length} chunks...`;

  const finalSummary = await summarizeChunks(chunks);

  statusUpdate.textContent = 'Done Summarizing';
  summaryResult.style.opacity = 1;

  if (!finalSummary || text.length < 15) {
    finalContent.textContent =
      'Unable to process. Please make sure your PDF contains typed or printed text, not an image.';
    lottie.style.opacity = 0;
  } else {
    finalContent.textContent = finalSummary;
    lottie.style.opacity = 0;
  }
});


async function extractTextFromPDF(file) {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        text += strings.join(' ') + '\n';
       
      }

      resolve(text);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });
}

function chunkText(text, size) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size;
  }
  return chunks;
}


async function summarizeChunks(chunks) {
  const summaries = [];

  for (const chunk of chunks) {
    try {
      const result = await callSummarizeEndpoint(chunk);

      if (result?.summary_text) {
        summaries.push(result.summary_text);
      } else {
        summaries.push(' Could not summarize this chunk.');
      }
    } catch (error) {
      console.error('Error summarizing chunk:', error);
      summaries.push(' Error summarizing this chunk.');
    }
  }

  return summaries.join('\n\n');
}
