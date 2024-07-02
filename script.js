function startDictation() {
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;
  
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
  
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
  
        document.getElementById('original-text').textContent = "Розпізнаний текст: " + transcript;
  
        if (event.results[0].isFinal) {
          translateAndSpeak(transcript, selectedLanguage);
        }
      }; 
  
      recognition.start();
    } else {
      alert('Веб-розпізнавання мовлення не підтримується вашим браузером.');
    }
  }
  
  async function translateAndSpeak(text, sourceLanguage) {
    const targetLanguage = sourceLanguage === 'uk-UA' ? 'en' : 'uk';
  
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage.split('-')[0]}&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    const translation = data[0][0][0];
  
    document.getElementById('translated-text').textContent = "Переклад: " + translation;
  
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = targetLanguage === 'en' ? 'en-US' : 'uk-UA';
    synth.speak(utterance);
  }
  