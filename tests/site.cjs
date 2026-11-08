/* Testes do site Bancada Assistência Técnica com Playwright.
   Como rodar:
     cd .. && python3 -m http.server 8315 &   (servir a pasta de cima, para os caminhos /assistencia-tecnica/ do 404 funcionarem)
     node tests/site.cjs            (só verifica)
     node tests/site.cjs capturas   (verifica e salva capturas em tests/capturas/)
   Verifica em 1280x900, iPhone 13 e 320px: console limpo, sem rolagem horizontal,
   sem texto cortado e cada função de ponta a ponta. */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const PORTA = process.env.PORTA || "8315";
const URL = `http://localhost:${PORTA}/assistencia-tecnica/`;
const capturas = process.argv.includes("capturas");
const pastaCap = path.join(__dirname, "capturas");
if (capturas) fs.mkdirSync(pastaCap, { recursive: true });

let falhas = 0;
function checa(cond, msg) {
  if (!cond) { falhas++; console.log("  FALHA: " + msg); }
}

async function capturar(page, seletor, nome) {
  if (!capturas) return;
  const alvo = seletor ? page.locator(seletor) : page;
  await alvo.screenshot({ path: path.join(pastaCap, `${nome}.png`) });
}

async function textosCortados(page) {
  return page.evaluate(() => {
    const problemas = [];
    const els = document.querySelectorAll("h1, h2, h3, p, li, dt, dd, button, a, label, summary, strong, span, time, small");
    for (const el of els) {
      if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
      const cs = getComputedStyle(el);
      if (cs.overflow === "hidden" || cs.textOverflow === "ellipsis") continue;
      if (el.scrollWidth > el.clientWidth + 2 && cs.whiteSpace !== "nowrap" && el.clientWidth > 0) {
        problemas.push(`${el.tagName.toLowerCase()}.${el.className}: ${el.scrollWidth} > ${el.clientWidth} "${el.textContent.trim().slice(0, 40)}"`);
      }
    }
    return problemas;
  });
}

