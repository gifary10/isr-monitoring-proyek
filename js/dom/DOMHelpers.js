/**
 * DOM Helper functions
 */

export function getElement(id) {
  return document.getElementById(id);
}

export function getValue(id) {
  const el = getElement(id);
  return el ? el.value : '';
}

export function getValueTrim(id) {
  return getValue(id).trim();
}

export function setValue(id, value) {
  const el = getElement(id);
  if (el) el.value = value;
}

export function showElement(id) {
  const el = getElement(id);
  if (el) el.style.display = 'flex';
}

export function hideElement(id) {
  const el = getElement(id);
  if (el) el.style.display = 'none';
}

export function setInnerHTML(id, html) {
  const el = getElement(id);
  if (el) el.innerHTML = html;
}

export function setDisabled(id, disabled) {
  const el = getElement(id);
  if (el) el.disabled = disabled;
}

export function setButtonLoading(id, loading, loadingText = 'Memproses...') {
  const el = getElement(id);
  if (!el) return;
  if (loading) {
    el.disabled = true;
    el.innerHTML = `<i class="bi bi-hourglass-split me-2"></i> ${loadingText}`;
  } else {
    el.disabled = false;
    el.innerHTML = '<i class="bi bi-file-earmark-arrow-up me-2"></i> Generate Laporan';
  }
}