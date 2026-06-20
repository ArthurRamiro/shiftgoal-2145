// Manipulador de entrada do teclado
export class ManipuladorEntrada {
    constructor() {
        this.teclas = {};
        window.addEventListener("keydown", (e) => { this.teclas[e.key] = true; });
        window.addEventListener("keyup", (e) => { this.teclas[e.key] = false; });
    }

    // Retorna true se a tecla estiver pressionada
    estaPressionada(tecla) { return !!this.teclas[tecla]; }

    // Reseta estado das teclas
    resetar() { this.teclas = {}; }
}
