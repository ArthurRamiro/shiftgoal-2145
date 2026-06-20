// Jogador: movimento e desenho
import { limiteJogavelXMin, limiteJogavelXMax, teclasJogador1, teclasJogador2 } from "./constants.js";

export class Jogador {
    constructor(posicaoInicialX, cor, ehP1) {
        this.posicaoInicialX = posicaoInicialX;
        this.largura = 30;
        this.altura = 50;
        this.cor = cor;
        this.ehP1 = ehP1;
        this.velocidade = 5;
        this.forcaPulo = 10;

        this.mapaTeclas = ehP1 ? teclasJogador1 : teclasJogador2;

        this.posX = posicaoInicialX;
        this.posY = 0;
        this.velX = 0;
        this.velY = 0;
        this.estaNoChao = false;
    }

    // Reseta posição conforme gravidade
    resetar(gravidadeAtual, alturaCanvas) {
        this.posX = this.posicaoInicialX;
        this.posY = gravidadeAtual < 0 ? 50 : alturaCanvas - this.altura - 50;
        this.velX = 0;
        this.velY = 0;
        this.estaNoChao = false;
    }

    // Atualiza física e inputs
    atualizar(entrada, gravidadeAtual, alturaCanvas) {
        if (entrada.estaPressionada(this.mapaTeclas.esquerda)) this.velX = -this.velocidade;
        else if (entrada.estaPressionada(this.mapaTeclas.direita)) this.velX = this.velocidade;
        else this.velX = 0;

        if (entrada.estaPressionada(this.mapaTeclas.pular) && this.estaNoChao) {
            this.velY = gravidadeAtual > 0 ? -this.forcaPulo : this.forcaPulo;
            this.estaNoChao = false;
        }

        this.velY += gravidadeAtual;
        this.posX += this.velX;
        this.posY += this.velY;

        if (this.posX <= limiteJogavelXMin) this.posX = limiteJogavelXMin;
        if (this.posX + this.largura >= limiteJogavelXMax) this.posX = limiteJogavelXMax - this.largura;

        if (gravidadeAtual > 0) {
            if (this.posY + this.altura >= alturaCanvas) {
                this.posY = alturaCanvas - this.altura;
                this.velY = 0;
                this.estaNoChao = true;
            }
            if (this.posY <= 0) { this.posY = 0; this.velY = 0; }
        } else {
            if (this.posY <= 0) { this.posY = 0; this.velY = 0; this.estaNoChao = true; }
            if (this.posY + this.altura >= alturaCanvas) { this.posY = alturaCanvas - this.altura; this.velY = 0; }
        }
    }

    // Desenha o jogador
    desenhar(contexto) {
        contexto.save();
        contexto.shadowBlur = 10;
        contexto.shadowColor = this.cor;

        contexto.fillStyle = this.cor;
        contexto.fillRect(this.posX, this.posY, this.largura, this.altura);

        contexto.strokeStyle = "#FFFFFF";
        contexto.lineWidth = 2;
        contexto.strokeRect(this.posX, this.posY, this.largura, this.altura);

        contexto.shadowBlur = 0;

        contexto.fillStyle = "#00FFFF";
        const visorHeight = 8;
        const visorY = this.posY + 10;
        if (this.ehP1) contexto.fillRect(this.posX + this.largura - 12, visorY, 10, visorHeight);
        else contexto.fillRect(this.posX + 2, visorY, 10, visorHeight);

        contexto.restore();
    }
}
