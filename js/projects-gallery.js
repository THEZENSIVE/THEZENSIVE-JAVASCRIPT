/* =====================================================
   THE ZENSIVE — PROJECTS / VISTA GALLERY
   Las imágenes nacen al fondo, en el centro, y viajan
   hacia la pantalla. El recorrido no termina nunca:
   cada imagen vuelve al fondo al pasar la cámara.
   La rueda del ratón o el dedo aceleran o invierten
   el viaje. Clic en una imagen: abre su proyecto.
===================================================== */

(() => {

    const ITEMS = [
        { src:"../images/thumbs/publi.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.8 },
        { src:"../images/thumbs/hatke-exterior.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:1.5 },
        { src:"../images/thumbs/tarjeta-regalo-casa-burrata-extended.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:1.665 },
        { src:"../images/thumbs/joyas-extended.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:1.422 },
        { src:"../images/thumbs/tarjetas-hua.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.75 },
        { src:"../images/thumbs/lamesaestalista.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.8 },
        { src:"../images/thumbs/presentacion-graze.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.75 },
        { src:"../images/thumbs/gafitas.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.745 },
        { src:"../images/thumbs/segunda-parte.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.75 },
        { src:"../images/thumbs/perritos.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.75 },
        { src:"../images/thumbs/nocta-run-club-08.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.75 },
        { src:"../images/thumbs/cartel-portada.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.75 },
        { src:"../images/thumbs/ticket.webp", href:"proyecto-reto.html", name:"7 Marcas 7 Días", r:0.75 },
        { src:"../images/thumbs/stand-outdoor-toasted.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:1.5 },
        { src:"../images/thumbs/toasted-landing.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:1.777 },
        { src:"../images/thumbs/tarjeta-afiliados.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.8 },
        { src:"../images/thumbs/coffee-cup.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.801 },
        { src:"../images/thumbs/fachada-toasted-brunch.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.75 },
        { src:"../images/thumbs/menusito.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.75 },
        { src:"../images/thumbs/toasted-brunch-redes.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.75 },
        { src:"../images/thumbs/toasted-brunch-nueva1.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.75 },
        { src:"../images/thumbs/tostadita.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.75 },
        { src:"../images/thumbs/baguette.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:1.333 },
        { src:"../images/thumbs/horario-pancito.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.8 },
        { src:"../images/thumbs/bagel-salmon.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.8 },
        { src:"../images/thumbs/mornings-are-better.webp", href:"proyecto-toasted.html", name:"Toasted Brunch", r:0.75 },
        { src:"../images/thumbs/foto1-minigallery.webp", href:"proyecto-embosto.html", name:"Embosto Studio", r:1.332 },
        { src:"../images/thumbs/embosto-11.webp", href:"proyecto-embosto.html", name:"Embosto Studio", r:1.6 },
        { src:"../images/thumbs/foto3-minigallery.webp", href:"proyecto-embosto.html", name:"Embosto Studio", r:1.334 },
        { src:"../images/thumbs/foto2-minigallery.webp", href:"proyecto-embosto.html", name:"Embosto Studio", r:1.335 },
        { src:"../images/thumbs/embosto-05.webp", href:"proyecto-embosto.html", name:"Embosto Studio", r:0.8 },
        { src:"../images/thumbs/embosto-07.webp", href:"proyecto-embosto.html", name:"Embosto Studio", r:0.8 },
        { src:"../images/thumbs/post-vera-clinic.webp", href:"proyecto-vera-clinic.html", name:"Vera Clinic", r:0.8 }
    ];

    const body = document.body;
    const gallery = document.querySelector(".z-gallery");
    const stage = document.querySelector(".z-stage");
    const toggle = document.querySelector(".view-toggle");

    if (!gallery || !stage || !toggle) return;

    const buttons = [...toggle.querySelectorAll("button")];
    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* ---------------------------------------------
       CONFIGURACIÓN
    --------------------------------------------- */

    const DEPTH = 4200;        // profundidad total del túnel
    const FAR = -3400;         // punto más lejano
    const COPIES = 1;          // cuántas veces aparece cada imagen
    const BASE_SPEED = 2.4;    // velocidad de crucero (px por frame)


    /* ---------------------------------------------
       ALEATORIO CON SEMILLA (siempre igual)
    --------------------------------------------- */

    let seed = 7;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };


    /* ---------------------------------------------
       CREAR TARJETAS
    --------------------------------------------- */

    const cards = [];
    const total = ITEMS.length * COPIES;

    for (let c = 0; c < COPIES; c++) {

        ITEMS.forEach((item, i) => {

            const index = c * ITEMS.length + i;

            const a = document.createElement("a");
            a.className = "z-card";
            a.href = item.href;
            a.setAttribute("aria-label", "Ver proyecto " + item.name);

            const width = 120 + rand() * 70;
            a.style.width = width + "px";
            a.style.aspectRatio = String(item.r);

            const img = document.createElement("img");
            img.src = item.src;
            img.alt = "";
            img.loading = "lazy";
            img.decoding = "async";

            const label = document.createElement("span");
            label.className = "z-label";
            label.textContent = item.name;

            a.append(img, label);
            stage.appendChild(a);

            /* posición en pantalla, lejos del texto central */

            let x, y;

            do {
                x = (rand() * 2 - 1);
                y = (rand() * 2 - 1);
            } while (Math.abs(x) < 0.42 && Math.abs(y) < 0.4);

            cards.push({
                el:a,
                x,
                y,
                z0:(index / total) * DEPTH + rand() * 120
            });
        });
    }


    /* ---------------------------------------------
       MOVIMIENTO
    --------------------------------------------- */

    let travel = 0;
    let velocity = BASE_SPEED;
    let target = BASE_SPEED;
    let running = false;
    let mouseX = 0, mouseY = 0, tiltX = 0, tiltY = 0;

    function frame() {

        if (!running) return;

        target += (BASE_SPEED - target) * 0.04;
        velocity += (target - velocity) * 0.08;
        travel += reduceMotion ? 0 : velocity;

        tiltX += (mouseX - tiltX) * 0.05;
        tiltY += (mouseY - tiltY) * 0.05;

        const spreadX = window.innerWidth * 0.95;
        const spreadY = window.innerHeight * 0.85;
        const size = Math.max(0.62, Math.min(1, window.innerWidth / 1440));

        stage.style.transform =
            `rotateX(${tiltY * -3}deg) rotateY(${tiltX * 4}deg)`;

        for (const card of cards) {

            let z = ((card.z0 + travel) % DEPTH + DEPTH) % DEPTH + FAR;

            const fadeIn = Math.min(1, (z - FAR) / 1700);
            const fadeOut = Math.min(1, Math.max(0, (650 - z) / 450));

            card.el.style.opacity = (fadeIn * fadeOut).toFixed(3);
            card.el.style.transform =
                `translate(-50%, -50%) translate3d(${card.x * spreadX}px, ${card.y * spreadY}px, ${z}px) scale(${size})`;
            card.el.style.zIndex = Math.round(z + 4000);
            card.el.style.pointerEvents = fadeIn * fadeOut > 0.5 ? "auto" : "none";
        }

        requestAnimationFrame(frame);
    }

    function start() {
        if (running) return;
        running = true;
        requestAnimationFrame(frame);
    }

    function stop() {
        running = false;
    }


    /* ---------------------------------------------
       CONTROLES: RUEDA, TÁCTIL, RATÓN
    --------------------------------------------- */

    gallery.addEventListener("wheel", (e) => {
        e.preventDefault();
        target += (e.deltaY + e.deltaX) * 0.06;
        target = Math.max(-60, Math.min(60, target));
    }, { passive:false });

    let touchY = 0;

    gallery.addEventListener("touchstart", (e) => {
        touchY = e.touches[0].clientY;
    }, { passive:true });

    gallery.addEventListener("touchmove", (e) => {
        const y = e.touches[0].clientY;
        target += (touchY - y) * 0.35;
        target = Math.max(-60, Math.min(60, target));
        touchY = y;
    }, { passive:true });

    gallery.addEventListener("mousemove", (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
    }, { passive:true });


    /* ---------------------------------------------
       CAMBIO DE VISTA
    --------------------------------------------- */

    /* En móvil la vista gallery no existe: siempre lista */
    const mobile = window.matchMedia("(max-width: 882px)");

    function setView(view, updateUrl = true) {

        if (mobile.matches) view = "list";

        const isGallery = view === "gallery";

        toggle.dataset.view = view;
        body.classList.toggle("is-gallery", isGallery);
        gallery.hidden = false;
        gallery.setAttribute("aria-hidden", String(!isGallery));

        buttons.forEach((b) =>
            b.setAttribute("aria-pressed", String(b.dataset.view === view))
        );

        if (isGallery) {
            start();
        } else {
            setTimeout(() => {
                if (!body.classList.contains("is-gallery")) stop();
            }, 700);
            window.dispatchEvent(new Event("scroll"));
        }

        if (updateUrl) {
            history.replaceState(null, "", isGallery ? "#gallery" : location.pathname);
        }
    }

    buttons.forEach((b) =>
        b.addEventListener("click", () => setView(b.dataset.view))
    );

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && body.classList.contains("is-gallery")) {
            setView("list");
        }
    });

    mobile.addEventListener("change", () => {
        if (mobile.matches && body.classList.contains("is-gallery")) {
            setView("list");
        }
    });

    setView(location.hash === "#gallery" ? "gallery" : "list", false);

})();
