
const aiPlatforms = {
    chatgpt: "https://chatgpt.com/",
    claude: "https://claude.ai/",
    gemini: "https://gemini.google.com/"
};

function openAI(platform) {
    const url = aiPlatforms[platform];

    if (!url) {
        console.error("Unknown AI platform:", platform);
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
}
