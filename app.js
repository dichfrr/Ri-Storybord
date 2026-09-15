const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');
const preview = document.getElementById('preview');
const emptyState = document.getElementById('emptyState');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const emptyBreakdown = document.getElementById('emptyBreakdown');
const results = document.getElementById('results');
const diagramContent = document.getElementById('diagramContent');
let currentFile = null;
let currentView = 'top';

fileInput.addEventListener('change', e => handleFile(e.target.files[0]));
['dragenter','dragover'].forEach(type => dropzone.addEventListener(type, e => { e.preventDefault(); dropzone.classList.add('drag'); }));
['dragleave','drop'].forEach(type => dropzone.addEventListener(type, e => { e.preventDefault(); dropzone.classList.remove('drag'); }));
dropzone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
analyzeBtn.addEventListener('click', analyze);
resetBtn.addEventListener('click', reset);
document.querySelectorAll('.view-toggle button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  currentView = button.dataset.view;
  if (results.hidden) return;
  drawDiagram(currentView);
}));

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  if (file.size > 20 * 1024 * 1024) { alert('Please choose an image under 20 MB.'); return; }
  currentFile = file;
  const url = URL.createObjectURL(file);
  preview.src = url;
  preview.hidden = false;
  emptyState.hidden = true;
  analyzeBtn.disabled = false;
  resetBtn.hidden = false;
}

function analyze() {
  if (!currentFile) return;
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = 'Analyzing visual cues…';
  setTimeout(() => {
    // Demo adapter. Replace analyzeFrame() with a server/model call when a vision model is connected.
    const analysis = analyzeFrameDemo();
    renderResults(analysis);
    drawDiagram(currentView, analysis);
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = 'Re-analyze frame <span>↗</span>';
  }, 850);
}

function analyzeFrameDemo() {
  return {
    confidence: 'MEDIUM',
    shotType: 'Medium / portrait',
    focalLength: '~50–65 mm',
    cameraHeight: 'Eye level',
    dof: 'Shallow',
    keyLight: 'Soft · camera left · ~45°',
    fillLight: 'Low · negative fill likely',
    backLight: 'Possible edge from rear right',
    colorLook: 'Warm practical · controlled contrast',
    recreation: 'Start with one large soft key 45° camera-left. Keep the fill at least 1–2 stops under the key, add negative fill on the opposite side, and use a small harder source behind the subject if an edge is visible. Match the background practicals separately.'
  };
}

function renderResults(a) {
  emptyBreakdown.hidden = true;
  results.hidden = false;
  document.getElementById('confidenceValue').textContent = a.confidence;
  document.getElementById('shotType').textContent = a.shotType;
  document.getElementById('focalLength').textContent = a.focalLength;
  document.getElementById('cameraHeight').textContent = a.cameraHeight;
  document.getElementById('dof').textContent = a.dof;
  document.getElementById('keyLight').textContent = a.keyLight;
  document.getElementById('fillLight').textContent = a.fillLight;
  document.getElementById('backLight').textContent = a.backLight;
  document.getElementById('colorLook').textContent = a.colorLook;
  document.getElementById('recreationText').textContent = a.recreation;
}

function drawDiagram(view = 'top') {
  const common = `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#e7ff5a"/></marker></defs>`;
  if (view === 'side') {
    diagramContent.innerHTML = `${common}
      <line x1="90" y1="370" x2="810" y2="370" stroke="#222" stroke-width="2"/>
      <circle cx="475" cy="285" r="28" fill="none" stroke="#aaa"/>
      <line x1="475" y1="313" x2="475" y2="365" stroke="#aaa" stroke-width="2"/>
      <line x1="445" y1="340" x2="505" y2="340" stroke="#aaa"/>
      <rect x="165" y="205" width="60" height="48" rx="4" fill="#151515" stroke="#e7ff5a"/>
      <text x="195" y="195" text-anchor="middle" fill="#e7ff5a" font-size="11" font-family="DM Mono">KEY · SOFT</text>
      <line x1="225" y1="235" x2="445" y2="292" stroke="#e7ff5a" stroke-opacity=".45" stroke-dasharray="6 7" marker-end="url(#arrow)"/>
      <rect x="675" y="130" width="55" height="42" rx="4" fill="#151515" stroke="#aaa"/>
      <text x="702" y="118" text-anchor="middle" fill="#aaa" font-size="11" font-family="DM Mono">EDGE</text>
      <line x1="675" y1="170" x2="505" y2="290" stroke="#aaa" stroke-opacity=".35" stroke-dasharray="6 7"/>
      <rect x="310" y="335" width="70" height="30" rx="3" fill="#111" stroke="#888"/>
      <path d="M380 350 L435 340 L435 360 Z" fill="#111" stroke="#888"/>
      <text x="345" y="326" text-anchor="middle" fill="#888" font-size="10" font-family="DM Mono">CAMERA</text>
      <text x="475" y="405" text-anchor="middle" fill="#666" font-size="10" font-family="DM Mono">SUBJECT · EYE LEVEL</text>`;
  } else {
    diagramContent.innerHTML = `${common}
      <rect x="100" y="75" width="700" height="320" rx="4" fill="none" stroke="#202020" stroke-width="2"/>
      <circle cx="470" cy="235" r="34" fill="#111" stroke="#aaa"/>
      <text x="470" y="239" text-anchor="middle" fill="#aaa" font-size="10" font-family="DM Mono">SUBJECT</text>
      <path d="M275 350 L335 330 L335 370 Z" fill="#111" stroke="#888"/>
      <text x="275" y="386" text-anchor="middle" fill="#888" font-size="10" font-family="DM Mono">CAMERA · 50–65mm</text>
      <rect x="170" y="120" width="62" height="46" rx="4" fill="#151515" stroke="#e7ff5a"/>
      <text x="201" y="108" text-anchor="middle" fill="#e7ff5a" font-size="10" font-family="DM Mono">KEY / SOFT</text>
      <line x1="232" y1="143" x2="435" y2="220" stroke="#e7ff5a" stroke-opacity=".45" stroke-dasharray="6 7" marker-end="url(#arrow)"/>
      <circle cx="690" cy="145" r="25" fill="#151515" stroke="#888"/>
      <text x="690" y="149" text-anchor="middle" fill="#aaa" font-size="9" font-family="DM Mono">EDGE</text>
      <line x1="670" y1="162" x2="495" y2="218" stroke="#aaa" stroke-opacity=".35" stroke-dasharray="6 7"/>
      <rect x="640" y="285" width="75" height="46" rx="4" fill="#151515" stroke="#555"/>
      <text x="677" y="313" text-anchor="middle" fill="#666" font-size="9" font-family="DM Mono">PRACTICAL</text>
      <line x1="640" y1="305" x2="505" y2="245" stroke="#555" stroke-opacity=".4" stroke-dasharray="4 8"/>`;
  }
}

function reset() {
  currentFile = null;
  fileInput.value = '';
  preview.hidden = true;
  preview.removeAttribute('src');
  emptyState.hidden = false;
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = 'Analyze frame <span>↗</span>';
  resetBtn.hidden = true;
  emptyBreakdown.hidden = false;
  results.hidden = true;
  diagramContent.innerHTML = '<text x="450" y="235" text-anchor="middle" class="diagram-placeholder">UPLOAD A FRAME TO BUILD THE SETUP</text>';
}
