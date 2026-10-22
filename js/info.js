/* =====================================================
   THE ZENSIVE — INFO
   Lista fija de "Lo que hago": la sección se queda
   anclada y la lista avanza con el scroll.
===================================================== */

(() => {

    const section = document.querySelector(".info-services");
    if (!section) return;

    const list = section.querySelector(".services-list");
    const items = [...list.children];
    const descs = [...section.querySelectorAll(".services-desc p")];
    const frames = [...section.querySelectorAll(".services-frames figure")];
    const caption = section.querySelector(".services-caption em");

    const captions = [
        "Sedici",
        "Hättke",
        "Toasted Brunch",
        "Toasted Brunch",
        "Casa Burrata",
        "Vera Clinic"
    ];

    const total = items.length;
    let current = -1;
    let ticking = false;

    function setActive(index) {

        if (index === current) return;
        current = index;

        [items, descs, frames].forEach((group) => {
            group.forEach((el, i) => el.classList.toggle("is-active", i === index));
        });

        if (caption) caption.textContent = captions[index] || "";
    }

    function update() {

        ticking = false;

        const rect = section.getBoundingClientRect();
        const distance = section.offsetHeight - window.innerHeight;

        let progress = -rect.top / distance;
        progress = Math.max(0, Math.min(1, progress));

        const position = progress * (total - 1);
        const itemHeight = items[0].offsetHeight;

        list.style.transform =
            `translateY(${-(position + 0.5) * itemHeight}px)`;

        setActive(Math.round(position));
    }

    function request() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener("scroll", request, { passive:true });
    window.addEventListener("resize", request);

    update();

})();
