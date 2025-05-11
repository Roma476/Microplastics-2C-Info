window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");

  const durationDesktop = 3000; 
  const durationMobile = 5000; 

  const startTime = performance.timing.navigationStart;
  const currentTime = Date.now();
  const elapsed = currentTime - startTime;

  let remainingTime;
  if (window.innerWidth <= 768) { // Mobile
    remainingTime = Math.max(durationMobile - elapsed, 0);
  } else { // Desktop
    remainingTime = Math.max(durationDesktop - elapsed, 0);
  }

  setTimeout(() => {
    preloader.style.opacity = 0; 
    setTimeout(() => {
      preloader.style.display = "none"; ì
    }, 500); ì
  }, remainingTime); 
});
