// Bola: física e render
import { limiteJogavelXMin, limiteJogavelXMax, alturaGol, atrito } from "./constants.js";

export class Bola {
    constructor() {
        this.raio = 15;
        this.posX = 0;
        this.posY = 0;
        this.velX = 0;
        this.velY = 0;
        this.angulo = 0;
    }

    // Centraliza a bola
    resetar(larguraCanvas, alturaCanvas) {
        this.posX = larguraCanvas / 2;
        this.posY = alturaCanvas / 2;
        this.velX = 0;
        this.velY = 0;
    }

    // Atualiza física; retorna "P1"/"P2" em gol
    atualizar(gravidadeAtual, larguraCanvas, alturaCanvas) {
        const invertida = gravidadeAtual < 0;
        const gravityFactor = invertida ? 1.25 : 1;
        const horizontalDrag = invertida ? 0.92 : atrito;
        const restitucao = invertida ? -0.8 : -0.7;

        this.velY += gravidadeAtual * gravityFactor;
        this.velX *= horizontalDrag;
        this.posX += this.velX;
        this.posY += this.velY;

        this.angulo += this.velX * 0.065;

        if (this.posY + this.raio >= alturaCanvas) {
            this.posY = alturaCanvas - this.raio;
            this.velY *= restitucao;
        }
        if (this.posY - this.raio <= 0) {
            this.posY = this.raio;
            this.velY *= restitucao;
        }

        const yTravessao = invertida ? alturaGol : alturaCanvas - alturaGol;

        // Gol/parede esquerda
        if (this.posX - this.raio <= limiteJogavelXMin) {
            const bateParede = invertida ? (this.posY + this.raio > yTravessao) : (this.posY - this.raio < yTravessao);

            if (bateParede) {
                this.posX = limiteJogavelXMin + this.raio;
                this.velX *= restitucao;
            } else {
                if (invertida && this.posY + this.raio > yTravessao) {
                    this.posY = yTravessao - this.raio;
                    this.velY *= restitucao;
                } else if (!invertida && this.posY - this.raio < yTravessao) {
                    this.posY = yTravessao + this.raio;
                    this.velY *= restitucao;
                }

                if (this.posX - this.raio <= 5 || Math.abs(this.velX) < 0.5) {
                    return "P2";
                }
            }
        }

        // Gol/parede direita
        if (this.posX + this.raio >= limiteJogavelXMax) {
            const bateParede = invertida ? (this.posY + this.raio > yTravessao) : (this.posY - this.raio < yTravessao);

            if (bateParede) {
                this.posX = limiteJogavelXMax - this.raio;
                this.velX *= restitucao;
            } else {
                if (invertida && this.posY + this.raio > yTravessao) {
                    this.posY = yTravessao - this.raio;
                    this.velY *= restitucao;
                } else if (!invertida && this.posY - this.raio < yTravessao) {
                    this.posY = yTravessao + this.raio;
                    this.velY *= restitucao;
                }

                if (this.posX + this.raio >= larguraCanvas - 5 || Math.abs(this.velX) < 0.5) {
                    return "P1";
                }
            }
        }

        return null;
    }

    // Desenha a bola
    desenhar(contexto) {
        contexto.save();

        contexto.shadowBlur = 15;
        contexto.shadowColor = "#00F5FF";

        contexto.beginPath();
        contexto.arc(this.posX, this.posY, this.raio, 0, Math.PI * 2);
        contexto.fillStyle = "#FFFFFF";
        contexto.fill();

        contexto.strokeStyle = "#00F5FF";
        contexto.lineWidth = 3;
        contexto.stroke();
        contexto.closePath();

        contexto.shadowBlur = 0;

        contexto.translate(this.posX, this.posY);
        contexto.rotate(this.angulo);

        contexto.strokeStyle = "rgba(0, 245, 255, 0.6)";
        contexto.lineWidth = 1.5;

        contexto.beginPath();
        contexto.moveTo(-this.raio + 4, 0);
        contexto.lineTo(this.raio - 4, 0);
        contexto.moveTo(0, -this.raio + 4);
        contexto.lineTo(0, this.raio - 4);
        contexto.stroke();

        contexto.beginPath();
        contexto.arc(0, 0, this.raio * 0.4, 0, Math.PI * 2);
        contexto.stroke();

        contexto.restore();
    }
}
