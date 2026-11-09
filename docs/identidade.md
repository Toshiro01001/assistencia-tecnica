# Identidade visual: Bancada Assistência Técnica

Estudo curto feito antes do código. Tudo aqui é fictício: a empresa, os técnicos, o endereço, o telefone, os números de ordem de serviço, os prazos e os preços.

## Nome e posicionamento

**Bancada Assistência Técnica**. Oficina de conserto de celulares, notebooks e eletrodomésticos em Cuiabá.

Frase de posicionamento: **"A gente diz o que é, quanto custa e quando fica pronto."**

Bancada é a mesa do técnico: tapete antiestático, ferramentas no lugar, cada aparelho com a sua etiqueta. O que diferencia uma assistência boa de uma ruim não é a máquina de solda, é a informação: o cliente saber em que pé está o conserto. Por isso o site gira em torno da **ordem de serviço (OS)**: a etiqueta de OS é o elemento gráfico da marca e a função principal é acompanhar a OS pelo número. O texto é em primeira pessoa da oficina, curto, com número onde cabe número.

Diferença proposital em relação aos outros sites da vitrine: o de ar-condicionado (Friagem) é azul-gelo e leve; o de engenharia (Prumo) é concreto quente com amarelo de trena. Este é **cinza-chumbo frio com verde de placa de circuito**, fundo claro de bancada e blocos escuros. Nada de azul-e-laranja de assistência de shopping, nada de banner com "promoção".

## Paleta

As cores vêm da bancada: o chumbo do tapete antiestático e das ferramentas, o cinza claro da mesa de inox escovado, e a única cor viva que existe ali, o verde da máscara de solda das placas e do LED de "pronto".

| Papel | Nome | Hex | Uso |
|---|---|---|---|
| Fundo escuro | Chumbo | `#1F2327` | cabeçalho, hero, bloco da consulta de OS, rodapé, etiquetas de OS |
| Superfície no escuro | Chumbo claro | `#2C3238` | caixas, campos e trilhos dentro dos blocos escuros |
| Fundo claro | Bancada | `#E9ECEF` | fundo das seções claras |
| Fundo claro 2 | Inox | `#D3D8DE` | campos de formulário, faixas de apoio, chips de exemplo |
| Texto | Chumbo | `#1F2327` | todo o texto sobre fundo claro |
| Texto no escuro | Papel | `#EDF0F2` | texto sobre Chumbo |
| Texto secundário | Grafite | `#4F5A66` | legendas e apoio sobre fundo claro |
| Texto secundário no escuro | Grafite claro | `#AEB7C0` | legendas sobre Chumbo |
| Linha | Linha | `#B8C0C8` | bordas de 1px, divisórias, pontos da grade de furos |
| Destaque | Verde-circuito | `#2FBF83` | sobre fundo escuro: o LED do passo atual, a barra de progresso, o grifo do título |
| Destaque sobre claro | Verde-placa | `#0F6B47` | links e confirmações sobre fundo claro (o verde claro não passa no contraste sobre Bancada) |
| Erro | Vermelho | `#B3261E` sobre claro, `#F28B82` sobre escuro | só em mensagens de validação |

Regras de uso:

- O verde aparece **uma vez por tela**: o grifo de uma palavra no título do hero, o LED do passo atual na linha do tempo da OS, o total do orçamento, a janela de horário escolhida no agendamento, a contagem de resultados da busca de dúvidas. Nunca como fundo de seção inteira, nunca em texto corrido. Texto sobre verde é sempre Chumbo.
- Sem gradiente decorativo e sem sombra em cartão. Separação entre blocos é linha de 1px cor Linha ou troca de fundo (Bancada para Inox, ou para Chumbo).
- A grade de furos de uma placa perfurada (pontos de 1px a cada 24px) é a textura dos blocos escuros, discreta, como papel de fundo.
- A **etiqueta de OS** é o elemento gráfico: retângulo chumbo com canto chanfrado, furo redondo à esquerda (como a etiqueta de papel amarrada no aparelho) e número em fonte mono. Aparece no hero sobre a foto, em cada exemplo de código e no resultado da consulta.
- Contraste conferido (WCAG): Chumbo sobre Bancada 13,3:1; Chumbo sobre Inox 11,0:1; Grafite sobre Bancada 5,8:1; Grafite sobre Inox 4,8:1; Papel sobre Chumbo 13,3:1; Papel sobre Chumbo claro 10,9:1; Grafite claro sobre Chumbo 7,8:1; Grafite claro sobre Chumbo claro 6,4:1; Verde-circuito sobre Chumbo 6,7:1; Verde-circuito sobre Chumbo claro 5,5:1; Chumbo sobre Verde-circuito 6,7:1; Verde-placa sobre Bancada 5,5:1; Verde-placa sobre Inox 4,6:1; Vermelho sobre Bancada 5,5:1; Vermelho claro sobre Chumbo 6,6:1. Tudo AA; a maior parte AAA.

