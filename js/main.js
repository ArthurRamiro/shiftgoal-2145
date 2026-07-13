// Entrada principal
import { Jogo } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.error("Canvas 'gameCanvas' não encontrado no documento.");
        return;
    }

    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Elemento DOM '${id}' não encontrado. Verifique se o ID existe em index.html.`);
        }
        return element;
    };

    const uiElements = {
        overlayMenu: getElement("menu-overlay"),
        overlaySetup: getElement("setup-overlay"),
        overlayPause: getElement("pause-overlay"),
        overlayGameOver: getElement("gameover-overlay"),

        btnStart: getElement("btn-start"),
        btnEnterArena: getElement("btn-enter-arena"),
        btnResume: getElement("btn-resume"),
        btnRestart: getElement("btn-restart"),
        btnRestartOver: getElement("btn-restart-over"),
        btnMenu: getElement("btn-menu"),
        btnMenuOver: getElement("btn-menu-over"),

        textWinner: getElement("winner-text")
    };

    const jogo = new Jogo(canvas);
    jogo.iniciar(uiElements);

    const focusCanvas = () => canvas.focus();
    uiElements.btnEnterArena.addEventListener("click", focusCanvas);
    uiElements.btnRestart.addEventListener("click", focusCanvas);
    uiElements.btnRestartOver.addEventListener("click", focusCanvas);
    uiElements.btnResume.addEventListener("click", focusCanvas);
    uiElements.btnMenu.addEventListener("click", focusCanvas);
    uiElements.btnMenuOver.addEventListener("click", focusCanvas);
});
