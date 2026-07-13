// Entrada principal
import { Jogo } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Canvas 'gameCanvas' não encontrado no documento.");
        return;
    }

    const getElement = (id, required = false) => {
        const element = document.getElementById(id);
        if (!element && required) {
            throw new Error(`Elemento DOM '${id}' não encontrado. Verifique se o ID existe em index.html.`);
        }
        if (!element) {
            console.warn(`Elemento DOM opcional '${id}' não encontrado.`);
        }
        return element;
    };

    const uiElements = {
        overlayMenu: getElement("menu-overlay", true),
        overlaySetup: getElement("setup-overlay", true),
        overlayPause: getElement("pause-overlay", true),
        overlayGameOver: getElement("gameover-overlay", true),

        btnStart: getElement("btn-start", true),
        btnEnterArena: getElement("btn-enter-arena", true),
        btnResume: getElement("btn-resume", true),
        btnRestart: getElement("btn-restart", true),
        btnRestartOver: getElement("btn-restart-over", true),
        btnMenu: getElement("btn-menu", true),
        btnMenuOver: getElement("btn-menu-over", true),

        textWinner: getElement("winner-text", true)
    };

    const jogo = new Jogo(canvas);
    jogo.iniciar(uiElements);

    const focusCanvas = () => canvas.focus();
    uiElements.btnStart.addEventListener("click", () => jogo.mostrarSetup());
    uiElements.btnEnterArena.addEventListener("click", () => jogo.entrarNaArena());
    uiElements.btnEnterArena.addEventListener("click", focusCanvas);
    uiElements.btnRestart.addEventListener("click", focusCanvas);
    uiElements.btnRestartOver.addEventListener("click", focusCanvas);
    uiElements.btnResume.addEventListener("click", focusCanvas);
    uiElements.btnMenu.addEventListener("click", focusCanvas);
    uiElements.btnMenuOver.addEventListener("click", focusCanvas);
});
