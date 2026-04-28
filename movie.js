// AUTO CAROUSEL WITH INFINITE SCROLL AND HOVER PAUSE
(() => {
  
  
  const carousels = document.querySelectorAll(".auto-carousel");

  
  carousels.forEach((carousel) => {
    
    const track = carousel.querySelector(".carousel-track");
    if (!track) return; 

    
    const baseSlides = Array.from(track.children);
    if (baseSlides.length === 0) return; 
    
    
    
    baseSlides.forEach((slide) => {
      track.appendChild(slide.cloneNode(true));
    });

    
    
    const speed = Number(carousel.dataset.speed || 0.35); 
    const gap = 24; 
    let targetSpeed = speed; 
    let currentSpeed = speed; 
    const easing = 0.08; 

    
    function step() {
      
      currentSpeed += (targetSpeed - currentSpeed) * easing;
      
      
      if (Math.abs(currentSpeed) > 0.01) {
        track.scrollLeft += currentSpeed; 

        
        
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half; 
        }
      }

      
      window.requestAnimationFrame(step);
    }

    
    track.scrollLeft = 0; 
    window.requestAnimationFrame(step); 

    
    
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) {
      
      carousel.addEventListener("mouseenter", () => {
        targetSpeed = 0; 
      });

      
      carousel.addEventListener("mouseleave", () => {
        targetSpeed = speed; 
      });
    }

    
    const prevBtn = carousel.querySelector(".carousel-but.prev");
    const nextBtn = carousel.querySelector(".carousel-but.next");

    
    function getJumpAmount() {
      const firstSlide = track.firstElementChild;
      if (!firstSlide) return 900; 
      return firstSlide.getBoundingClientRect().width + gap; 
    }

    
    prevBtn?.addEventListener("click", () => {
      track.scrollBy({ left: -getJumpAmount(), behavior: "smooth" });
    });

    
    nextBtn?.addEventListener("click", () => {
      track.scrollBy({ left: getJumpAmount(), behavior: "smooth" });
    });
  });

  
  
  // VIDEO PLAY/PAUSE
  document.querySelectorAll("video[data-click-play]").forEach((video) => {
    
    const wrap = video.closest(".video-shell");
    
    const playBtn = wrap?.querySelector(".video-play-but");
    
    function hideCursorOnControls() {
      
      video.style.cursor = 'none';

      
      const allChildren = video.querySelectorAll('*');
      allChildren.forEach(el => {
        el.style.cursor = 'none';
      });

      
      document.body.style.cursor = 'none';
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { 
            node.style.cursor = 'none';
            
            const children = node.querySelectorAll('*');
            children.forEach(child => {
              child.style.cursor = 'none';
            });
          }
        });
      });
    });

    
    observer.observe(video, {
      childList: true,
      subtree: true
    });

    
    video.addEventListener('loadedmetadata', hideCursorOnControls);
    
    setInterval(hideCursorOnControls, 500);

    
    video.addEventListener('mousemove', (e) => {
      e.target.style.cursor = 'none';
      if (e.target !== video) {
        const allChildren = video.querySelectorAll('*');
        allChildren.forEach(el => {
          el.style.cursor = 'none';
        });
      }
    });

    
    video.addEventListener('mouseenter', () => {
      document.body.style.cursor = 'none';
      hideCursorOnControls();
    });

    
    hideCursorOnControls();

    
    
    function syncPlayButton() {
      if (!playBtn) return; 
      
      playBtn.style.opacity = video.paused ? "1" : "0";
      
      playBtn.style.pointerEvents = video.paused ? "auto" : "none";
    }

    
    playBtn?.addEventListener("click", () => {
      video.play(); 
    });

    
    video.addEventListener("click", () => {
      if (video.paused) {
        video.play(); 
      } else {
        video.pause(); 
      }
    });

    
    
    video.addEventListener("play", syncPlayButton);
    
    video.addEventListener("pause", syncPlayButton);
    
    video.addEventListener("ended", syncPlayButton);

    
    syncPlayButton();
  });
})(); 

