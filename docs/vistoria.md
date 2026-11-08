# Vistoria de segurança: Bancada Assistência Técnica

Data: 2026-11-08. Site estático de demonstração, publicado no GitHub Pages. Vistoria feita antes do primeiro commit.

## Content-Security-Policy

Meta no `index.html`: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'`.

- Nenhum script inline, nenhum `onclick` no HTML, nenhum `<style>` e nenhum atributo `style` no HTML. O único estilo aplicado por JavaScript é por classes e atributos (`hidden`, `aria-pressed`, `disabled`).
- `img-src` aceita `data:` só por causa das duas setinhas em SVG dos `<select>`, embutidas no CSS.
- `connect-src 'none'` e `form-action 'none'`: o navegador bloqueia qualquer `fetch`, `XMLHttpRequest` ou envio de formulário, mesmo que alguém altere o JavaScript no futuro.
- No `404.html` o `script-src` é `'none'`.

## Envio de dados

Nenhum. Os três formulários têm `novalidate`, não têm `action` e o JavaScript chama `preventDefault()` no `submit`. O agendamento monta um resumo na tela e para. Não há e-mail, WhatsApp, API, analytics ou pixel. O único link externo é https://mileumalinhas.com.br, com `rel="noopener"`.

## O que fica no localStorage

Uma chave, `bancada-os`, com o último código de OS consultado (texto como `BK-48213`), gravada só quando a pessoa marca a caixa "Lembrar este número neste navegador". Desmarcar a caixa apaga a chave. A leitura e a escrita ficam em `try/catch`, então o site funciona igual em navegador que bloqueia armazenamento. Nada mais é gravado: nome, telefone e endereço digitados no agendamento ficam só na tela até a página ser recarregada.

## Dependências

Nenhuma em produção. Sem framework, sem CDN, sem fonte externa. As fontes Barlow e JetBrains Mono estão em `fonts/` com licença SIL OFL 1.1 ao lado. O teste usa Playwright, que não faz parte do site publicado.

## Dados no repositório

Empresa, técnicos, cliente das OS (só iniciais), endereço, telefone, preços, prazos e protocolos são inventados. Não há chave, senha, token ou dado pessoal real. O `google20db0e080e71c701.html` é o arquivo de verificação do Search Console do dono, público por natureza.

## Riscos residuais

- A CSP por meta não cobre o cabeçalho HTTP; no GitHub Pages não dá para configurar cabeçalhos. Para um site real com servidor próprio, o mesmo texto deve ir para o cabeçalho `Content-Security-Policy`.
- O protocolo de agendamento (`AG-` mais seis dígitos) é gerado com `Math.random()` só para parecer real; não serve como identificador de verdade.
- Numa oficina real, a consulta de OS por número exigiria uma segunda chave (por exemplo, os quatro últimos dígitos do telefone), para um número adivinhado não expor dados de outro cliente. Aqui os dados são fictícios, então a consulta é aberta de propósito.
