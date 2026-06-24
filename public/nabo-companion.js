(function () {
  const COLORS = {
    darkNavy: "#0B1929",
    cyan: "#00C2CB",
    white: "#FFFFFF",
    mutedGray: "#94A3B8",
    cardBg: "#111D2E",
  };

  const BUBBLE_SIZE = 48;
  const PANEL_WIDTH = 360;
  const PANEL_HEIGHT = 520;

  let isOpen = false;
  let messageHistory = [];
  let inactivityTimer = null;
  const INACTIVITY_MS = 60000; // 1 minute

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      clearChat();
    }, INACTIVITY_MS);
  }

  function clearChat() {
    messageHistory = [];
    const messagesContainer = document.querySelector(".nabo-messages");
    if (messagesContainer) {
      messagesContainer.innerHTML = "";
      const messageDiv = document.createElement("div");
      messageDiv.className = "nabo-message assistant";
      const avatar = document.createElement("img");
      avatar.src = "https://nbbot.netlify.app/chatbot.png";
      avatar.className = "nabo-avatar";
      avatar.alt = "Nabo Companion";
      messageDiv.appendChild(avatar);
      const contentDiv = document.createElement("div");
      contentDiv.className = "nabo-message-content";
      contentDiv.innerHTML = "Hello, I'm your Nabo Capital Companion. How can I help you today?";
      messageDiv.appendChild(contentDiv);
      messagesContainer.appendChild(messageDiv);
      messageHistory.push({ role: "assistant", content: "Hello, I'm your Nabo Capital Companion. How can I help you today?" });
    }
  }

  // Clear chat when tab closes or user leaves
  window.addEventListener("beforeunload", () => {
    messageHistory = [];
  });

  function createStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .nabo-bubble {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: ${BUBBLE_SIZE}px;
        height: ${BUBBLE_SIZE}px;
        border-radius: 50%;
        background-color: ${COLORS.cyan};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999998;
        transition: transform 0.2s ease;
      }

      .nabo-bubble:hover {
        transform: scale(1.1);
      }

      .nabo-bubble svg {
        width: 24px;
        height: 24px;
      }

      .nabo-panel {
        position: fixed;
        bottom: ${BUBBLE_SIZE + 24 + 16}px;
        right: 24px;
        width: ${PANEL_WIDTH}px;
        height: ${PANEL_HEIGHT}px;
        background-color: ${COLORS.darkNavy};
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        display: none;
        flex-direction: column;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
        color: ${COLORS.white};
      }

      .nabo-panel.open {
        display: flex;
      }

      .nabo-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid ${COLORS.cardBg};
      }

      .nabo-panel-title {
        display: flex;
        flex-direction: column;
      }

      .nabo-panel-title-main {
        font-size: 16px;
        font-weight: 600;
        color: ${COLORS.white};
      }

      .nabo-panel-title-sub {
        font-size: 12px;
        color: ${COLORS.mutedGray};
        margin-top: 2px;
      }

      .nabo-close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${COLORS.mutedGray};
        transition: color 0.2s ease;
      }

      .nabo-close-btn:hover {
        color: ${COLORS.white};
      }

      .nabo-close-btn svg {
        width: 20px;
        height: 20px;
      }

      .nabo-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .nabo-messages::-webkit-scrollbar {
        width: 6px;
      }

      .nabo-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .nabo-messages::-webkit-scrollbar-thumb {
        background: ${COLORS.mutedGray};
        border-radius: 3px;
      }

      .nabo-message {
        display: flex;
        gap: 8px;
        animation: fadeIn 0.3s ease;
        align-items: flex-end;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.08);
        }
      }

      .nabo-message.user {
        justify-content: flex-end;
      }

      .nabo-message.assistant {
        justify-content: flex-start;
      }

      .nabo-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 8px;
        flex-shrink: 0;
      }

      .nabo-avatar.typing {
        animation: pulse 1.2s ease-in-out infinite;
      }

      .nabo-header-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 12px;
      }

      .nabo-message-content {
        max-width: 80%;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .nabo-message.user .nabo-message-content {
        background-color: ${COLORS.cyan};
        color: ${COLORS.darkNavy};
      }

      .nabo-message.assistant .nabo-message-content {
        background-color: ${COLORS.cardBg};
        color: ${COLORS.white};
      }

      .nabo-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px 12px;
      }

      .nabo-typing-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: ${COLORS.mutedGray};
        animation: typing 1.4s infinite;
      }

      .nabo-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .nabo-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% {
          opacity: 0.5;
        }
        30% {
          opacity: 1;
        }
      }

      .nabo-input-area {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid ${COLORS.cardBg};
      }

      .nabo-input {
        flex: 1;
        background-color: ${COLORS.cardBg};
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 10px 12px;
        color: ${COLORS.white};
        font-size: 14px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s ease;
      }

      .nabo-input::placeholder {
        color: ${COLORS.mutedGray};
      }

      .nabo-input:focus {
        border-color: ${COLORS.cyan};
      }

      .nabo-send-btn {
        background-color: ${COLORS.cyan};
        border: none;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s ease;
      }

      .nabo-send-btn:hover {
        opacity: 0.9;
      }

      .nabo-send-btn:active {
        opacity: 0.8;
      }

      .nabo-send-btn svg {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 480px) {
        .nabo-panel {
          width: 100%;
          right: 0;
          left: 0;
          bottom: 0;
          border-radius: 12px 12px 0 0;
          height: 60vh;
          max-height: 520px;
        }
      }

      .nabo-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        z-index: 999997;
      }

      .nabo-overlay.open {
        display: block;
      }

      .nabo-tooltip {
        position: fixed;
        bottom: ${BUBBLE_SIZE + 24 + 16 + 12}px;
        right: 24px;
        background-color: ${COLORS.darkNavy};
        color: ${COLORS.white};
        padding: 12px 12px 12px 12px;
        border-radius: 8px;
        border: 1px solid ${COLORS.cyan};
        font-size: 13px;
        max-width: 220px;
        z-index: 999998;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        animation: tooltipFadeIn 0.3s ease;
        word-wrap: break-word;
        line-height: 1.4;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
      }

      @keyframes tooltipFadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .nabo-tooltip-text {
        flex: 1;
      }

      .nabo-tooltip-close {
        background: none;
        border: none;
        color: ${COLORS.mutedGray};
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        line-height: 1;
        transition: color 0.2s ease;
        flex-shrink: 0;
      }

      .nabo-tooltip-close:hover {
        color: ${COLORS.white};
      }
    `;
    document.head.appendChild(style);
  }

  function chatBubbleIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
  }

  function closeIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
  }

  function arrowIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
  }

  function createBubble() {
    const bubble = document.createElement("button");
    bubble.className = "nabo-bubble";
    bubble.innerHTML = chatBubbleIcon();
    bubble.setAttribute("aria-label", "Open Nabo Companion chat");

    bubble.addEventListener("click", togglePanel);

    document.body.appendChild(bubble);
    return bubble;
  }

  function createPanel() {
    const overlay = document.createElement("div");
    overlay.className = "nabo-overlay";
    overlay.addEventListener("click", closePanel);

    const panel = document.createElement("div");
    panel.className = "nabo-panel";
    panel.innerHTML = `
      <div class="nabo-panel-header">
        <div style="display: flex; align-items: center;">
          <img src="https://nbbot.netlify.app/chatbot.png" class="nabo-header-avatar" alt="Nabo Companion">
          <div class="nabo-panel-title">
            <div class="nabo-panel-title-main">Nabo Companion</div>
            <div class="nabo-panel-title-sub">Nabo Capital</div>
          </div>
        </div>
        <button class="nabo-close-btn" aria-label="Close chat">
          ${closeIcon()}
        </button>
      </div>
      <div class="nabo-messages"></div>
      <div class="nabo-input-area">
        <input class="nabo-input" type="text" placeholder="Type your message..." />
        <button class="nabo-send-btn" aria-label="Send message">
          ${arrowIcon()}
        </button>
      </div>
    `;

    const closeBtn = panel.querySelector(".nabo-close-btn");
    closeBtn.addEventListener("click", closePanel);

    const sendBtn = panel.querySelector(".nabo-send-btn");
    const input = panel.querySelector(".nabo-input");

    const handleSend = () => {
      const message = input.value.trim();
      if (message) {
        addMessage("user", message);
        input.value = "";
        sendMessage(message);
      }
    };

    sendBtn.addEventListener("click", () => { resetInactivityTimer(); handleSend(); });
    input.addEventListener("keypress", (e) => {
      resetInactivityTimer();
      if (e.key === "Enter") {
        handleSend();
      }
    });

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    addMessage(
      "assistant",
      "Hello, I'm your Nabo Capital Companion. How can I help you today?"
    );

    return { panel, overlay, input };
  }

  function togglePanel() {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function openPanel() {
    const panel = document.querySelector(".nabo-panel");
    const overlay = document.querySelector(".nabo-overlay");

    if (panel && overlay) {
      isOpen = true;
      panel.classList.add("open");
      overlay.classList.add("open");

      const input = panel.querySelector(".nabo-input");
      setTimeout(() => input.focus(), 100);
    }
  }

  function closePanel() {
    const panel = document.querySelector(".nabo-panel");
    const overlay = document.querySelector(".nabo-overlay");

    if (panel && overlay) {
      isOpen = false;
      panel.classList.remove("open");
      overlay.classList.remove("open");
    }
  }

  function showGreetingTooltip() {
    if (sessionStorage.getItem('nabo_greeted')) return;
    sessionStorage.setItem('nabo_greeted', 'true');

    const tooltip = document.createElement("div");
    tooltip.className = "nabo-tooltip";

    const textDiv = document.createElement("div");
    textDiv.className = "nabo-tooltip-text";
    textDiv.textContent = "Hi, I'm your Nabo Capital Companion. How can I help you today?";

    const closeBtn = document.createElement("button");
    closeBtn.className = "nabo-tooltip-close";
    closeBtn.innerHTML = "&#x2715;";
    closeBtn.setAttribute("aria-label", "Dismiss greeting");

    tooltip.appendChild(textDiv);
    tooltip.appendChild(closeBtn);

    document.body.appendChild(tooltip);

    const dismiss = () => {
      tooltip.remove();
    };

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismiss();
    });

    tooltip.addEventListener("click", () => {
      dismiss();
      openPanel();
    });

    setTimeout(dismiss, 10000);
  }

  function formatMessage(text) {
    return text
      .split('\n')
      .map(line => {
        line = line.trim();
        if (!line) return '';
        if (/^\d+\./.test(line)) return `<div style="margin: 8px 0; padding-left: 4px;">${line}</div>`;
        return `<div style="margin: 4px 0;">${line}</div>`;
      })
      .join('');
  }

  function addMessage(role, content) {
    const messagesContainer = document.querySelector(".nabo-messages");
    if (!messagesContainer) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `nabo-message ${role}`;

    if (role === 'assistant') {
      const avatar = document.createElement("img");
      avatar.src = "https://nbbot.netlify.app/chatbot.png";
      avatar.className = "nabo-avatar";
      avatar.alt = "Nabo Companion";
      messageDiv.appendChild(avatar);
    }

    const contentDiv = document.createElement("div");
    contentDiv.className = "nabo-message-content";
    contentDiv.innerHTML = formatMessage(content);

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    messageHistory.push({ role, content });
  }

  function showTyping() {
    const messagesContainer = document.querySelector(".nabo-messages");
    if (!messagesContainer) return;

    const typingDiv = document.createElement("div");
    typingDiv.className = "nabo-message assistant";
    typingDiv.id = "typing-indicator";

    const avatar = document.createElement("img");
    avatar.src = "https://nbbot.netlify.app/chatbot.png";
    avatar.className = "nabo-avatar typing";
    avatar.alt = "Nabo Companion";
    typingDiv.appendChild(avatar);

    const typingContent = document.createElement("div");
    typingContent.className = "nabo-typing";
    typingContent.innerHTML =
      '<div class="nabo-typing-dot"></div><div class="nabo-typing-dot"></div><div class="nabo-typing-dot"></div>';

    typingDiv.appendChild(typingContent);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTyping() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async function sendMessage(userMessage) {
    showTyping();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messageHistory.map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      removeTyping();
      addMessage("assistant", data.response);
    } catch (error) {
      removeTyping();
      console.error("Chat error:", error);
      let countdown = 5;
      const errorMsg = { role: "assistant", content: `Sorry, I encountered an error. Chat will reset in ${countdown}s...` };
      messageHistory.push(errorMsg);
      const messagesContainer = document.querySelector(".nabo-messages");
      const errorDiv = document.createElement("div");
      errorDiv.className = "nabo-message assistant";
      const avatar = document.createElement("img");
      avatar.src = "https://nbbot.netlify.app/chatbot.png";
      avatar.className = "nabo-avatar";
      avatar.alt = "Nabo Companion";
      errorDiv.appendChild(avatar);
      const contentDiv = document.createElement("div");
      contentDiv.className = "nabo-message-content";
      contentDiv.innerHTML = `Sorry, I encountered an error. Chat will reset in ${countdown}s...`;
      errorDiv.appendChild(contentDiv);
      messagesContainer.appendChild(errorDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      const countdownInterval = setInterval(() => {
        countdown--;
        contentDiv.innerHTML = `Sorry, I encountered an error. Chat will reset in ${countdown}s...`;
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          clearChat();
        }
      }, 1000);
    }
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initWidget);
    } else {
      initWidget();
    }
  }

  function initWidget() {
    createStyles();
    createBubble();
    createPanel();
    setTimeout(showGreetingTooltip, 2000);
  }

  init();
})();
