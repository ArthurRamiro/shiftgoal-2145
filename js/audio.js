// Gerenciador de áudio: todos os efeitos são sintetizados via Web Audio API.
// Não depende de arquivos .mp3/.wav externos — reduz peso do build e evita
// problemas de licenciamento de assets de terceiros.
export class GerenciadorAudio {
    constructor() {
        this.contexto = null;
        this.ganhoMestre = null;
        this.ultimoChuteEm = 0;
        this.silenciado = false;
    }

    // Deve ser chamado a partir de um gesto do usuário (clique/tecla),
    // pois navegadores bloqueiam áudio automático sem interação prévia.
    destravar() {
        if (this.contexto) {
            if (this.contexto.state === "suspended") this.contexto.resume();
            return;
        }
        const AudioContextRef = window.AudioContext || window.webkitAudioContext;
        this.contexto = new AudioContextRef();

        this.ganhoMestre = this.contexto.createGain();
        this.ganhoMestre.gain.value = 0.35;
        this.ganhoMestre.connect(this.contexto.destination);
    }

    alternarSilencio() {
        this.silenciado = !this.silenciado;
        if (this.ganhoMestre) {
            this.ganhoMestre.gain.value = this.silenciado ? 0 : 0.35;
        }
        return this.silenciado;
    }

    // Cria um oscilador com envelope ADSR simplificado (attack/decay only)
    _tocarTom({ frequenciaInicial, frequenciaFinal = null, tipo = "sine", duracao = 0.15, volume = 1, atraso = 0 }) {
        if (!this.contexto) return;
        const agora = this.contexto.currentTime + atraso;

        const osc = this.contexto.createOscillator();
        const ganho = this.contexto.createGain();

        osc.type = tipo;
        osc.frequency.setValueAtTime(frequenciaInicial, agora);
        if (frequenciaFinal !== null) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(frequenciaFinal, 1), agora + duracao);
        }

        ganho.gain.setValueAtTime(0, agora);
        ganho.gain.linearRampToValueAtTime(volume, agora + 0.01);
        ganho.gain.exponentialRampToValueAtTime(0.001, agora + duracao);

        osc.connect(ganho);
        ganho.connect(this.ganhoMestre);

        osc.start(agora);
        osc.stop(agora + duracao + 0.02);
    }

    // Ruído branco curto (usado para dar "corpo" ao som de chute)
    _tocarRuido({ duracao = 0.08, volume = 0.5, atraso = 0 }) {
        if (!this.contexto) return;
        const agora = this.contexto.currentTime + atraso;
        const tamanhoBuffer = this.contexto.sampleRate * duracao;
        const buffer = this.contexto.createBuffer(1, tamanhoBuffer, this.contexto.sampleRate);
        const dados = buffer.getChannelData(0);
        for (let i = 0; i < tamanhoBuffer; i++) {
            dados[i] = (Math.random() * 2 - 1) * (1 - i / tamanhoBuffer);
        }

        const fonte = this.contexto.createBufferSource();
        fonte.buffer = buffer;

        const ganho = this.contexto.createGain();
        ganho.gain.setValueAtTime(volume, agora);
        ganho.gain.exponentialRampToValueAtTime(0.001, agora + duracao);

        const filtro = this.contexto.createBiquadFilter();
        filtro.type = "highpass";
        filtro.frequency.value = 800;

        fonte.connect(filtro);
        filtro.connect(ganho);
        ganho.connect(this.ganhoMestre);

        fonte.start(agora);
    }

    // Clique de UI (menus/botões)
    tocarClique() {
        this._tocarTom({ frequenciaInicial: 700, frequenciaFinal: 900, tipo: "square", duracao: 0.06, volume: 0.5 });
    }

    // Chute na bola — com cooldown para não disparar em excesso durante colisões contínuas
    tocarChute() {
        if (!this.contexto) return;
        const agora = performance.now();
        if (agora - this.ultimoChuteEm < 120) return;
        this.ultimoChuteEm = agora;

        this._tocarRuido({ duracao: 0.07, volume: 0.6 });
        this._tocarTom({ frequenciaInicial: 220, frequenciaFinal: 90, tipo: "triangle", duracao: 0.12, volume: 0.7 });
    }

    // Gol marcado — pequena fanfarra ascendente
    tocarGol() {
        const notas = [523.25, 659.25, 783.99, 1046.5]; // Dó-Mi-Sol-Dó (arpejo)
        notas.forEach((freq, i) => {
            this._tocarTom({
                frequenciaInicial: freq,
                tipo: "sawtooth",
                duracao: 0.25,
                volume: 0.55,
                atraso: i * 0.09
            });
        });
    }

    // Alerta de inversão de gravidade — sirene sci-fi
    tocarAlertaGravidade() {
        this._tocarTom({ frequenciaInicial: 200, frequenciaFinal: 800, tipo: "sawtooth", duracao: 0.5, volume: 0.4 });
        this._tocarTom({ frequenciaInicial: 800, frequenciaFinal: 200, tipo: "sawtooth", duracao: 0.5, volume: 0.4, atraso: 0.5 });
    }

    // Apito de início/reinício de partida
    tocarApito() {
        this._tocarTom({ frequenciaInicial: 1200, tipo: "square", duracao: 0.3, volume: 0.5 });
    }

    // Fim de jogo
    tocarFimDeJogo() {
        const notas = [392, 349.23, 293.66];
        notas.forEach((freq, i) => {
            this._tocarTom({ frequenciaInicial: freq, tipo: "triangle", duracao: 0.35, volume: 0.5, atraso: i * 0.18 });
        });
    }
}
