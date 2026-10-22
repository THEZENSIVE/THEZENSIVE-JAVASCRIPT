/* =====================================================
   THE ZENSIVE — PROJECTS
===================================================== */

const projectsSection = document.querySelector(".projects-scroll");
const projects = document.querySelectorAll(".project");


/* =====================================================
   UPDATE PROJECTS
===================================================== */

function updateProjects() {

    if (!projectsSection || projects.length < 2) {
        return;
    }


    /* ---------------------------------------------
       SECTION POSITION
    --------------------------------------------- */

    const sectionRect =
        projectsSection.getBoundingClientRect();


    /* ---------------------------------------------
       TOTAL SCROLL DISTANCE
    --------------------------------------------- */

    const scrollDistance =
        projectsSection.offsetHeight -
        window.innerHeight;


    /* ---------------------------------------------
       SCROLL PROGRESS
    --------------------------------------------- */

    let progress =
        -sectionRect.top /
        scrollDistance;

    progress =
        Math.max(
            0,
            Math.min(progress, 1)
        );


    /* ---------------------------------------------
       PROJECT TRANSITIONS
    --------------------------------------------- */

    const totalTransitions =
        projects.length - 1;

    const currentProgress =
        progress *
        totalTransitions;


    /* ---------------------------------------------
       MOVE PROJECTS
    --------------------------------------------- */

    projects.forEach((project, index) => {

        /*
         * El último proyecto permanece siempre
         * debajo de los anteriores.
         */

        if (index === projects.length - 1) {

            project.style.transform =
                "translate3d(0, 0, 0)";

            return;
        }


        /*
         * Progreso de la transición
         * correspondiente a este proyecto.
         */

        const localProgress =
            currentProgress - index;


        /*
         * Todavía no ha empezado a salir.
         */

        if (localProgress <= 0) {

            project.style.transform =
                "translate3d(0, 0, 0)";

        }


        /*
         * Ya ha salido completamente
         * por la izquierda.
         */

        else if (localProgress >= 1) {

            project.style.transform =
                "translate3d(-100%, 0, 0)";

        }


        /*
         * Está actualmente saliendo.
         */

        else {

            const translateX =
                localProgress * -100;

            project.style.transform =
                `translate3d(${translateX}%, 0, 0)`;
        }

    });
}


/* =====================================================
   EVENTS
===================================================== */

window.addEventListener(
    "scroll",
    updateProjects,
    { passive:true }
);

window.addEventListener(
    "resize",
    updateProjects
);


/* =====================================================
   INITIALIZE
===================================================== */

updateProjects();