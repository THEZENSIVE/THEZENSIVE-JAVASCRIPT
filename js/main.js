window.__appStarted = window.__appStarted || false;

document.addEventListener('DOMContentLoaded', () => {

  if (window.__appStarted) return;
  window.__appStarted = true;
  // ===== Cursor custom con delay =====
  const cursor = document.querySelector(".custom-cursor");
  if (cursor) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      cursorX += (mouseX - cursorX) * 0.3;
      cursorY += (mouseY - cursorY) * 0.3;
      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";
      requestAnimationFrame(animate);
    }

    animate();
  }

  // ===== Typing effect para sub-header =====
  const subHeader = document.querySelector('.sub-header-text p');
  if(subHeader){
    const subHeaderText = subHeader.textContent;
    subHeader.textContent = '';
    let i = 0;
    const typeSubHeader = () => {
      if (i < subHeaderText.length) {
        subHeader.textContent += subHeaderText.charAt(i);
        i++;
        setTimeout(typeSubHeader, 50);
      }
    };
    typeSubHeader();
  }

  // ===== Typing & erase effect para hero-text =====
  const leftHero = document.querySelector('.hero-text.left');
  const rightHero = document.querySelector('.hero-text.right');
  if(leftHero && rightHero){
    const textsLeft = ["REBEL BOND"];
    const textsRight = ["PROYECTO FINAL TFG"];
    let index = 0;

    const typeText = (el, text, speed = 75, callback) => {
      el.textContent = '';
      let i = 0;
      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else if(callback) callback();
      };
      type();
    };

    const eraseText = (el, speed = 150, callback) => {
      let text = el.textContent;
      let i = text.length;
      const erase = () => {
        if (i > 0) {
          el.textContent = text.substring(0, i - 1);
          i--;
          setTimeout(erase, speed);
        } else if(callback) callback();
      };
      erase();
    };

    const loopTyping = () => {
      typeText(leftHero, textsLeft[index], 75, () => {
        typeText(rightHero, textsRight[index], 75, () => {
          setTimeout(() => {
            eraseText(leftHero, 150, () => {
              eraseText(rightHero, 150, () => {
                index = (index + 1) % textsLeft.length;
                loopTyping();
              });
            });
          }, 2000);
        });
      });
    };

    loopTyping();
  }

  // ===== Animación highlight-block al scroll =====
  const highlightBlock = document.querySelector('.highlight-block');
  if(highlightBlock){
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.3 });
    observer.observe(highlightBlock);
  }

  // ===== Lightbox para galería =====
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const btnPrev = document.querySelector('#lightbox-overlay .scroll-btn.left');
  const btnNext = document.querySelector('#lightbox-overlay .scroll-btn.right');

  let currentIndex = 0;

  if(galleryItems.length && lightboxOverlay && lightboxImg){

    galleryItems.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentIndex = index;
        lightboxImg.src = img.src;
        lightboxOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    if(lightboxClose){
      lightboxClose.addEventListener('click', () => {
        lightboxOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      });
    }

    lightboxOverlay.addEventListener('click', e => {
      if(e.target === lightboxOverlay) {
        lightboxOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });

    if(btnPrev){
      btnPrev.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        lightboxImg.src = galleryItems[currentIndex].src;
      });
    }

    if(btnNext){
      btnNext.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        lightboxImg.src = galleryItems[currentIndex].src;
      });
    }
  }

});
