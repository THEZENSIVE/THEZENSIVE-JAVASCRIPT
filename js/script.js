/* =====================================================
   GALERÍA HORIZONTAL — HOME
===================================================== */

const homeWrapper =
    document.querySelector(".home-gallery");

const homeTrack =
    document.querySelector(".home-gallery-track");


let currentX = 0;
let targetX = 0;
let maxX = 0;


/* =====================================================
   CALCULAR LÍMITE HORIZONTAL
===================================================== */

function calculateHomeLimit() {

    if (!homeTrack) return;

    maxX =
        homeTrack.scrollWidth -
        window.innerWidth;

    if (maxX < 0) {
        maxX = 0;
    }
}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    calculateHomeLimit
);

calculateHomeLimit();


/* =====================================================
   RUEDA → SCROLL HORIZONTAL
===================================================== */

window.addEventListener(
    "wheel",
    function(event) {

        if (!homeWrapper) return;


        const rect =
            homeWrapper.getBoundingClientRect();


        /*
            Solo actuamos cuando la galería
            está dentro del viewport.
        */

        if (
            rect.bottom <= 0 ||
            rect.top >= window.innerHeight
        ) {
            return;
        }


        /*
            Mantenemos EXACTAMENTE el sistema
            de la galería original.
        */

        targetX += event.deltaY;
        targetX += event.deltaX;


        /*
            Limitar desplazamiento
        */

        targetX =
            Math.max(
                0,
                Math.min(
                    targetX,
                    maxX
                )
            );

    },
    {
        passive: true
    }
);


/* =====================================================
   ANIMACIÓN SUAVE / INERCIA
===================================================== */

function animateHomeGallery() {

    currentX +=
        (targetX - currentX) *
        0.075;


    if(homeTrack&&Math.abs(targetX-currentX)>.05)homeTrack.style.transform=`translate3d(${-currentX}px,0,0)`;


    requestAnimationFrame(
        animateHomeGallery
    );
}

animateHomeGallery();


/* =====================================================
   TOUCH
===================================================== */

let touchStartX = 0;
let touchStartY = 0;


homeWrapper&&homeWrapper.addEventListener(
    "touchstart",
    function(event) {

        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;

    },
    {
        passive: true
    }
);


homeWrapper&&homeWrapper.addEventListener(
    "touchmove",
    function(event) {

        const currentTouchX =
            event.touches[0].clientX;

        const currentTouchY =
            event.touches[0].clientY;


        const deltaX =
            touchStartX -
            currentTouchX;

        const deltaY =
            touchStartY -
            currentTouchY;


        /*
            Igual que antes:
            solo convertimos el gesto vertical
            en desplazamiento horizontal.
        */

        if (
            Math.abs(deltaY) >
            Math.abs(deltaX)
        ) {

            targetX += deltaY;

        }


        targetX =
            Math.max(
                0,
                Math.min(
                    targetX,
                    maxX
                )
            );


        touchStartX =
            currentTouchX;

        touchStartY =
            currentTouchY;

    },
    {
        passive: true
    }
);