// Motor de jogo
import { Campo } from "./arena.js";
import { ManipuladorEntrada } from "./input.js";
import { Jogador } from "./player.js";
import { Bola } from "./ball.js";
import { larguraCanvas, alturaCanvas, gravidadeBase, tempoTotalJogo, corJogador1, corJogador2 } from "./constants.js";

export class Jogo {
    // Inicializa subsistemas e estado
    constructor(canvasElemento) {
        this.canvasElemento = canvasElemento;
        this.contexto = this.canvasElemento.getContext("2d");
        this.canvasElemento.width = larguraCanvas;
        this.canvasElemento.height = alturaCanvas;

        this.campo = new Campo(larguraCanvas, alturaCanvas);
        this.entrada = new ManipuladorEntrada();
        this.jogador1 = new Jogador(150, corJogador1, true);
        this.jogador2 = new Jogador(620, corJogador2, false);
        this.bola = new Bola();

        this.placarP1 = 0;
        this.placarP2 = 0;
        this.tempoRestante = tempoTotalJogo;
        this.gravidadeAtual = gravidadeBase;
        this.gravidadeInvertida = false;

        this.eventosGravidade = [];
        this.ultimoTick = 0;
        this.estado = 'MENU';

        // Tecla de pausa
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" || e.key === "p" || e.key === "P") this.alternarPausa();
        });
    }

    // Inicializa a UI e inicia o loop
    iniciar(uiElements) {
        this.ui = uiElements;

        if (this.ui.btnStart) this.ui.btnStart.addEventListener("click", () => this.mostrarSetup());
        if (this.ui.btnEnterArena) this.ui.btnEnterArena.addEventListener("click", () => this.entrarNaArena());
        if (this.ui.btnResume) this.ui.btnResume.addEventListener("click", () => this.retomarJogo());
        if (this.ui.btnRestart) this.ui.btnRestart.addEventListener("click", () => this.iniciarPartida());
        if (this.ui.btnRestartOver) this.ui.btnRestartOver.addEventListener("click", () => this.iniciarPartida());
        if (this.ui.btnMenu) this.ui.btnMenu.addEventListener("click", () => this.mostrarMenu());
        if (this.ui.btnMenuOver) this.ui.btnMenuOver.addEventListener("click", () => this.mostrarMenu());

        this.atualizarUI();
        this.ultimoTick = Date.now();
        this.loopPrincipal();
    }

    // Começa nova partida
    iniciarPartida() {
        this.placarP1 = 0;
        this.placarP2 = 0;
        this.tempoRestante = tempoTotalJogo;
        this.gravidadeAtual = gravidadeBase;
        this.gravidadeInvertida = false;
        this.estado = 'PLAYING';

        const inicio1 = Math.floor(Math.random() * 60) + 100;
        const inicio2 = Math.floor(Math.random() * 60) + 20;

        this.eventosGravidade = [
            { start: inicio1, end: inicio1 - 18 },
            { start: inicio2, end: inicio2 - 18 }
        ];

        this.resetarEntidades();
        this.entrada.resetar();
        this.ultimoTick = Date.now();
        this.atualizarUI();
    }

    // Reposiciona jogadores e bola
    resetarEntidades() {
        this.jogador1.resetar(this.gravidadeAtual, this.canvasElemento.height);
        this.jogador2.resetar(this.gravidadeAtual, this.canvasElemento.height);
        this.bola.resetar(this.canvasElemento.width, this.canvasElemento.height);
    }

    // Alterna pausa
    alternarPausa() {
        if (this.estado === 'PLAYING') this.estado = 'PAUSED';
        else if (this.estado === 'PAUSED') this.retomarJogo();
        this.atualizarUI();
    }

    // Retoma jogo
    retomarJogo() {
        if (this.estado === 'PAUSED') {
            this.estado = 'PLAYING';
            this.ultimoTick = Date.now();
            this.entrada.resetar();
        }
        this.atualizarUI();
    }

    // Vai ao menu
    mostrarMenu() {
        this.estado = 'MENU';
        if (this.ui.overlaySetup) this.ui.overlaySetup.classList.add("hidden");
        this.atualizarUI();
    }

    // Exibe a tela de setup antes de iniciar a partida
    mostrarSetup() {
        if (this.ui.overlayMenu) this.ui.overlayMenu.classList.add("hidden");
        if (this.ui.overlayGameOver) this.ui.overlayGameOver.classList.add("hidden");
        if (this.ui.overlayPause) this.ui.overlayPause.classList.add("hidden");
        if (this.ui.overlaySetup) this.ui.overlaySetup.classList.remove("hidden");
    }

    // Entrada na arena: fullscreen e início do jogo
    entrarNaArena() {
        const iniciar = () => {
            if (this.ui.overlaySetup) this.ui.overlaySetup.classList.add("hidden");
            this.iniciarPartida();
        };

        const fullscreenTarget = document.documentElement;
        if (fullscreenTarget.requestFullscreen) {
            fullscreenTarget.requestFullscreen().then(iniciar).catch(() => iniciar());
        } else {
            iniciar();
        }
    }

    // Atualiza visibilidade dos overlays
    atualizarUI() {
        if (this.ui.overlayMenu) this.ui.overlayMenu.classList.add("hidden");
        if (this.ui.overlayPause) this.ui.overlayPause.classList.add("hidden");
        if (this.ui.overlayGameOver) this.ui.overlayGameOver.classList.add("hidden");
        if (this.ui.overlaySetup) this.ui.overlaySetup.classList.add("hidden");

        if (this.estado === 'MENU' && this.ui.overlayMenu) this.ui.overlayMenu.classList.remove("hidden");
        else if (this.estado === 'PAUSED' && this.ui.overlayPause) this.ui.overlayPause.classList.remove("hidden");
        else if (this.estado === 'GAMEOVER' && this.ui.overlayGameOver) {
            this.ui.overlayGameOver.classList.remove("hidden");
            if (this.ui.textWinner) {
                let textoVencedor = "";
                let corVencedor = "";
                if (this.placarP1 > this.placarP2) {
                    textoVencedor = "JAX (LARANJA) VENCEU!";
                    corVencedor = corJogador1;
                } else if (this.placarP2 > this.placarP1) {
                    textoVencedor = "VAILE (ROXO) VENCEU!";
                    corVencedor = corJogador2;
                } else {
                    textoVencedor = "PARTIDA EMPATADA!";
                    corVencedor = "#FFD700";
                }
                this.ui.textWinner.innerText = textoVencedor;
                this.ui.textWinner.style.color = corVencedor;
            }
        }
    }

    // Checa colisão chute jogador <-> bola
    verificarColisaoChute(jogador, bola) {
        let testeX = bola.posX;
        let testeY = bola.posY;

        if (bola.posX < jogador.posX) testeX = jogador.posX;
        else if (bola.posX > jogador.posX + jogador.largura) testeX = jogador.posX + jogador.largura;
        
        if (bola.posY < jogador.posY) testeY = jogador.posY;
        else if (bola.posY > jogador.posY + jogador.altura) testeY = jogador.posY + jogador.altura;

        const distX = bola.posX - testeX;
        const distY = bola.posY - testeY;
        const distancia = Math.sqrt((distX * distX) + (distY * distY));

        if (distancia <= bola.raio) {
            let forcaX = (bola.posX - (jogador.posX + jogador.largura / 2)) * 0.3;
            let forcaY = this.gravidadeAtual > 0 ? -6 : 6;
            forcaX += jogador.velX * 0.8;
            bola.velX = forcaX;
            bola.velY = forcaY;
        }
    }

    // Atualização por tick
    atualizar() {
        const agora = Date.now();
        if (agora - this.ultimoTick >= 1000) {
            this.tempoRestante--;
            this.ultimoTick = agora;

            let deveInverter = false;
            for (let ev of this.eventosGravidade) {
                if (this.tempoRestante <= ev.start && this.tempoRestante > ev.end) {
                    deveInverter = true;
                    break;
                }
            }

            if (deveInverter !== this.gravidadeInvertida) {
                this.gravidadeInvertida = deveInverter;
                this.gravidadeAtual = deveInverter ? -gravidadeBase : gravidadeBase;
                this.jogador1.velY = 0;
                this.jogador2.velY = 0;
            }

            if (this.tempoRestante <= 0) {
                this.tempoRestante = 0;
                this.estado = 'GAMEOVER';
                this.atualizarUI();
                return;
            }
        }

        this.jogador1.atualizar(this.entrada, this.gravidadeAtual, this.canvasElemento.height);
        this.jogador2.atualizar(this.entrada, this.gravidadeAtual, this.canvasElemento.height);

        const resultadoGol = this.bola.atualizar(this.gravidadeAtual, this.canvasElemento.width, this.canvasElemento.height);
        if (resultadoGol === "P1") {
            this.placarP1++;
            this.resetarEntidades();
        } else if (resultadoGol === "P2") {
            this.placarP2++;
            this.resetarEntidades();
        }

        this.verificarColisaoChute(this.jogador1, this.bola);
        this.verificarColisaoChute(this.jogador2, this.bola);
    }

    // Renderiza cena
    desenhar() {
        this.contexto.clearRect(0, 0, this.canvasElemento.width, this.canvasElemento.height);
        this.campo.desenharFundo(this.contexto);

        if (this.gravidadeInvertida) {
            this.contexto.save();
            this.contexto.fillStyle = "rgba(176, 38, 255, 0.12)";
            this.contexto.fillRect(0, 0, this.canvasElemento.width, this.canvasElemento.height);
            if (Math.floor(Date.now() / 400) % 2 === 0) {
                this.contexto.fillStyle = "#FFD700";
                this.contexto.font = "bold 20px 'Share Tech Mono', 'Courier New', monospace";
                this.contexto.textAlign = "center";
                this.contexto.fillText("⚠ GRAVIDADE INVERTIDA - GOLS NO TETO ⚠", this.canvasElemento.width / 2, this.canvasElemento.height / 2);
            }
            this.contexto.restore();
        }

        this.campo.desenharEstruturas(this.contexto, this.gravidadeInvertida);
        this.jogador1.desenhar(this.contexto);
        this.jogador2.p1Visible = false;
        this.jogador2.desenhar(this.contexto);
        this.bola.desenhar(this.contexto);
        this.desenharHUD();
    }

    // HUD: tempo e placar
    desenharHUD() {
        this.contexto.save();
        this.contexto.textAlign = "center";
        this.contexto.textBaseline = "top";

        this.contexto.fillStyle = "#00F5FF";
        this.contexto.font = "24px 'Share Tech Mono', 'Courier New', monospace";
        const minutos = Math.floor(this.tempoRestante / 60);
        const segundos = this.tempoRestante % 60;
        const stringTempo = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
        this.contexto.fillText(stringTempo, this.canvasElemento.width / 2, 15);

        this.contexto.font = "bold 36px 'Share Tech Mono', 'Courier New', monospace";
        this.contexto.fillStyle = corJogador1;
        this.contexto.fillText(this.placarP1.toString(), this.canvasElemento.width / 2 - 70, 10);

        this.contexto.fillStyle = corJogador2;
        this.contexto.fillText(this.placarP2.toString(), this.canvasElemento.width / 2 + 70, 10);

        this.contexto.strokeStyle = "rgba(0, 245, 255, 0.3)";
        this.contexto.lineWidth = 1;
        this.contexto.beginPath();
        this.contexto.moveTo(this.canvasElemento.width / 2 - 120, 50);
        this.contexto.lineTo(this.canvasElemento.width / 2 - 50, 50);
        this.contexto.lineTo(this.canvasElemento.width / 2 - 30, 42);
        this.contexto.lineTo(this.canvasElemento.width / 2 + 30, 42);
        this.contexto.lineTo(this.canvasElemento.width / 2 + 50, 50);
        this.contexto.lineTo(this.canvasElemento.width / 2 + 120, 50);
        this.contexto.stroke();

        this.contexto.restore();
    }

    // Loop principal
    loopPrincipal() {
        if (this.estado === 'PLAYING') {
            this.atualizar();
            this.desenhar();
        } else if (this.estado === 'PAUSED' || this.estado === 'MENU' || this.estado === 'GAMEOVER') {
            this.desenhar();
        }

        requestAnimationFrame(() => this.loopPrincipal());
    }
}
