window.__appStarted = window.__appStarted || false;

document.addEventListener('DOMContentLoaded', () => {

  if (window.__appStarted) return;
  window.__appStarted = true;
// ===== Typing & erase effect para textos laterales del hero =====
const leftHero = document.querySelector('.hero-side-text-left');
const rightHero = document.querySelector('.hero-side-text-right');

if (leftHero && rightHero) {

  const textsLeft = ["IDEAS QUE PIDEN FORMA."];
  const textsRight = ["FORMAS QUE TIENEN ALGO QUE DECIR."];

  let index = 0;

  const typeText = (el, text, speed = 75, callback) => {
    el.textContent = '';

    let i = 0;

    const type = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    };

    type();
  };

  const eraseText = (el, speed = 150, callback) => {
    const text = el.textContent;
    let i = text.length;

    const erase = () => {
      if (i > 0) {
        el.textContent = text.substring(0, i - 1);
        i--;
        setTimeout(erase, speed);
      } else if (callback) {
        callback();
      }
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

});