## Tipografia

Duas famílias, ambas com licença SIL OFL 1.1, servidas da pasta `fonts/` (woff2 do subconjunto latino, licenças ao lado):

- **Barlow** (pesos 400, 500, 600 e 700): a fonte de tudo que é texto. É uma grotesca de inspiração DIN, a letra das placas de ferramenta e dos manuais de serviço, mas com um desenho um pouco mais largo e amigável. Títulos em 600, texto em 400, botões e rótulos em 500.
- **JetBrains Mono** (variável, usada em 400 e 600): a fonte dos **números**: código da OS, datas, horários, faixas de preço e prazos. Tudo que o cliente vai conferir ou anotar fica em mono, para parecer lido direto do sistema da oficina. Também rotula os passos da linha do tempo.

Escala (celular / computador), em rem com base 16px:

| Papel | Celular | Computador | Peso | Entrelinha |
|---|---|---|---|---|
| Título do hero | 2,25rem | 3,5rem | 600 | 1,05 |
| Título de seção | 1,75rem | 2,25rem | 600 | 1,15 |
| Subtítulo | 1,125rem | 1,25rem | 500 | 1,35 |
| Número em destaque (mono) | 1,5rem | 2rem | 600 | 1 |
| Corpo | 1rem | 1,0625rem | 400 | 1,55 |
| Legenda e mono pequeno | 0,8125rem | 0,875rem | 400 ou 500 | 1,4 |

Regra de peso: nunca 700 em texto corrido; 700 só no nome da marca e no número da OS. Letras em caixa alta só nas etiquetas de OS (texto mono, 2 ou 3 palavras).

## Layout

- Grade de 12 colunas no computador, largura máxima de 1120px, margem lateral de 20px no celular e 40px a partir de 760px.
- Ritmo de espaçamento em múltiplos de 8px: 8, 16, 24, 40, 64, 96. Seções com 64px de respiro vertical no celular e 96px no computador.
- Alinhamento à esquerda em tudo. Nada centralizado, exceto o conteúdo da etiqueta de OS e a página 404.
- Cantos: raio de 4px em botões e campos; 0 nas etiquetas e nos blocos. A foto do hero tem raio de 4px e um canto superior esquerdo chanfrado onde a etiqueta de OS se encaixa.
- Alternância de fundos: Chumbo (hero), Bancada (serviços), Chumbo (consulta de OS), Bancada (orçamento), Inox (agendamento), Bancada (dúvidas e oficina), Chumbo (rodapé). A faixa escura da consulta de OS no meio da página é o "centro" visual.

## Imagem forte do hero

Uma fotografia da bancada (ver seção "Foto do hero"), em contêiner 4:3, ocupando a metade direita do hero no computador e a largura toda no celular. Sobre o canto superior esquerdo da foto, deslocada para fora, fica a etiqueta de OS da marca: `OS 48213 · PRONTO`, com o LED verde aceso. É a única coisa memorável da tela: a etiqueta presa no aparelho, como na oficina de verdade.

Enquanto a foto definitiva não chega, `img/hero.webp` é uma composição abstrata gerada com Pillow nas cores da identidade: fundo chumbo, grade de furos de placa perfurada, trilhas de circuito em verde desbotado com pads redondos e uma mancha de luz fria vinda do alto, como a luminária da bancada. 1600 x 1200px, sem texto.

As demais ilustrações (ícones dos aparelhos, os LEDs da linha do tempo, o ícone da marca) são SVG inline ou CSS.

