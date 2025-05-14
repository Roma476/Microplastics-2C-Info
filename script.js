window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");

  const durationDesktop = 3000;
  const durationMobile = 5000;

  const startTime = performance.timing.navigationStart;
  const currentTime = Date.now();
  const elapsed = currentTime - startTime;

  let remainingTime;
  if (window.innerWidth <= 768) {
    remainingTime = Math.max(durationMobile - elapsed, 0);
  } else {
    remainingTime = Math.max(durationDesktop - elapsed, 0);
  }

  setTimeout(() => {
    preloader.style.opacity = 0;
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, remainingTime);

  // Navbar scroll 
  let lastScroll = 0;
  const nav = document.querySelector("nav");

  if (window.innerWidth > 768) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      const scrollThreshold = window.innerHeight * 0.9; 

      if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        nav.style.transform = "translateY(-200%)";
      } else if (currentScroll < lastScroll && currentScroll > scrollThreshold) {
        nav.style.transform = "translateY(0)";
      }

      lastScroll = currentScroll;
    });
  } else {
    nav.style.transform = "translateX(-50%)";
  }
});
