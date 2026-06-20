// Campo: desenha fundo, paredes e gols
import { larguraGol, alturaGol } from "./constants.js";

export class Campo {
    constructor(largura, altura) {
        this.largura = largura;
        this.altura = altura;
    }

    // Desenha o fundo com grid
    desenharFundo(contexto) {
        contexto.save();
        
        contexto.fillStyle = "#0A0A14";
        contexto.fillRect(0, 0, this.largura, this.altura);

        contexto.strokeStyle = "rgba(0, 245, 255, 0.05)";
        contexto.lineWidth = 1;
        const gridSize = 40;

        for (let x = 0; x < this.largura; x += gridSize) {
            contexto.beginPath();
            contexto.moveTo(x, 0);
            contexto.lineTo(x, this.altura);
            contexto.stroke();
        }

        for (let y = 0; y < this.altura; y += gridSize) {
            contexto.beginPath();
            contexto.moveTo(0, y);
            contexto.lineTo(this.largura, y);
            contexto.stroke();
        }

        contexto.strokeStyle = "rgba(0, 245, 255, 0.15)";
        contexto.lineWidth = 2;
        contexto.beginPath();
        contexto.moveTo(this.largura / 2, 0);
        contexto.lineTo(this.largura / 2, this.altura);
        contexto.stroke();

        contexto.beginPath();
        contexto.arc(this.largura / 2, this.altura / 2, 60, 0, Math.PI * 2);
        contexto.stroke();

        contexto.restore();
    }

    // Desenha padrão de rede dentro do gol
    desenharPadraoRede(contexto, x, y, w, h, ehEsquerdo, gravidadeInvertida) {
        contexto.save();
        
        // fundo da rede
        contexto.fillStyle = "rgba(0, 245, 255, 0.06)";
        contexto.fillRect(x, y, w, h);

        // malha da rede
        contexto.strokeStyle = "rgba(255, 255, 255, 0.15)";
        contexto.lineWidth = 1;
        const passo = 8;

        for (let i = 0; i <= w; i += passo) {
            contexto.beginPath();
            contexto.moveTo(x + i, y);
            contexto.lineTo(x + i, y + h);
            contexto.stroke();
        }

        for (let j = 0; j <= h; j += passo) {
            contexto.beginPath();
            contexto.moveTo(x, y + j);
            contexto.lineTo(x + w, y + j);
            contexto.stroke();
        }

        // contorno neon
        contexto.strokeStyle = "rgba(0, 245, 255, 0.5)";
        contexto.lineWidth = 2;
        contexto.shadowBlur = 5;
        contexto.shadowColor = "#00F5FF";
        
        contexto.beginPath();
        if (ehEsquerdo) {
            // gol esquerdo
            contexto.moveTo(x + w, y);       
            contexto.lineTo(x, y);           
            contexto.lineTo(x, y + h);       
            contexto.lineTo(x + w, y + h);   
        } else {
            // gol direito
            contexto.moveTo(x, y);           
            contexto.lineTo(x + w, y);       
            contexto.lineTo(x + w, y + h);   
            contexto.lineTo(x, y + h);       
        }
        contexto.stroke();

        contexto.restore();
    }

    // Desenha paredes e traves, adaptando para gravidade invertida
    desenharEstruturas(contexto, gravidadeInvertida) {
        let topoParedeY, alturaParede, topoGolY, alturaTravessaoY;

        if (gravidadeInvertida) {
            topoParedeY = alturaGol;
            alturaParede = this.altura - alturaGol;
            topoGolY = 0;
            alturaTravessaoY = alturaGol;
        } else {
            topoParedeY = 0;
            alturaParede = this.altura - alturaGol;
            topoGolY = this.altura - alturaGol;
            alturaTravessaoY = this.altura - alturaGol;
        }

        contexto.save();

        // paredes laterais
        contexto.fillStyle = "#161622";
        contexto.fillRect(0, topoParedeY, larguraGol, alturaParede);
        contexto.fillRect(this.largura - larguraGol, topoParedeY, larguraGol, alturaParede);

        // bordas neon
        contexto.strokeStyle = "#00F5FF";
        contexto.lineWidth = 3;
        contexto.shadowBlur = 8;
        contexto.shadowColor = "#00F5FF";
        contexto.strokeRect(0, topoParedeY, larguraGol, alturaParede);
        contexto.strokeRect(this.largura - larguraGol, topoParedeY, larguraGol, alturaParede);
        contexto.shadowBlur = 0;

        // rede nos gols
        this.desenharPadraoRede(contexto, 0, topoGolY, larguraGol, alturaGol, true, gravidadeInvertida);
        this.desenharPadraoRede(contexto, this.largura - larguraGol, topoGolY, larguraGol, alturaGol, false, gravidadeInvertida);

        // traves e postes
        contexto.fillStyle = "#FFFFFF";

        // Travessões Horizontais
        if (gravidadeInvertida) {
            contexto.fillRect(0, alturaTravessaoY - 5, larguraGol, 5);
            contexto.fillRect(this.largura - larguraGol, alturaTravessaoY - 5, larguraGol, 5);
        } else {
            contexto.fillRect(0, alturaTravessaoY, larguraGol, 5);
            contexto.fillRect(this.largura - larguraGol, alturaTravessaoY, larguraGol, 5);
        }

        // Postes Verticais de Fundo
        contexto.fillRect(0, topoGolY, 5, alturaGol);
        contexto.fillRect(this.largura - 5, topoGolY, 5, alturaGol);

        // Postes Verticais da Frente
        contexto.fillRect(larguraGol - 5, topoGolY, 5, alturaGol);
        contexto.fillRect(this.largura - larguraGol, topoGolY, 5, alturaGol);

        contexto.restore();
    }
}