// Jogador: movimento, sprites e colisão
import { limiteJogavelXMin, limiteJogavelXMax, teclasJogador1, teclasJogador2 } from "./constants.js";

// Importar como módulo (em vez de caminho de string solto) é o que permite
// ao Vite localizar, otimizar e embutir essas imagens no build final.
import jaxDireita from "../assets/Jax_Direita.png";
import jaxEsquerda from "../assets/Jax_Esquerda.png";
import vaileDireita from "../assets/Vaile_Direita.png";
import vaileEsquerda from "../assets/Vaile_Esquerda.png";

const SPRITE_MAP = {
    jax: {
        esquerda: jaxEsquerda,
        direita: jaxDireita
    },
    vaile: {
        esquerda: vaileEsquerda,
        direita: vaileDireita
    }
};

export class Jogador {
    static sprites = {
        jax: { esquerda: null, direita: null },
        vaile: { esquerda: null, direita: null }
    };

    static preloadSprites() {
        if (!this.preloadPromise) {
            const promises = [];

            Object.entries(SPRITE_MAP).forEach(([personagem, direcoes]) => {
                Object.entries(direcoes).forEach(([lado, caminho]) => {
                    const imagem = new Image();
                    imagem.src = caminho;
                    this.sprites[personagem][lado] = imagem;

                    promises.push(new Promise((resolve) => {
                        imagem.onload = () => resolve();
                        imagem.onerror = () => resolve();
                    }));
                });
            });

            this.preloadPromise = Promise.all(promises);
        }

        return this.preloadPromise;
    }

    static getSprite(personagem, lado) {
        const sprite = this.sprites[personagem]?.[lado];
        return sprite && sprite.complete && sprite.naturalWidth ? sprite : null;
    }

    constructor(posicaoInicialX, cor, ehP1, characterType = "jax") {
        this.posicaoInicialX = posicaoInicialX;
        this.largura = 30;
        this.altura = 50;
        this.cor = cor;
        this.ehP1 = ehP1;
        this.velocidade = 5;
        this.forcaPulo = 10;
        this.characterType = characterType;
        this.facing = ehP1 ? "direita" : "esquerda";
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

        if (this.velX > 0) this.facing = "direita";
        else if (this.velX < 0) this.facing = "esquerda";

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
    desenhar(contexto, gravidadeInvertida = false) {
        const sprite = Jogador.getSprite(this.characterType, this.facing);
        const scale = 3.0;
        const drawWidth = this.largura * scale;
        const drawHeight = this.altura * scale;
        const offsetY = 30;

        contexto.save();
        contexto.shadowBlur = 10;
        contexto.shadowColor = this.cor;

        if (sprite) {
            contexto.save();

            if (gravidadeInvertida) {
                contexto.translate(this.posX + this.largura / 2, this.posY + this.altura / 2);
                contexto.scale(1, -1);
                const drawX = -drawWidth / 2;
                const drawY = -this.altura / 2 - (drawHeight - this.altura) + offsetY;
                contexto.drawImage(sprite, drawX, drawY, drawWidth, drawHeight);
            } else {
                const drawX = this.posX - (drawWidth - this.largura) / 2;
                const drawY = this.posY - (drawHeight - this.altura) + offsetY;
                contexto.drawImage(sprite, drawX, drawY, drawWidth, drawHeight);
            }

            contexto.restore();
        } else {
            contexto.fillStyle = this.cor;
            contexto.fillRect(this.posX, this.posY, this.largura, this.altura);

            contexto.strokeStyle = "#FFFFFF";
            contexto.lineWidth = 2;
            contexto.strokeRect(this.posX, this.posY, this.largura, this.altura);

            contexto.fillStyle = "#00FFFF";
            const visorHeight = 8;
            const visorY = this.posY + 10;
            if (this.ehP1) contexto.fillRect(this.posX + this.largura - 12, visorY, 10, visorHeight);
            else contexto.fillRect(this.posX + 2, visorY, 10, visorHeight);
        }

        contexto.shadowBlur = 0;
        contexto.restore();
    }
}
