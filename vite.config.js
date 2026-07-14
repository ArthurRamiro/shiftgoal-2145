import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// base: './' faz o build gerar caminhos RELATIVOS (./assets/...) em vez de
// absolutos (/assets/...). Isso é essencial para:
//  - itch.io (o jogo é servido de uma subpasta, não da raiz do domínio)
//  - GitHub Pages em repositórios que não estão na raiz do domínio
//
// viteSingleFile(): injeta TODO o JS, CSS e as imagens (como base64) dentro
// de um ÚNICO arquivo dist/index.html. Isso resolve de vez o problema de
// abrir o jogo via duplo-clique em qualquer PC (o erro de CORS com ES
// Modules em file:// só acontece quando há arquivos separados sendo
// importados — com tudo inline, não há mais "importação" nenhuma).
export default defineConfig({
    base: "./",
    plugins: [viteSingleFile()],
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
        assetsInlineLimit: 100 * 1024 * 1024 // garante que os PNGs também sejam inlinados
    }
});

