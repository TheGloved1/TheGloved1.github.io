/** @format */

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
        threshold: 0.1,
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
    { threshold: 0.7 }
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

document.getElementById("next-section-button-copy").addEventListener("click", function () {
    var sections = Array.from(document.getElementsByTagName("section"));
    var nextSection = sections[sections.indexOf(currentSection) + 1];
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
});

document.getElementById("previous-section-button").addEventListener("click", function () {
    var sections = Array.from(document.getElementsByTagName("section"));
    var nextSection = sections[sections.indexOf(currentSection) - 1];
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

var chatHistory = [];

document.getElementById("chatForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var userMessage = document.getElementById("userMessage").value;
    chatHistory.push({ role: "user", content: userMessage });
    updateChatHistory();

    // Add a temporary message to indicate that a response is being generated
    var dotCount = 0;
    var thinkingMessage = { role: "assistant", content: `\`Thinking${".".repeat(dotCount)}\`` };
    chatHistory.push(thinkingMessage);
    updateChatHistory();

    var thinkingInterval = setInterval(function () {
        dotCount = (dotCount + 1) % 4; // Reset after 3 dots
        thinkingMessage.content = "Thinking" + ".".repeat(dotCount);
        updateChatHistory();
    }, 200);

    fetch("https://glovedweb.ddns.net/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: chatHistory,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            clearInterval(thinkingInterval);
            chatHistory.pop();

            chatHistory.push({ role: "assistant", content: data.message });
            updateChatHistory();
        });
    event.target.reset();
});

function updateChatHistory() {
    var chatHistoryElement = document.getElementById("chatHistory");
    chatHistoryElement.innerHTML = chatHistory
        .map((message) => {
            var className = message.role == "user" ? "user" : "bot";
            return `<div class="message ${className}">${message.content}</div>`;
        })
        .join("");
}

console.clear();

// Select the circle element
const circleElement = document.querySelector(".circle");

// Create objects to track mouse position and custom cursor position
const mouse = { x: 0, y: 0 }; // Track current mouse position
const previousMouse = { x: 0, y: 0 }; // Store the previous mouse position
const circle = { x: 0, y: 0 }; // Track the circle position

// Initialize variables to track scaling and rotation
let currentScale = 0;
let currentAngle = 0;

// Update mouse position on the 'mousemove' event
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

const speed = 0.17;

// Start animation
const tick = () => {
    circle.x += (mouse.x - circle.x) * speed;
    circle.y += (mouse.y - circle.y) * speed;
    const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;
    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
    const scaleValue = (mouseVelocity / 150) * 0.5;
    currentScale += (scaleValue - currentScale) * speed;
    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

    const angle = (Math.atan2(deltaMouseY, deltaMouseX) * 180) / Math.PI;
    if (mouseVelocity > 20) {
        currentAngle = angle;
    }
    const rotateTransform = `rotate(${currentAngle}deg)`;

    circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

    window.requestAnimationFrame(tick);
};

tick();

var elements = document.querySelectorAll("body button, body a");
elements.forEach(function (element) {
    element.addEventListener("mouseover", function () {
        // Change the size of the circle when the mouse hovers over the element
        circleElement.classList.add("hidden");
    });
});

// Add a mouseout event listener to each element
elements.forEach(function (element) {
    element.addEventListener("mouseout", function () {
        // Change the size of the circle back when the mouse leaves the element
        circleElement.classList.remove("hidden");
    });
});
