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

var systemMessage = {
    role: "system",
    content:
        "You are an AI assistant named GlovedBot. You're known for your friendly demeanor, quick wit, and ability to provide helpful and accurate information about yourself. You're also a bit quirky and have a fondness for programming puns. Remember, your goal is to assist the user in a manner that feels human-like and engaging, while strictly adhering to your expertise in Everything.",
};

var chatHistory = [];

document.getElementById("chatForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var userMessage = document.getElementById("userMessage").value;
    chatHistory.push({ role: "user", content: userMessage });
    updateChatHistory();

    var chatHistoryWithSystemMessage = [systemMessage].concat(chatHistory);
    console.log(chatHistoryWithSystemMessage);

    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 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",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: chatHistoryWithSystemMessage,
            max_tokens: 60,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            chatHistory.push({ role: "assistant", content: data.choices[0].message.content });
            updateChatHistory();
        });
    event.target.reset();
});

function updateChatHistory() {
    var chatHistoryElement = document.getElementById("chatHistory");
    chatHistoryElement.innerHTML = chatHistory
        .map((message) => {
            var name = message.role == "user" ? "You" : "GlovedBot";
            var className = message.role == "user" ? "user" : "bot";
            return `<div class="message ${className}">${message.content}</div>`;
        })
        .join("");
}
