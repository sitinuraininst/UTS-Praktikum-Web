
'use strict';

/* ────────────────────────────────────────────────
   1. NAVIGASI & UI DASAR
   ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const backTop = document.getElementById('backTop');

// Efek scroll navbar & tombol back-to-top
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  backTop.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open', open);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
  });
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ────────────────────────────────────────────────
   2. SCROLL REVEAL (Animasi Muncul)
   ──────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ────────────────────────────────────────────────
   3. LOGIKA TOMBOL BELI (LANGSUNG KE FORM)
   ──────────────────────────────────────────────── */
document.querySelectorAll('.btn-card').forEach(btn => {
  btn.addEventListener('click', function() {
    // 1. Beri efek visual singkat pada tombol
    const originalText = this.textContent;
    this.textContent = '✓ Dipilih';
    this.style.background = '#2ecc71';
    this.style.color = 'white';

    // 2. Langsung scroll ke bagian form pemesanan
    const targetSection = document.getElementById('pesan');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 3. Kembalikan teks tombol setelah 1 detik
    setTimeout(() => {
      this.textContent = originalText;
      this.style.background = '';
      this.style.color = '';
    }, 1000);
  });
});

/* ────────────────────────────────────────────────
   4. VALIDASI FORMULIR PEMESANAN
   ──────────────────────────────────────────────── */
const form = document.getElementById('orderForm');
const formSuc = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

function setError(fieldId, errId, message) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(errId);
  if (message) {
    field.classList.add('input-error');
    errEl.textContent = message;
    errEl.classList.add('visible');
    return false;
  } else {
    field.classList.remove('input-error');
    errEl.textContent = '';
    errEl.classList.remove('visible');
    return true;
  }
}

function setErrorEl(errId, message) {
  const errEl = document.getElementById(errId);
  if (message) {
    errEl.textContent = message;
    errEl.classList.add('visible');
    return false;
  } else {
    errEl.textContent = '';
    errEl.classList.remove('visible');
    return true;
  }
}

// Validasi Real-time
function validateNama() {
  const val = document.getElementById('nama').value.trim();
  if (!val) return setError('nama', 'err-nama', 'Nama lengkap wajib diisi.');
  if (val.length < 3) return setError('nama', 'err-nama', 'Nama minimal 3 karakter.');
  return setError('nama', 'err-nama', '');
}

function validateEmail() {
  const val = document.getElementById('email').value.trim();
  if (!val) return setError('email', 'err-email', 'Email wajib diisi.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return setError('email', 'err-email', 'Format email tidak valid.');
  return setError('email', 'err-email', '');
}

function validateTelepon() {
  const val = document.getElementById('telepon').value.trim();
  if (!val) return setError('telepon', 'err-telepon', 'Nomor telepon wajib diisi.');
  if (!/^[0-9\-+\s]{8,15}$/.test(val)) return setError('telepon', 'err-telepon', 'Nomor telepon tidak valid.');
  return setError('telepon', 'err-telepon', '');
}

function validateJumlah() {
  const val = document.getElementById('jumlah').value;
  if (!val) return setError('jumlah', 'err-jumlah', 'Jumlah wajib diisi.');
  if (isNaN(val) || Number(val) < 1) return setError('jumlah', 'err-jumlah', 'Jumlah minimal 1.');
  return setError('jumlah', 'err-jumlah', '');
}

function validateProduk() {
  const val = document.getElementById('pilihan_produk').value;
  if (!val) return setError('pilihan_produk', 'err-produk', 'Pilih salah satu produk.');
  return setError('pilihan_produk', 'err-produk', '');
}

function validatePengiriman() {
  const chosen = document.querySelector('input[name="pengiriman"]:checked');
  if (!chosen) return setErrorEl('err-pengiriman', 'Pilih metode pengiriman.');
  return setErrorEl('err-pengiriman', '');
}

document.getElementById('nama').addEventListener('blur', validateNama);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('telepon').addEventListener('blur', validateTelepon);
document.getElementById('jumlah').addEventListener('blur', validateJumlah);
document.getElementById('pilihan_produk').addEventListener('change', validateProduk);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const ok = validateNama() && validateEmail() && validateTelepon() && 
             validateJumlah() && validateProduk() && validatePengiriman();

  if (!ok) {
    submitBtn.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' }
    ], { duration: 350 });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Mengirim...';

  setTimeout(() => {
    form.style.display = 'none';
    formSuc.classList.add('show');
  }, 1200);
});

window.resetForm = function () {
  form.reset();
  form.style.display = 'block';
  formSuc.classList.remove('show');
  submitBtn.disabled = false;
  submitBtn.querySelector('span').textContent = 'Kirim Pesanan';
  
  ['nama','email','telepon','jumlah','pilihan_produk'].forEach(id => {
    document.getElementById(id)?.classList.remove('input-error');
  });
  ['err-nama','err-email','err-telepon','err-jumlah','err-produk','err-pengiriman'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('visible'); }
  });
};