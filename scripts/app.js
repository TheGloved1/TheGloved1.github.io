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
    var thinkingMessage = { role: "assistant", content: "." };
    chatHistory.push(thinkingMessage);
    updateChatHistory();

    var thinkingInterval = setInterval(function () {
        if (thinkingMessage.content.length < 5) {
            thinkingMessage.content += " .";
        } else {
            thinkingMessage.content = ".";
        }
        updateChatHistory();
    }, 500);

    fetch("http://207.199.235.110:3000/message", {
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