async function rolagemHorizontal(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

async function roda(nome, contexto, sufixo) {
  console.log(`\n== ${nome}`);
  const page = await contexto.newPage();
  const erros = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") erros.push(m.text()); });
  page.on("pageerror", (e) => erros.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => erros.push("request falhou: " + r.url()));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  checa(!(await rolagemHorizontal(page)), `${nome}: rolagem horizontal na abertura`);
  const cortados = await textosCortados(page);
  checa(cortados.length === 0, `${nome}: textos cortados: ${cortados.join(" | ")}`);
  await capturar(page, null, `capa${sufixo}`);

  /* Menu do celular */
  const menuVisivel = await page.isVisible(".menu-botao");
  if (menuVisivel) {
    await page.click(".menu-botao");
    checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "true", `${nome}: menu não abriu`);
    checa(await page.isVisible("#menu a[href='#orcamento']"), `${nome}: link do menu não visível`);
    await page.click("#menu a[href='#orcamento']");
    checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "false", `${nome}: menu não fechou ao clicar`);
  }

  /* nas capturas de seção, o cabeçalho fixo sairia por cima; vira estático só para as fotos */
  if (capturas) await page.evaluate(() => { document.querySelector(".topo").style.position = "static"; });

  /* 1. Acompanhamento de OS */
  await page.click('.etiqueta-botao[data-codigo="BK-48210"]');
  await page.waitForTimeout(700);
  checa(await page.isVisible("#os-resultado"), `${nome}: resultado da OS não apareceu`);
  checa((await page.textContent("#os-numero")) === "BK-48210", `${nome}: número da OS errado`);
  checa((await page.textContent("#os-estado")) === "em reparo", `${nome}: estado da OS errado`);
  checa((await page.locator("#os-passos .passo").count()) === 5, `${nome}: linha do tempo sem 5 passos`);
  checa((await page.locator("#os-passos .passo-feito").count()) === 3, `${nome}: passos concluídos != 3`);
  checa(await page.locator("#os-passos .passo-atual").count() === 1, `${nome}: sem passo atual`);
  checa((await page.getAttribute("#os-barra", "class")).includes("p4"), `${nome}: barra de progresso não chegou em p4`);
  await capturar(page, "#acompanhar", `funcao-os${sufixo}`);

  await page.fill("#codigo-os", "bk48213");
  await page.click("#form-os button[type=submit]");
  await page.waitForTimeout(700);
  checa((await page.inputValue("#codigo-os")) === "BK-48213", `${nome}: normalização do código falhou`);
  checa((await page.textContent("#os-estado")) === "pronto", `${nome}: BK-48213 não está pronto`);
  checa((await page.getAttribute("#os-barra", "class")).includes("p5"), `${nome}: barra não chegou a 100%`);

  await page.fill("#codigo-os", "BK-00001");
  await page.click("#form-os button[type=submit]");
  await page.waitForTimeout(300);
  checa(await page.isVisible("#os-nada"), `${nome}: aviso de OS não encontrada não apareceu`);
  checa(!(await page.isVisible("#os-resultado")), `${nome}: resultado antigo ficou visível junto com o aviso`);

  await page.fill("#codigo-os", "abc");
  await page.click("#form-os button[type=submit]");
  checa((await page.textContent("#erro-os")).length > 5, `${nome}: validação do formato não mostrou mensagem`);
  checa((await page.getAttribute("#codigo-os", "aria-invalid")) === "true", `${nome}: aria-invalid não marcado`);

  /* lembrar no navegador */
  await page.check("#lembrar-os");
  await page.click('.etiqueta-botao[data-codigo="BK-48199"]');
  await page.waitForTimeout(300);
  const guardado = await page.evaluate(() => localStorage.getItem("bancada-os"));
  checa(guardado === "BK-48199", `${nome}: localStorage não guardou o código (${guardado})`);
  await page.uncheck("#lembrar-os");
  checa((await page.evaluate(() => localStorage.getItem("bancada-os"))) === null, `${nome}: desmarcar não apagou o localStorage`);

  /* 2. Estimador de orçamento */
  await page.selectOption("#orc-aparelho", "notebook");
  checa(!(await page.isDisabled("#orc-defeito")), `${nome}: select de defeito continua desativado`);
  checa((await page.locator("#orc-defeito option").count()) === 7, `${nome}: defeitos do notebook != 6`);
  await page.selectOption("#orc-defeito", "esquenta");
  await page.waitForTimeout(300);
  const faixa1 = (await page.textContent("#orc-faixa")).trim();
  checa(faixa1.startsWith("R$ 220 a R$ 340"), `${nome}: faixa do notebook/esquenta errada (${faixa1})`);
  checa((await page.textContent("#orc-prazo")) === "2 a 3 dias úteis", `${nome}: prazo errado (${await page.textContent("#orc-prazo")})`);
  await page.click('.segmento[data-urgencia="rapido"]');
  await page.waitForTimeout(300);
  checa((await page.textContent("#orc-prazo")) === "1 a 2 dias úteis", `${nome}: prazo prioridade errado (${await page.textContent("#orc-prazo")})`);
  checa((await page.textContent("#orc-mao")) === "R$ 200", `${nome}: mão de obra com prioridade errada (${await page.textContent("#orc-mao")})`);
  await page.selectOption("#orc-porte", "1.9");
  await page.waitForTimeout(300);
  const faixa2 = (await page.textContent("#orc-faixa")).trim();
  checa(faixa2.startsWith("R$ 354 a R$ 582"), `${nome}: faixa topo de linha errada (${faixa2})`);
  await page.click('.segmento[data-urgencia="normal"]');
  await page.selectOption("#orc-porte", "1");
  await page.waitForTimeout(300);
  await capturar(page, "#orcamento", `funcao-orcamento${sufixo}`);
  await page.selectOption("#orc-aparelho", "tv");
  await page.selectOption("#orc-defeito", "linhas");
  await page.waitForTimeout(300);
  checa((await page.textContent("#orc-faixa")).includes("Sem conserto"), `${nome}: caso sem conserto não apareceu`);
  await page.selectOption("#orc-aparelho", "");
  checa(await page.isDisabled("#orc-defeito"), `${nome}: limpar aparelho não desativou defeito`);
  checa(await page.isHidden("#orc-faixa"), `${nome}: faixa continuou visível sem aparelho`);

  /* 3. Agendamento */
  checa((await page.locator("#ag-dias .dia").count()) === 7, `${nome}: calendário sem 7 dias`);
  await page.click("#form-ag button[type=submit]");
  checa((await page.textContent("#erro-nome")).length > 3, `${nome}: validação do nome não apareceu`);
  checa((await page.textContent("#erro-janela")).length > 3, `${nome}: validação da janela não apareceu`);
  checa(!(await page.isVisible("#ag-resumo")), `${nome}: resumo apareceu com formulário inválido`);

  await page.click('#ag-dias .dia[data-indice="0"]');
  checa(await page.isDisabled('.janela[data-janela="08:00 às 10:00"]'), `${nome}: janela ocupada do dia 1 não ficou indisponível`);
  await page.click('#ag-dias .dia[data-indice="2"]');
  checa(!(await page.isDisabled('.janela[data-janela="08:00 às 10:00"]')), `${nome}: janela não liberou ao trocar de dia`);
  await page.click('.janela[data-janela="10:00 às 12:00"]');
  checa((await page.getAttribute('.janela[data-janela="10:00 às 12:00"]', "aria-pressed")) === "true", `${nome}: janela não ficou marcada`);
  await page.fill("#ag-nome", "Teste da Silva");
  await page.fill("#ag-telefone", "65999990000");
  await page.selectOption("#ag-bairro", "Goiabeiras");
  await page.fill("#ag-rua", "Rua Exemplo, 10");
  await page.fill("#ag-aparelho", "Notebook que esquenta");
  checa((await page.textContent("#erro-nome")) === "", `${nome}: erro do nome não sumiu ao corrigir`);
  checa((await page.getAttribute("#ag-telefone", "aria-invalid")) === null, `${nome}: aria-invalid do telefone não sumiu ao corrigir`);
  await capturar(page, "#retirada", `funcao-agendamento${sufixo}`);
  await page.click("#form-ag button[type=submit]");
  await page.waitForTimeout(400);
  checa(await page.isVisible("#ag-resumo"), `${nome}: resumo do agendamento não apareceu`);
  const resumo = await page.textContent("#ag-resumo-lista");
  checa(resumo.includes("(65) 99999-0000"), `${nome}: telefone não formatado no resumo`);
  checa(resumo.includes("Goiabeiras") && resumo.includes("10:00 às 12:00"), `${nome}: resumo sem bairro ou janela`);
  checa(resumo.includes("AG-"), `${nome}: resumo sem protocolo`);
  await capturar(page, "#ag-resumo", `funcao-agendamento-resumo${sufixo}`);

  /* tipo entrega mostra campo de OS e valida */
  await page.click("#ag-novo");
  checa(!(await page.isVisible("#ag-resumo")), `${nome}: "outro agendamento" não escondeu o resumo`);
  await page.click('.segmento[data-tipo="entrega"]');
  checa(await page.isVisible("#ag-os"), `${nome}: campo de OS não apareceu para entrega`);
  checa(await page.isHidden("#ag-aparelho"), `${nome}: campo de aparelho não sumiu para entrega`);
  await page.click('.segmento[data-tipo="retirada"]');

  /* 4. Dúvidas com busca */
  checa((await page.textContent("#faq-contagem")).includes("10"), `${nome}: contagem inicial das dúvidas`);
  await page.fill("#faq-campo", "peça");
  await page.waitForTimeout(200);
  const visiveis = await page.locator("#faq-lista details:not([hidden])").count();
  checa(visiveis >= 2 && visiveis < 10, `${nome}: filtro "peça" deixou ${visiveis} itens`);
  checa(await page.locator("#faq-lista details:not([hidden])").first().evaluate((d) => d.open), `${nome}: primeiro resultado não abriu`);
  await capturar(page, "#duvidas", `funcao-duvidas${sufixo}`);
  await page.fill("#faq-campo", "xyzxyz");
  await page.waitForTimeout(200);
  checa(await page.isVisible("#faq-nada"), `${nome}: aviso de nenhuma dúvida não apareceu`);
  await page.fill("#faq-campo", "MOLHÔU");
  await page.waitForTimeout(200);
  checa((await page.locator("#faq-lista details:not([hidden])").count()) === 1, `${nome}: busca sem acento e sem caixa falhou`);
  await page.fill("#faq-campo", "");
  await page.waitForTimeout(200);
  checa((await page.locator("#faq-lista details:not([hidden])").count()) === 10, `${nome}: limpar busca não devolveu as 10`);

  /* Detalhes técnicos abrem */
  await page.click(".tecnico summary");
  checa(await page.isVisible(".tecnico-corpo"), `${nome}: detalhes técnicos não abriram`);

  /* Estado final da página */
  checa(!(await rolagemHorizontal(page)), `${nome}: rolagem horizontal depois de usar tudo`);
  const cortados2 = await textosCortados(page);
  checa(cortados2.length === 0, `${nome}: textos cortados no fim: ${cortados2.join(" | ")}`);
  checa(erros.length === 0, `${nome}: console com erros: ${erros.join(" | ")}`);

  /* 404 */
  const r404 = await page.goto(`${URL}404.html`, { waitUntil: "networkidle" });
  checa(r404.ok(), `${nome}: 404.html não carregou`);
  checa((await page.textContent("h1")).includes("não existe"), `${nome}: 404 sem título`);
  checa(erros.length === 0, `${nome}: console com erros no 404: ${erros.join(" | ")}`);

  await page.close();
  console.log(falhas === 0 ? "  ok" : `  ${falhas} falha(s) acumulada(s)`);
}

(async () => {
  const browser = await chromium.launch();
  const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "pt-BR" });
  await roda("1280x900", desk, "");
  await desk.close();
  const iphone = await browser.newContext({ ...devices["iPhone 13"], locale: "pt-BR" });
  await roda("iPhone 13", iphone, "-celular");
  await iphone.close();
  const pequeno = await browser.newContext({ viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "pt-BR" });
  await roda("320px", pequeno, "-320");
  await pequeno.close();
  await browser.close();
  console.log(falhas === 0 ? "\nTudo passou." : `\n${falhas} falha(s).`);
  process.exit(falhas === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
