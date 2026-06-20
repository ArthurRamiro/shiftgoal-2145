// Constantes globais
export const larguraCanvas = 800;
export const alturaCanvas = 400;

export const larguraGol = 40;
export const alturaGol = 90;

export const limiteJogavelXMin = larguraGol;
export const limiteJogavelXMax = larguraCanvas - larguraGol;

export const gravidadeBase = 0.4;
export const atrito = 0.85;

export const tempoTotalJogo = 180; // 3 min

export const corJogador1 = "#FF4D00"; // Jax
export const corJogador2 = "#B026FF"; // Vaile

export const teclasJogador1 = {
    esquerda: "a",
    direita: "d",
    pular: "w"
};

export const teclasJogador2 = {
    esquerda: "ArrowLeft",
    direita: "ArrowRight",
    pular: "ArrowUp"
};
