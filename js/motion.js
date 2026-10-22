/* =====================================================
   THE ZENSIVE — MOTION
   · Cursor personalizado
   · Texto: opacidad por palabra ligada al scroll
   · Imágenes con parallax
===================================================== */

(() => {

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* =====================================================
       CURSOR
    ===================================================== */

    const cursor = document.querySelector(".custom-cursor");

    if (cursor && window.matchMedia("(pointer: fine)").matches) {

        // oculta la flecha del sistema solo cuando el cursor propio está activo
        document.documentElement.classList.add("has-custom-cursor");

        let mouseX = 0, mouseY = 0, x = 0, y = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.classList.add("is-on");
            cursor.classList.toggle("is-link", !!e.target.closest("a, button"));
        }, { passive:true });

        document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));

        (function follow() {
            x += (mouseX - x) * 0.25;
            y += (mouseY - y) * 0.25;
            cursor.style.left = x + "px";
            cursor.style.top = y + "px";
            requestAnimationFrame(follow);
        })();
    }


    /* =====================================================
       TEXTO — OPACIDAD CON SCROLL
       Cada palabra se envuelve en un <span class="w">.
       El texto no se mueve ni se reescribe: solo cambia
       su opacidad entre MIN y 1 según la posición.
    ===================================================== */

    const MIN = 0.22;     // opacidad de lo que aún no se ha revelado
    const SOFT = 4;       // nº de palabras en la transición

    const textSelectors = [
        ".hero-title",
        ".highlight-text .title",
        ".highlight-text .subtitle",
        ".highlight-text .description",
        ".home-gallery-header h2",
        ".home-gallery-description p",
        ".creativity-text p",
        ".creativity-caption",
        ".project-hero-intro p",
        ".project-text p",
        ".brand-index .bi-desc",
        "[data-rv]"
    ].join(",");

    function splitWords(el) {

        const walker =
            document.createTreeWalker(el, NodeFilter.SHOW_TEXT);

        const nodes = [];

        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        const words = [];

        nodes.forEach((node) => {

            const parts = node.nodeValue.split(/(\s+)/);
            const frag = document.createDocumentFragment();

            parts.forEach((part) => {

                if (!part) return;

                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                    return;
                }

                const span = document.createElement("span");
                span.className = "w";
                span.textContent = part;
                frag.appendChild(span);
                words.push(span);
            });

            node.replaceWith(frag);
        });

        return words;
    }

    const textItems = [];

    document.querySelectorAll(textSelectors).forEach((el) => {

        if (el.closest(".rv")) return;      // evita duplicar

        el.classList.add("rv");

        const host = el.closest(".project-text");
        if (host) host.classList.add("rv-host");

        const words = splitWords(el);

        if (words.length) {
            textItems.push({ el, words, last:-1 });
        }
    });

    function updateText() {

        const vh = window.innerHeight;

        const atBottom =
            window.scrollY + vh >=
            document.documentElement.scrollHeight - 2;

        textItems.forEach((item) => {

            const rect = item.el.getBoundingClientRect();

            if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) return;

            const start = vh * 0.92;
            const end = vh * 0.5;

            let p =
                (start - rect.top) /
                (start - end + rect.height * 0.6);

            p = Math.max(0, Math.min(1, p));

            if (atBottom && rect.top < vh) p = 1;
            if (reduceMotion) p = 1;

            const key = Math.round(p * 400);
            if (key === item.last) return;
            item.last = key;

            const n = item.words.length;
            const head = p * (n + SOFT);

            item.words.forEach((w, i) => {
                const t = Math.max(0, Math.min(1, (head - i) / SOFT));
                w.style.opacity = (MIN + (1 - MIN) * t).toFixed(3);
            });
        });
    }


    /* =====================================================
       PARALLAX DE IMÁGENES
       (no se aplica a la galería final del proyecto:
       allí las imágenes se ven completas)
    ===================================================== */

    const parallaxImages = [
        ...document.querySelectorAll(
            ".project-hero-image img, " +
            ".project-media img, " +
            ".hero-image img, " +
            ".highlight-image img, " +
            ".creativity-image img, " +
            "[data-parallax-img]"
        )
    ].filter((img) => !img.closest(".gallery-project-grid"));

    parallaxImages.forEach((img) => img.setAttribute("data-parallax", ""));

    function updateParallax() {

        if (reduceMotion) return;

        const vh = window.innerHeight;

        parallaxImages.forEach((img) => {

            const box = img.parentElement.getBoundingClientRect();

            if (box.bottom < -100 || box.top > vh + 100) return;

            const center = box.top + box.height / 2;
            const offset = (center - vh / 2) / vh;      // -1 … 1
            const move = -offset * box.height * 0.07;

            img.style.translate = `0 ${move.toFixed(1)}px`;
        });
    }


    /* =====================================================
       LOOP
    ===================================================== */

    let ticking = false;

    function update() {
        ticking = false;
        updateText();
        updateParallax();
    }

    function request() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener("scroll", request, { passive:true });
    window.addEventListener("resize", request);
    window.addEventListener("load", request);

    window.ZensiveMotion = { update: request };

    update();

})();
