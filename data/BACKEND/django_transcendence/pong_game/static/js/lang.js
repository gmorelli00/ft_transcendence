async function changeLanguage(langCode) {
  try {
    const response = await fetch(`/set_language/${langCode}/`);
    const data = await response.json();
    
    if (data.status === 'success') {
      await loadTranslations(langCode);
      updateDropdownText(langCode);
    }
  } catch (error) {
    console.error('Errore nel cambio lingua:', error);
  }
}

async function loadTranslations(langCode) {
  const response = await fetch(`/translations/?lang=${langCode}`);
  const translations = await response.json();
  
  applyTranslations(translations);
}

function applyTranslations(translations) {
  Object.keys(translations).forEach((key) => {

    const elements = document.querySelectorAll(`[data-translate-key="${key}"]`);

    if (elements.length > 0) {
      elements.forEach((element) => {
        element.textContent = translations[key];
      });
    }
  });
  console.log('Traduzioni applicate con successo!');
}

function updateDropdownText(langCode) {
  const dropdownText = langCode === 'it' ? 'Italiano' : langCode === 'kr' ? '한국어' : 'English';
  document.getElementById('selected-lang').textContent = dropdownText;

  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.classList.toggle('active', item.textContent.trim() === dropdownText);
  });
}

document.querySelectorAll('.dropdown-item').forEach((item) => {
  if (item) {
    item.addEventListener('click', async () => {
      const selectedLang = item.textContent.trim();
      const langCode = selectedLang === 'Italiano' ? 'it' : selectedLang === '한국어' ? 'kr' : 'en';
      await changeLanguage(langCode);
    });
  }
});

export async function getCookie() {
  console.log('Recupero lingua dal cookie...');
  
  try {
    const response = await fetch('/lang_cookie/');
    const data = await response.json();
    console.log('Lingua dal cookie:', data.language);
    changeLanguage(data.language);
  } catch (error) {
    console.error('Errore nel recupero del cookie:', error);
  }
}

