
// ==========================================
// AI HUB V3 — SUPABASE + AI LAUNCHER
// ==========================================

// 1. SUPABASE CONFIGURATION
const SUPABASE_URL = "https://cbwrniumjrbzdvwomlnq.supabase.co";

// Replace this placeholder with your sb_publishable_ key.
const SUPABASE_PUBLISHABLE_KEY = sb_publishable_ZlSgJ03SUD1-MQc7M8qU3g_dOiNUnHG;

// 2. CONNECT TO SUPABASE
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// ==========================================
// EXISTING AI PLATFORM LAUNCHER
// ==========================================

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

    if (lastUsed && aiPlatforms[lastUsed] && display) {
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

    const newTab = window.open(
        ai.url,
        "_blank",
        "noopener,noreferrer"
    );

    if (newTab) {
        localStorage.setItem("aiHubLastUsed", platform);

        const display = document.getElementById("last-used");

        if (display) {
            display.textContent = "Last opened: " + ai.name;
        }
    }
}

// ==========================================
// SUPABASE AUTHENTICATION
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    restoreWorkspace();

    const authForm = document.getElementById("auth-form");
    const emailInput = document.getElementById("auth-email");
    const passwordInput = document.getElementById("auth-password");
    const signupButton = document.getElementById("signup-button");
    const logoutButton = document.getElementById("logout-button");
    const message = document.getElementById("auth-message");

    function showMessage(text) {
        message.textContent = text;
    }

    function updateAuthUI(session) {
        authForm.hidden = !!session;
        logoutButton.hidden = !session;

        if (session && session.user) {
            showMessage("Signed in as " + session.user.email);
        } else {
            showMessage("Not signed in.");
        }
    }

    // Restore an existing login session.
    const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();

    if (sessionError) {
        showMessage(sessionError.message);
    } else {
        updateAuthUI(sessionData.session);
    }

    // Watch for login and logout changes.
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateAuthUI(session);
    });

    // SIGN IN
    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        showMessage("Signing in...");

        const { error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            showMessage("Login failed: " + error.message);
        } else {
            showMessage("Login successful!");
            passwordInput.value = "";
        }
    });

    // CREATE ACCOUNT
    signupButton.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Enter your email and password first.");
            return;
        }

        showMessage("Creating your account...");

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password
        });

        if (error) {
            showMessage("Signup failed: " + error.message);
        } else if (data.session) {
            showMessage("Account created and signed in!");
            passwordInput.value = "";
        } else {
            showMessage(
                "Account created! Check your email if confirmation is required."
            );
        }
    });

    // SIGN OUT
    logoutButton.addEventListener("click", async () => {
        showMessage("Signing out...");

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            showMessage("Logout failed: " + error.message);
        } else {
            showMessage("You have signed out.");
        }
    });

});
