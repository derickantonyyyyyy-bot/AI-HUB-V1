
const aiPlatforms = {
    chatgpt: {
        name: "ChatGPT",
        url: "https://chatgpt.com/"
    },
    claude: {
        name: "Claude",
        url: "https://claude.ai/"
    },
    gemini: {
        name: "Gemini",
        url: "https://gemini.google.com/"
    }
};

// Restore the last-used AI.
function restoreWorkspace() {
    const lastUsed = localStorage.getItem("aiHubLastUsed");
    const display = document.getElementById("last-used");

    if (lastUsed && aiPlatforms[lastUsed]) {
        display.textContent =
            "Last opened: " + aiPlatforms[lastUsed].name;
    }
}

// Launch an AI platform.
function openAI(platform) {
    const ai = aiPlatforms[platform];

    if (!ai) {
        console.error("Unknown AI platform:", platform);
        return;
    }

    // Open the platform.
    const newTab = window.open(
        ai.url,
        "_blank",
        "noopener,noreferrer"
    );

    // Remember the selection.
    if (newTab) {
        localStorage.setItem("aiHubLastUsed", platform);

        document.getElementById("last-used").textContent =
            "Last opened: " + ai.name;
    }
}

// Initialize workspace.
document.addEventListener("DOMContentLoaded", restoreWorkspace);