## Foto do hero

Proporção esperada: **4:3** (1600 x 1200px), exportada em webp com cerca de 80% de qualidade, salva em `img/hero.webp`.

Prompt em português para gerar no Canva:

> Fotografia editorial de uma bancada de assistência técnica limpa e organizada, vista de cima em leve ângulo. Tapete antiestático cinza-chumbo escuro cobrindo a mesa. No centro, um smartphone aberto com a tampa traseira ao lado e a placa lógica verde-escura exposta. Em volta, poucas ferramentas de precisão alinhadas em paralelo: um conjunto de chaves de fenda pequenas com cabo preto, uma pinça de aço escovado, uma espátula plástica, um pincel antiestático. Uma lupa de bancada com anel de luz fria apagada no canto superior. Luz principal fria e difusa vinda de cima, sombras suaves, sem reflexos estourados. Fundo e mesa em tons de cinza-chumbo e grafite, com o único ponto de cor sendo o verde da placa de circuito. Estilo de site premium, minimalista, muita área neutra, foco nítido no celular e profundidade de campo rasa no resto. Sem pessoas, sem mãos, sem texto, sem logotipos, sem etiquetas legíveis.

Variação aceitável: no lugar do smartphone, um notebook aberto com o teclado removido e a placa-mãe exposta; ou a tampa traseira de uma máquina de lavar aberta com a placa eletrônica aparecendo. Manter sempre a luz fria, o fundo chumbo e o verde da placa como única cor.

## Movimento

Um só momento orquestrado na abertura: o título, o texto e a foto do hero sobem 12px com fade em 500ms, em escada de 80ms, e o LED da etiqueta de OS "acende" por último. Depois disso, só respostas a ações: o LED do passo atual pisca devagar (2s), a barra de progresso da OS cresce em 600ms quando o código é consultado, o total do orçamento troca de valor com um fade curto, a janela de horário escolhida ganha a borda verde em 150ms. Com `prefers-reduced-motion: reduce`, nada se move: tudo aparece pronto e o LED fica aceso fixo.

## Design systems aplicados (leva final)

Dupla usada como referência de padrões, sem trocar a paleta: **developer-monetizati-design-system** (escuro: preto com bordas brancas finas, esmeralda como único sinal, números tabulares, terminal digitado, selo com halo, contador animado) e **futureui-design-system** (claro: moldura cinza com tiles de borda neutra, cor só nos dados, calendário de células, gráfico de barras).

Mistura: os blocos escuros (`.topo`, `.hero`, `#acompanhar`, `.rodape`) seguem o developer-monetizati trocando o preto por Chumbo, o cinza-escuro por Chumbo claro, o branco a 5% e 10% pelas bordas e a esmeralda por Verde-circuito, mantendo a grade de furos. Os blocos claros (`#servicos`, `#orcamento`, `#retirada`, `#duvidas`, `#oficina`, `#como-funciona`) seguem o futureui com Bancada no lugar do cinza da moldura, Inox a 50% nos tiles, Linha nas bordas, Verde-placa no lugar do laranja só em dados e estados, Barlow 600 no lugar da Oswald e sem caixa alta fora das etiquetas de OS. As formas geométricas flutuantes e os efeitos WebGL ficaram de fora.

Componentes aplicados (padrão, origem, onde):

