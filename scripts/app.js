let currentSection = null;

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            console.log(entry);
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    },
    {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
    }
);

const hiddenElements = document.querySelectorAll(".hidden");

hiddenElements.forEach((element) => {
    observer.observe(element);
});

let sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                currentSection = entry.target;
            }
        });
    },
    { threshold: 0.5 }
);

document.querySelectorAll("section").forEach((section) => {
    sectionObserver.observe(section);
});

document.getElementById("next-section-button").addEventListener("click", function () {
    var sections = Array.from(document.getElementsByTagName("section"));
    var nextSection = sections[sections.indexOf(currentSection) + 1];
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
});
