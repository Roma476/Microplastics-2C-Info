window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");

  // Imposta il minimo tempo di visualizzazione (2000ms)
  const minimumTime = 5000; // Tempo massimo di visualizzazione per il loader (5 secondi)
  const startTime = performance.timing.navigationStart;
  const currentTime = Date.now();
  const elapsed = currentTime - startTime;
  const remainingTime = Math.max(minimumTime - elapsed, 0);

  // Aggiungi un ritardo di almeno 2 secondi prima di rimuovere il loader
  setTimeout(() => {
    preloader.style.transition = "opacity 0.5s ease-out";  // Aggiungi una transizione
    preloader.style.opacity = "0";
    
    // Dopo che l'animazione è finita, rimuoviamo il loader
    setTimeout(() => {
      preloader.remove();
    }, 500); // Tempo che dura la transizione (500ms)
  }, remainingTime);
});