1. Navbar em pílula flutuante sticky com blur (developer-monetizati): `.topo` e `.topo-linha`. Pílula a 16px do topo, Chumbo a 90%, hairline Papel a 10%, blur de 12px, links Grafite claro que ficam Papel (o da seção visível em Verde-circuito) e "Acompanhar OS" como botão sólido Papel à direita. No celular o menu abre num painel arredondado abaixo da pílula.
2. Selo de status com halo (ping) (developer-monetizati): todo `.led-aceso` ganha um anel que se expande e some a cada 1,5s; novo selo `.selo` "Bancada aberta · seg a sáb" no hero, Verde a 10% com borda a 20%. Fixo em reduced motion.
3. Terminal com texto digitado (developer-monetizati): `.terminal` em volta de `#os-passos`. As notas do técnico aparecem digitadas em JetBrains Mono a 30 a 50ms por caractere, com cursor verde piscando na etapa atual, num poço Chumbo escuro com borda a 5%. Sem digitação em reduced motion.
4. Metric cards com contador em rAF (developer-monetizati): `.hero-numeros dd`. 24, 90 e 82% contam de 0 ao alvo em 2s com easeOutQuart, em mono tabular, cada par num cartão Chumbo claro com borda Papel a 10%.
5. KPI cards com chip (developer-monetizati): `.oficina-numeros`. Quatro cartões Inox com borda Linha, rótulo Barlow 14px Grafite, valor mono 600 e chip "menos de 3%" em Verde-placa só na garantia.
6. Segmented range com seleção com brilho (developer-monetizati): `.segmentos .segmento` em `#orcamento` e `#retirada`. Trilho Inox (Bancada no bloco Inox) com padding de 4px e raio 6px; o segmento pressionado fica Verde-placa com texto Papel e sombra 0 0 15px a 40%.
7. Entrada blur-up + animate-on-scroll (developer-monetizati): `.entra` no hero (opacidade 0, 30px abaixo, blur de 8px, 800ms, atrasos de 0,1 a 0,5s) e `.aos` em cada `.bloco .miolo`, que entra uma vez quando 20% aparece (IntersectionObserver). Tudo desligado em reduced motion.
8. Command search (developer-monetizati): `.busca` em `#codigo-os` e `#faq-campo`. Lupa de 16px à esquerda que escurece ou clareia no hover e borda verde no foco.
9. Card canvas (futureui): `.placa` dentro de cada `.bloco.claro`. A placa clara, com cantos de 4px e sombra 0 24px 48px -24px Chumbo a 35%, fica encaixada numa faixa Chumbo com a grade de furos (24px de borda no computador, 12px no celular).
10. Feature tile com hover que inverte (futureui): `.servico`. Tile Inox a 50% com borda Linha, raio 4px, padding 20px, índice mono no canto, foto quadrada no topo (88px no celular, 160px no computador), título Barlow 600 e defeitos; no hover (só com mouse) inverte para Chumbo com texto Papel e índice Verde-circuito em 300ms.
11. Eyebrow pair com régua + tag buttons (futureui): `.olho` com `.regua` antes de cada h2 (serviços, ordem de serviço, orçamento, retirada e entrega, dúvidas, oficina, como funciona); `.servico-defeitos li` viram tags de 0,75rem com borda Linha e raio total.
12. Calendar grid de células (futureui): `#ag-dias`. Sete células em 7 colunas, altura mínima de 52px: livre em Inox com borda Linha, parte ocupada com barra Verde-placa na metade esquerda, dia cheio em Chumbo com texto Papel a 50%; legenda de pontos abaixo. O JS marca o estado pelas janelas já ocupadas (há um dia cheio de exemplo).
13. Gráfico de 5 colunas com a atual destacada (futureui, 12-bar chart): `.trilho-col` em `#os-barra`. Recebido, diagnóstico, peça, reparo e pronto viram colunas arredondadas em Verde a 20% até 60% conforme a etapa, a atual em Papel com borda Verde e sombra, crescendo em 600ms; rótulos mono a partir de 560px.
14. Botão com degradê, sombras internas e véu que sobe (futureui): `.botao` e `.botao-contorno`. 48px, raio 4px, degradê vertical (Chumbo claro para Chumbo nos blocos claros; branco para Inox nos escuros), sombras internas em cima e embaixo; no hover um véu a 10% sobe de baixo em 300ms. O contorno usa borda Linha (ou Papel a 20%) e hover Inox.

Fotos novas (ilustrativas, geradas por IA no Canva a partir dos prompts do plano, salvas em `img/`): `servico-celular-placa.webp`, `servico-notebook-aberto.webp`, `servico-lavadora-placa.webp` (1:1, 1024x1024), `prateleira-aparelhos-etiquetados.webp` (16:9, 1456x816), `oficina-bancadas.webp` (3:2, 1456x970), `tecnico-lupa.webp` (3:4, 1088x1456) e `caixa-transporte-retirada.webp` (4:3, 1456x1088). Enquanto o Canva não entrega, os arquivos são placas lisas em Chumbo claro nas proporções certas.
