const profiles = {
  video: [
    { name: 'Full HD', detail: 'MP4 · 1080p · H.264', size: '84 MB', value: '1080p MP4' },
    { name: 'Balanced', detail: 'MP4 · 720p · H.264', size: '42 MB', value: '720p MP4' },
    { name: 'Smallest', detail: 'MP4 · 480p · H.264', size: '18 MB', value: '480p MP4' }
  ],
  audio: [
    { name: 'Studio', detail: 'MP3 · 320 kbps', size: '12 MB', value: '320 kbps MP3' },
    { name: 'Everyday', detail: 'MP3 · 192 kbps', size: '7 MB', value: '192 kbps MP3' },
    { name: 'Lossless', detail: 'WAV · 44.1 kHz', size: '68 MB', value: 'WAV' }
  ],
  file: [
    { name: 'Original', detail: 'Keep source format intact', size: '—', value: 'Original file' },
    { name: 'Universal', detail: 'PDF / ZIP compatible', size: '—', value: 'Universal copy' },
    { name: 'Compressed', detail: 'Optimized archive', size: '—', value: 'Compressed ZIP' }
  ]
};

const recent = [
  ['Morning light over Kyoto', 'MP4 · 1080p', 'Today, 09:42', '82 MB', 'video'],
  ['Design systems that scale', 'MP3 · 320 kbps', 'Yesterday, 18:06', '46 MB', 'audio'],
  ['Project brief — Q4', 'PDF · Original', '24 Sep, 12:13', '2.4 MB', 'file']
];

let kind = 'video';
let selected = 0;
let prepared = false;
let localFile = null;
const $ = (selector) => document.querySelector(selector);
const options = $('#options');

function renderOptions() {
  options.innerHTML = '';
  profiles[kind].forEach((profile, index) => {
    const node = $('#option-template').content.firstElementChild.cloneNode(true);
    node.classList.toggle('selected', index === selected);
    node.querySelector('strong').textContent = profile.name;
    node.querySelector('small').textContent = profile.detail;
    node.querySelector('.option-size').textContent = profile.size;
    node.addEventListener('click', () => { selected = index; renderOptions(); updateReady(); });
    options.append(node);
  });
}

function updateReady() {
  const profile = profiles[kind][selected];
  $('#selection-copy').textContent = prepared ? `${profile.value} is ready to download.` : 'Select a source to prepare your download.';
  $('#download-button').disabled = !prepared;
}

function prepare() {
  const url = $('#source-url').value.trim();
  if (!url) { showInputMessage('Add a valid public link or choose a file first.', true); $('#source-url').focus(); return; }
  if (!isHttpUrl(url)) { showInputMessage('Use a public link that starts with http:// or https://.', true); $('#source-url').focus(); return; }
  localFile = null;
  const host = new URL(url).hostname.replace('www.', '').split('.')[0].toUpperCase();
  setPreparedSource({ summary: `${host} source detected`, type: `${host} · READY TO PREPARE`, title: `A shared ${host.toLowerCase()} item`, meta: 'Estimated duration 03:24 · Available now' });
}

function isHttpUrl(value) {
  try { const { protocol } = new URL(value); return protocol === 'http:' || protocol === 'https:'; } catch { return false; }
}

function showInputMessage(message, isError = false) {
  $('#input-feedback').textContent = message;
  $('#input-feedback').classList.toggle('is-error', isError);
  $('#source-url').parentElement.classList.toggle('needs-input', isError);
}

function setPreparedSource({ summary, type, title, meta }) {
  prepared = true;
  $('#source-summary').textContent = summary;
  $('#source-type').textContent = type;
  $('#source-title').textContent = title;
  $('#source-meta').textContent = meta;
  $('#source-card').classList.add('prepared');
  $('#ai-message').textContent = 'For this source, Balanced MP4 gives you a crisp result with a sensible file size.';
  showInputMessage('Source ready. Choose a profile below.');
  updateReady();
}

function prepareFile(file) {
  if (!file) return;
  localFile = file;
  $('#source-url').value = '';
  const extension = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE';
  setPreparedSource({ summary: 'Local file ready', type: `${extension} · LOCAL FILE`, title: file.name, meta: `${formatBytes(file.size)} · kept private in your browser` });
}

function formatBytes(bytes) {
  if (!bytes) return '0 bytes';
  const units = ['bytes', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** exponent)).toFixed(exponent ? 1 : 0)} ${units[exponent]}`;
}

function download() {
  const profile = profiles[kind][selected];
  if (localFile) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(localFile);
    link.download = localFile.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
    finishDownload();
    return;
  }
  const body = `Dropwise prepared download\n\nSource: ${$('#source-url').value}\nProfile: ${profile.value}\n\nThis local demo prepares download settings only. Use content you own or are authorized to save.`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
  link.download = `dropwise-${kind}-download.txt`;
  link.click(); URL.revokeObjectURL(link.href);
  finishDownload();
}

function finishDownload() {
  $('#download-button').innerHTML = 'Downloaded <span>✓</span>';
  setTimeout(() => { $('#download-button').innerHTML = 'Download <span>↓</span>'; }, 1800);
}

document.querySelectorAll('.format-tab').forEach((tab) => tab.addEventListener('click', () => {
  kind = tab.dataset.kind; selected = 0;
  document.querySelectorAll('.format-tab').forEach((button) => button.classList.toggle('active', button === tab));
  renderOptions(); updateReady();
}));
document.querySelectorAll('[data-source]').forEach((button) => button.addEventListener('click', () => { $('#source-url').value = `https://${button.dataset.source.toLowerCase().replaceAll(' ', '')}.com/`; prepare(); }));
$('#inspect-button').addEventListener('click', prepare);
$('#source-url').addEventListener('keydown', (event) => { if (event.key === 'Enter') prepare(); });
$('#file-picker-button').addEventListener('click', () => $('#file-input').click());
$('#file-input').addEventListener('change', (event) => prepareFile(event.target.files[0]));
$('#drop-zone').addEventListener('dragover', (event) => { event.preventDefault(); $('#drop-zone').classList.add('is-dragging'); });
$('#drop-zone').addEventListener('dragleave', () => $('#drop-zone').classList.remove('is-dragging'));
$('#drop-zone').addEventListener('drop', (event) => { event.preventDefault(); $('#drop-zone').classList.remove('is-dragging'); prepareFile(event.dataTransfer.files[0]); });
$('#ai-button').addEventListener('click', () => { kind = 'video'; selected = 1; document.querySelector('[data-kind="video"]').click(); $('#ai-message').textContent = 'Recommendation applied: 720p MP4 is an excellent balance for sharing and storage.'; });
$('#download-button').addEventListener('click', download);
$('#theme-toggle').addEventListener('click', () => document.body.classList.toggle('dark'));

$('#library-list').innerHTML = recent.map(([title, format, date, size, type]) => `<article class="library-item"><div class="item-icon ${type}">${type === 'video' ? '▶' : type === 'audio' ? '♫' : '↗'}</div><div class="item-name"><strong>${title}</strong><small>${format}</small></div><div class="item-date">${date}</div><div class="item-size">${size}</div><button type="button" class="item-more" aria-label="More options">•••</button></article>`).join('');
renderOptions(); updateReady();
