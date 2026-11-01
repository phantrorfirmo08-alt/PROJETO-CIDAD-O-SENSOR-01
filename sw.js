/**
 * RARU NEXUS AI V11 Plus - app.js
 * Motor de Áudio OGG/TTS, Sirenes e Protocolos de Telemetria
 * Ano: 2026 • Grupo A Chave da Esperança (GADE)
 */

let ctxSarah = null;
let bufferSarah = null;
let oggCarregado = false;
let tentativaCarregamento = false;

async function initSarah() {
  if (oggCarregado || tentativaCarregamento) return;
  tentativaCarregamento = true;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    ctxSarah = new AudioContextClass();
    if (ctxSarah.state === 'suspended') {
      await ctxSarah.resume();
    }
    
    const resposta = await fetch('./sarah_feminina.ogg', { cache: 'no-store' });
    if (!resposta.ok) throw new Error('Arquivo OGG não encontrado');
    
    const arrayBuffer = await resposta.arrayBuffer();
    bufferSarah = await ctxSarah.decodeAudioData(arrayBuffer);
    
    const silentSource = ctxSarah.createBufferSource();
    silentSource.buffer = ctxSarah.createBuffer(1, 1, 22050);
    silentSource.connect(ctxSarah.destination);
    silentSource.start(0);
    
    oggCarregado = true;
  } catch (e) {
    oggCarregado = false;
  } finally {
    tentativaCarregamento = false;
  }
}

function falarSARAHOGG(textoAlternativo = "Sistema RARU SARAH ativo. Prevenção inteligente para todos.") {
  if (ctxSarah && ctxSarah.state === 'suspended') {
    ctxSarah.resume();
  }

  if (oggCarregado && bufferSarah && ctxSarah) {
    try {
      const source = ctxSarah.createBufferSource();
      source.buffer = bufferSarah;
      source.connect(ctxSarah.destination);
      source.start(0);
      return true;
    } catch (err) {}
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textoAlternativo);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    
    let voices = window.speechSynthesis.getVoices();
    let ptVoice = voices.find(v => v.lang.toLowerCase().includes('pt')) || voices[0];
    if (ptVoice) utterance.voice = ptVoice;
    
    window.speechSynthesis.speak(utterance);
    return true;
  }
  return false;
}

window.initSarah = initSarah;
window.falarSARAHOGG = falarSARAHOGG;
window.falarSarah = falarSARAHOGG;

const liberarAudioGlobal = () => {
  initSarah();
  if (window.speechSynthesis) window.speechSynthesis.resume();
};
document.addEventListener('click', liberarAudioGlobal, { once: true });
document.addEventListener('touchstart', liberarAudioGlobal, { once: true });

const CLOUDFLARE_WORKER_URL = "https://sarah-envelope.phantrorfirmo08.workers.dev/";
const APP_SHARE_URL = "https://phantrorfirmo08-alt.github.io/PROJETO-CIDAD-O-SENSOR-01/";

const shareMessageText = `🛡️ RARU NEXUS AI V11 Plus\n📍 Rede Automatizada de Resiliência Urbana\nMesquita - RJ & 92 Municípios do Estado do Rio de Janeiro\n\nPrevenção inteligente para todos. Sistema cívico integrado com telemetria P2P avançada, radar meteorológico de 9 fontes em tempo real, vistorias de campo com carimbo de HASH SHA-256 e suporte da inteligência artificial SARAH.\n\n🔗 Instale o aplicativo oficial PWA na sua tela inicial:\n${APP_SHARE_URL}\n\n_Grupo A Chave da Esperança © GADE • Rocha Sobrinho, Mesquita - RJ_`;

let audioCtx = null;
let br_osc = null, br_gain = null, br_comp = null, br_pan = null, br_loop = null;
let ru_osc = null, ru_gain = null, ru_comp = null, ru_pan = null, ru_loop = null;
let criseInt = null, criseTempo = 0;

function initAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function digital_CEMADEN_BR() {
    initAudioCtx();
    parar_BR();
    br_osc = audioCtx.createOscillator();
    br_gain = audioCtx.createGain();
    br_comp = audioCtx.createDynamicsCompressor();
    br_pan = audioCtx.createStereoPanner();

    br_comp.threshold.setValueAtTime(-20, audioCtx.currentTime);
    br_comp.ratio.setValueAtTime(12, audioCtx.currentTime);

    br_osc.type = 'sine';
    br_osc.frequency.setValueAtTime(850, audioCtx.currentTime);
    br_gain.gain.setValueAtTime(0.9, audioCtx.currentTime);
    br_pan.pan.setValueAtTime(0.8, audioCtx.currentTime);

    br_osc.connect(br_comp);
    br_comp.connect(br_gain);
    br_gain.connect(br_pan);
    br_pan.connect(audioCtx.destination);
    br_osc.start();

    let on = true;
    br_loop = setInterval(() => {
        try { br_gain.gain.setValueAtTime(on ? 0.9 : 0.001, audioCtx.currentTime); on = !on; } catch(e){}
    }, 1000);
}

function parar_BR() {
    if (br_loop) clearInterval(br_loop);
    if (br_osc) {
        try { br_gain.gain.setValueAtTime(0.001, audioCtx.currentTime); setTimeout(() => { try { br_osc.stop(); } catch(e){} }, 150); } catch(e){}
        br_osc = null;
    }
}

function digital_RUSSO() {
    initAudioCtx();
    parar_RU();
    ru_osc = audioCtx.createOscillator();
    ru_gain = audioCtx.createGain();
    ru_comp = audioCtx.createDynamicsCompressor();
    ru_pan = audioCtx.createStereoPanner();

    ru_comp.threshold.setValueAtTime(-20, audioCtx.currentTime);
    ru_comp.ratio.setValueAtTime(12, audioCtx.currentTime);

    ru_osc.type = 'sine';
    ru_osc.frequency.setValueAtTime(330, audioCtx.currentTime);
    ru_gain.gain.setValueAtTime(0.9, audioCtx.currentTime);
    ru_pan.pan.setValueAtTime(-0.8, audioCtx.currentTime);

    ru_osc.connect(ru_comp);
    ru_comp.connect(ru_gain);
    ru_gain.connect(ru_pan);
    ru_pan.connect(audioCtx.destination);
    ru_osc.start();

    let high = false;
    ru_loop = setInterval(() => {
        try { ru_osc.frequency.setValueAtTime(high ? 440 : 330, audioCtx.currentTime); high = !high; } catch(e){}
    }, 900);
}

function parar_RU() {
    if (ru_loop) clearInterval(ru_loop);
    if (ru_osc) {
        try { ru_gain.gain.setValueAtTime(0.001, audioCtx.currentTime); setTimeout(() => { try { ru_osc.stop(); } catch(e){} }, 150); } catch(e){}
        ru_osc = null;
    }
}

function parar_TUDO() {
    if (criseInt) clearInterval(criseInt);
    parar_BR();
    parar_RU();
}

console.log("RARU NEXUS V11 Plus • app.js carregado com sucesso.");
