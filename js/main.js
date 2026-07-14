// Entrada principal
import { Jogo } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Canvas 'gameCanvas' não encontrado no documento.");
        return;
    }

    const uiElements = {
        overlayMenu: document.getElementById("menu-overlay"),
        overlayPause: document.getElementById("pause-overlay"),
        overlayGameOver: document.getElementById("gameover-overlay"),

        btnStart: document.getElementById("btn-start"),
        btnResume: document.getElementById("btn-resume"),
        btnRestart: document.getElementById("btn-restart"),
        btnRestartOver: document.getElementById("btn-restart-over"),
        btnMenu: document.getElementById("btn-menu"),
        btnMenuOver: document.getElementById("btn-menu-over"),
        btnMute: document.getElementById("btn-mute"),

        textWinner: document.getElementById("winner-text")
    };

    const jogo = new Jogo(canvas);

    jogo.iniciar({
        ...uiElements,
        btnRestart: uiElements.btnRestart,
        btnMenu: uiElements.btnMenu
    });

    if (uiElements.btnRestartOver) uiElements.btnRestartOver.addEventListener("click", () => jogo.iniciarPartida());
    if (uiElements.btnMenuOver) uiElements.btnMenuOver.addEventListener("click", () => jogo.mostrarMenu());

    uiElements.btnStart?.addEventListener("click", () => canvas.focus());
    uiElements.btnRestart?.addEventListener("click", () => canvas.focus());
    uiElements.btnRestartOver?.addEventListener("click", () => canvas.focus());
    uiElements.btnResume?.addEventListener("click", () => canvas.focus());
});
