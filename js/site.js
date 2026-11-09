/* Bancada Assistência Técnica: funções da página.
   Tudo roda no navegador. Nenhum pedido sai para a internet.
   Dados de exemplo fictícios ficam nas constantes abaixo. */
(function () {
  "use strict";

  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  var DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  function somaDias(base, n) {
    var d = new Date(base.getTime());
    d.setDate(d.getDate() + n);
    return d;
  }
  function dd(n) { return (n < 10 ? "0" : "") + n; }
  function dataCurta(d) { return dd(d.getDate()) + "/" + dd(d.getMonth() + 1); }
  function dataLonga(d) { return DIAS_SEMANA[d.getDay()] + " " + dd(d.getDate()) + "/" + dd(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function dataHora(d, h) { return dataCurta(d) + " " + h; }
  function reais(v) {
    return "R$ " + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function faixa(a, b) { return reais(a) + " a " + reais(b); }

  var MOVIMENTO_REDUZIDO = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* 0. Movimento: entrada ao rolar, contador do hero, link atual        */
  /* ------------------------------------------------------------------ */
  var miolos = $$(".bloco .miolo");
  if (!MOVIMENTO_REDUZIDO && "IntersectionObserver" in window && miolos.length) {
    var vendo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visto");
          vendo.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    miolos.forEach(function (m) {
      /* blocos já visíveis na abertura entram prontos, sem esperar a rolagem */
      var r = m.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) return;
      m.classList.add("aos");
      vendo.observe(m);
    });
  }

  /* Contador dos números do hero: 0 até o alvo em 2s com easeOutQuart */
  $$(".hero-numeros dd[data-alvo]").forEach(function (dd) {
    var alvo = parseInt(dd.getAttribute("data-alvo"), 10);
    var sufixo = dd.getAttribute("data-sufixo") || "";
    if (MOVIMENTO_REDUZIDO || isNaN(alvo) || !window.requestAnimationFrame) return;
    var inicio = null;
    var DURACAO = 2000;
    dd.textContent = "0" + sufixo;
    function passo(agora) {
      if (inicio === null) inicio = agora;
      var t = Math.min(1, (agora - inicio) / DURACAO);
      var e = 1 - Math.pow(1 - t, 4);
      dd.textContent = Math.round(alvo * e) + sufixo;
      if (t < 1) window.requestAnimationFrame(passo);
    }
    window.setTimeout(function () { window.requestAnimationFrame(passo); }, 400);
  });

  /* Link da seção visível fica em Verde-circuito na pílula */
  var linksMenu = $$(".menu a[href^='#']");
  if ("IntersectionObserver" in window && linksMenu.length) {
    var secoes = linksMenu.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    var espiao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        linksMenu.forEach(function (a) { a.classList.toggle("atual", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secoes.forEach(function (sec) { espiao.observe(sec); });
  }

  /* ------------------------------------------------------------------ */
  /* Menu do celular                                                     */
  /* ------------------------------------------------------------------ */
  var topo = $(".topo");
  var menuBotao = $(".menu-botao");
  if (menuBotao) {
    menuBotao.addEventListener("click", function () {
      var aberto = topo.classList.toggle("menu-aberto");
      menuBotao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    $$(".menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        topo.classList.remove("menu-aberto");
        menuBotao.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 1. Acompanhamento de ordem de serviço                               */
  /* ------------------------------------------------------------------ */
  var ETAPAS = ["Recebido", "Diagnóstico", "Aguardando peça", "Em reparo", "Pronto"];

  /* Cada OS tem: aparelho, defeito, cliente, técnico, dia de entrada (relativo a hoje),
     previsão (relativa a hoje), etapa atual (índice 0 a 4) e notas por etapa concluída. */
  var ORDENS = {
    "BK-48213": {
      aparelho: "Smartphone, tela e bateria",
      defeito: "Caiu e a tela parou de responder; bateria durava pouco",
      cliente: "Ana P.",
      tecnico: "Marcos",
      entrada: -3,
      previsao: 0,
      etapa: 4,
      notas: [
        ["09:12", "Aparelho recebido com tela trincada no canto inferior. Liga, toque falha na metade de baixo. Senha de teste anotada no comprovante."],
        ["14:40", "Display e touch trocados juntos. Bateria com 71% de saúde, troca recomendada e aprovada pela cliente por telefone."],
        ["16:05", "Tela em estoque. Bateria original chegou do fornecedor no dia seguinte."],
        ["10:30", "Tela e bateria instaladas, vedação refeita, 2 horas de teste de toque e carga."],
        ["11:20", "Pronto para retirada. Testado com a cliente por vídeo. Garantia de 90 dias registrada."]
      ]
    },
    "BK-48210": {
      aparelho: "Notebook 15 polegadas",
      defeito: "Esquenta muito e desliga sozinho depois de uns 20 minutos",
      cliente: "Carlos M.",
      tecnico: "Juliana",
      entrada: -2,
      previsao: 2,
      etapa: 3,
      notas: [
        ["10:05", "Recebido sem carregador. Liga normalmente. Ruído alto no cooler."],
        ["15:30", "Cooler travando com poeira e pasta térmica ressecada. Temperatura de 97 °C em 10 minutos de teste. Orçamento: limpeza completa, pasta térmica e troca do cooler."],
        ["09:00", "Cooler compatível em estoque. Etapa pulada."],
        ["09:40", "Em limpeza e montagem. Teste de estresse de 1 hora programado para amanhã cedo."],
        null
      ]
    },
    "BK-48199": {
      aparelho: "Máquina de lavar 12 kg",
      defeito: "Enche de água, mas não centrifuga e não escoa",
      cliente: "Rosa L.",
      tecnico: "Pedro",
      entrada: -4,
      previsao: 3,
      etapa: 2,
      notas: [
        ["08:30", "Visita técnica feita na casa da cliente. Máquina trazida para a bancada por precisar de troca de peça."],
        ["11:15", "Eletrobomba de drenagem queimada e filtro com objeto preso (moeda). Placa OK. Orçamento enviado e aprovado."],
        ["12:00", "Eletrobomba pedida ao fornecedor, chegada prevista em 3 dias úteis. Previsão de entrega atualizada."],
        null,
        null
      ]
    },
    "BK-48221": {
      aparelho: "Tablet 10 polegadas",
      defeito: "Não liga e não dá sinal de carga",
      cliente: "Felipe R.",
      tecnico: "Marcos",
      entrada: 0,
      previsao: 1,
      etapa: 0,
      notas: [
        ["08:50", "Recebido hoje cedo, sem sinal de vida. Vai para a bancada de placa ainda hoje; diagnóstico em até 24 horas."],
        null,
        null,
        null,
        null
      ]
    }
  };

  var CHAVE_LEMBRAR = "bancada-os";
  function lerLembrado() {
    try { return window.localStorage.getItem(CHAVE_LEMBRAR); } catch (e) { return null; }
  }
  function gravarLembrado(codigo) {
    try {
      if (codigo) window.localStorage.setItem(CHAVE_LEMBRAR, codigo);
      else window.localStorage.removeItem(CHAVE_LEMBRAR);
    } catch (e) { /* armazenamento bloqueado: segue sem lembrar */ }
  }

  var formOs = $("#form-os");
  if (formOs) {
    var campoOs = $("#codigo-os");
    var erroOs = $("#erro-os");
    var lembrar = $("#lembrar-os");
    var resultado = $("#os-resultado");
    var nada = $("#os-nada");
    var barra = $("#os-barra");
    var listaPassos = $("#os-passos");
    var colunaOs = $("#os-coluna");
    var digitacao = 0; /* muda a cada consulta e cancela a digitação anterior */

    /* Terminal: digita o texto de uma nota a 30 a 50ms por caractere */
    function digita(el, texto, comCursor, ficha, atraso) {
      el.textContent = "";
      var cursor = null;
      if (comCursor) {
        cursor = document.createElement("span");
        cursor.className = "cursor";
        cursor.setAttribute("aria-hidden", "true");
      }
      var no = document.createTextNode("");
      el.appendChild(no);
      if (cursor) el.appendChild(cursor);
      var i = 0;
      function proximo() {
        if (ficha !== digitacao) return;
        if (i >= texto.length) return;
        no.data = texto.slice(0, ++i);
        window.setTimeout(proximo, 30 + Math.random() * 20);
      }
      window.setTimeout(proximo, atraso);
    }

    function normaliza(v) {
      var s = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (/^BK\d{5}$/.test(s)) return "BK-" + s.slice(2);
      if (/^\d{5}$/.test(s)) return "BK-" + s;
      return s;
    }

    function mostrarOs(codigo) {
      var os = ORDENS[codigo];
      resultado.classList.remove("ativo");
      nada.classList.remove("ativo");
      if (colunaOs) colunaOs.classList.add("consultado");
      digitacao++;
      if (!os) {
        nada.classList.add("ativo");
        return false;
      }
      var fichaAtual = digitacao;
      var ordemNota = 0;
      var entrada = somaDias(hoje, os.entrada);
      var previsao = somaDias(hoje, os.previsao);
      $("#os-aparelho").textContent = os.aparelho;
      $("#os-defeito").textContent = os.defeito;
      $("#os-numero").textContent = codigo;
      $("#os-estado").textContent = ETAPAS[os.etapa].toLowerCase();
      $("#os-cliente").textContent = os.cliente;
      $("#os-entrada").textContent = dataLonga(entrada);
      $("#os-previsao").textContent = os.etapa === 4 ? "pronto, retire hoje" : dataLonga(previsao);
      $("#os-tecnico").textContent = os.tecnico;
      var led = $("#os-led");
      led.className = "led" + (os.etapa === 4 ? " led-aceso" : "");

      barra.className = "trilho-barra";
      listaPassos.innerHTML = "";
      ETAPAS.forEach(function (nome, i) {
        var li = document.createElement("li");
        var estado = i < os.etapa ? "passo-feito" : (i === os.etapa ? "passo-atual" : "passo-futuro");
        li.className = "passo " + estado;
        var marca = document.createElement("span");
        marca.className = "passo-marca";
        var ledPasso = document.createElement("span");
        ledPasso.className = "led" + (i === os.etapa && os.etapa < 4 ? " led-pisca" : "");
        ledPasso.setAttribute("aria-hidden", "true");
        marca.appendChild(ledPasso);
        var corpo = document.createElement("div");
        var titulo = document.createElement("p");
        titulo.className = "passo-titulo";
        var forte = document.createElement("strong");
        forte.textContent = nome;
        titulo.appendChild(forte);
        var nota = os.notas[i];
        if (nota && i <= os.etapa) {
          var quando = document.createElement("time");
          var diaNota = somaDias(entrada, Math.min(i, Math.max(0, -os.entrada)));
          quando.textContent = dataHora(diaNota, nota[0]);
          titulo.appendChild(quando);
        }
        corpo.appendChild(titulo);
        var texto = document.createElement("p");
        texto.className = "passo-nota";
        var conteudoNota = "";
        if (nota && i <= os.etapa) conteudoNota = nota[1];
        else if (i === os.etapa) conteudoNota = "Etapa em andamento.";
        if (conteudoNota) {
          if (MOVIMENTO_REDUZIDO) {
            texto.textContent = conteudoNota;
          } else {
            digita(texto, conteudoNota, i === os.etapa && os.etapa < 4, fichaAtual, 150 * ordemNota);
            ordemNota++;
          }
        }
        corpo.appendChild(texto);
        var sr = document.createElement("span");
        sr.className = "visualmente-oculto";
        sr.textContent = i < os.etapa ? " (concluído)" : (i === os.etapa ? " (etapa atual)" : " (ainda não)");
        forte.appendChild(sr);
        li.appendChild(marca);
        li.appendChild(corpo);
        listaPassos.appendChild(li);
      });
      resultado.classList.add("ativo");
      /* a barra cresce depois que o bloco aparece, para a transição ser vista */
      window.requestAnimationFrame(function () {
        barra.classList.add("p" + (os.etapa + 1));
      });
      return true;
    }

    formOs.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var codigo = normaliza(campoOs.value);
      erroOs.textContent = "";
      campoOs.removeAttribute("aria-invalid");
      if (!/^BK-\d{5}$/.test(codigo)) {
        erroOs.textContent = "Digite no formato BK-00000, como está na etiqueta.";
        campoOs.setAttribute("aria-invalid", "true");
        resultado.classList.remove("ativo");
        nada.classList.remove("ativo");
        campoOs.focus();
        return;
      }
      campoOs.value = codigo;
      var achou = mostrarOs(codigo);
      if (achou && lembrar.checked) gravarLembrado(codigo);
    });

    $$(".etiqueta-botao", formOs).forEach(function (b) {
      b.addEventListener("click", function () {
        campoOs.value = b.getAttribute("data-codigo");
        erroOs.textContent = "";
        campoOs.removeAttribute("aria-invalid");
        mostrarOs(campoOs.value);
        if (lembrar.checked) gravarLembrado(campoOs.value);
      });
    });

    lembrar.addEventListener("change", function () {
      if (lembrar.checked) {
        var atual = normaliza(campoOs.value);
        if (ORDENS[atual]) gravarLembrado(atual);
      } else {
        gravarLembrado(null);
      }
    });

    var lembrado = lerLembrado();
    if (lembrado && ORDENS[lembrado]) {
      lembrar.checked = true;
      campoOs.value = lembrado;
      mostrarOs(lembrado);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2. Estimador de orçamento                                           */
  /* ------------------------------------------------------------------ */
  /* Valores fictícios. peca: [min, max]; mao: mão de obra; dias: [min, max] */
  var TABELA = {
    celular: {
      nome: "Celular",
      defeitos: {
        tela: { nome: "Tela quebrada ou sem toque", peca: [180, 420], mao: 90, dias: [0, 1] },
        bateria: { nome: "Bateria dura pouco", peca: [90, 190], mao: 60, dias: [0, 1] },
        carga: { nome: "Não carrega", peca: [40, 160], mao: 80, dias: [1, 2] },
        liga: { nome: "Não liga", peca: [0, 380], mao: 150, dias: [2, 5] },
        molhou: { nome: "Molhou", peca: [0, 300], mao: 170, dias: [2, 5] },
        camera: { nome: "Câmera ou som", peca: [70, 220], mao: 80, dias: [1, 2] }
      }
    },
    tablet: {
      nome: "Tablet",
      defeitos: {
        tela: { nome: "Tela quebrada ou sem toque", peca: [220, 520], mao: 110, dias: [1, 3] },
        bateria: { nome: "Bateria dura pouco", peca: [120, 240], mao: 80, dias: [1, 2] },
        carga: { nome: "Não carrega", peca: [50, 180], mao: 90, dias: [1, 3] },
        liga: { nome: "Não liga", peca: [0, 420], mao: 160, dias: [2, 5] }
      }
    },
    notebook: {
      nome: "Notebook",
      defeitos: {
        lento: { nome: "Lento, trava, formatação com backup", peca: [0, 0], mao: 140, dias: [1, 1] },
        ssd: { nome: "Trocar por SSD ou mais memória", peca: [220, 480], mao: 90, dias: [1, 1] },
        esquenta: { nome: "Esquenta e desliga", peca: [60, 180], mao: 160, dias: [2, 3] },
        tela: { nome: "Tela quebrada ou com listras", peca: [380, 760], mao: 130, dias: [2, 5] },
        teclado: { nome: "Teclado ou dobradiça", peca: [120, 320], mao: 110, dias: [2, 4] },
        liga: { nome: "Não liga (placa)", peca: [0, 650], mao: 260, dias: [3, 5] }
      }
    },
    lavadora: {
      nome: "Máquina de lavar",
      defeitos: {
        centrifuga: { nome: "Não centrifuga ou não escoa", peca: [90, 260], mao: 160, dias: [3, 5] },
        enche: { nome: "Não enche ou não para de encher", peca: [70, 190], mao: 140, dias: [3, 5] },
        placa: { nome: "Painel ou placa sem resposta", peca: [220, 520], mao: 190, dias: [3, 7] },
        barulho: { nome: "Barulho alto ao bater roupa", peca: [150, 480], mao: 220, dias: [4, 7] }
      }
    },
    geladeira: {
      nome: "Geladeira",
      defeitos: {
        gela: { nome: "Não gela ou gela pouco", peca: [120, 520], mao: 220, dias: [3, 7] },
        gelo: { nome: "Acumula gelo (degelo)", peca: [90, 260], mao: 170, dias: [3, 5] },
        barulho: { nome: "Barulho ou vibração", peca: [60, 240], mao: 150, dias: [3, 5] },
        placa: { nome: "Placa ou termostato", peca: [150, 420], mao: 180, dias: [3, 7] }
      }
    },
    microondas: {
      nome: "Micro-ondas",
      defeitos: {
        esquenta: { nome: "Não esquenta", peca: [120, 260], mao: 120, dias: [2, 4] },
        painel: { nome: "Painel não responde", peca: [90, 220], mao: 110, dias: [2, 4] },
        prato: { nome: "Prato não gira ou faísca", peca: [40, 140], mao: 90, dias: [1, 3] }
      }
    },
    tv: {
      nome: "Televisão",
      defeitos: {
        imagem: { nome: "Sem imagem, com som", peca: [180, 460], mao: 160, dias: [3, 7] },
        liga: { nome: "Não liga", peca: [120, 380], mao: 150, dias: [3, 5] },
        linhas: { nome: "Linhas ou manchas na tela", peca: [0, 0], mao: 0, dias: [0, 0], semReparo: true }
      }
    }
  };

  var formOrc = $("#form-orc");
  if (formOrc) {
    var selAparelho = $("#orc-aparelho");
    var selDefeito = $("#orc-defeito");
    var selPorte = $("#orc-porte");
    var urgencia = "normal";
    var elFaixa = $("#orc-faixa");

    Object.keys(TABELA).forEach(function (k) {
      var op = document.createElement("option");
      op.value = k;
      op.textContent = TABELA[k].nome;
      selAparelho.appendChild(op);
    });

    function preencheDefeitos() {
      var ap = TABELA[selAparelho.value];
      selDefeito.innerHTML = "";
      var vazio = document.createElement("option");
      vazio.value = "";
      vazio.textContent = ap ? "Escolha o defeito" : "Escolha o aparelho primeiro";
      selDefeito.appendChild(vazio);
      selDefeito.disabled = !ap;
      if (!ap) return;
      Object.keys(ap.defeitos).forEach(function (k) {
        var op = document.createElement("option");
        op.value = k;
        op.textContent = ap.defeitos[k].nome;
        selDefeito.appendChild(op);
      });
    }

    function calcula() {
      var ap = TABELA[selAparelho.value];
      var def = ap && ap.defeitos[selDefeito.value];
      var mostrar = !!def;
      ["#orc-linhas", "#orc-nota", "#orc-acao"].forEach(function (s) { $(s).hidden = !mostrar; });
      elFaixa.hidden = !mostrar;
      if (!mostrar) {
        $("#orc-resumo").textContent = ap ? "Agora escolha o defeito." : "Escolha o aparelho e o defeito para ver a faixa.";
        return;
      }
      var porte = parseFloat(selPorte.value) || 1;
      var fator = urgencia === "rapido" ? 1.25 : 1;
      var pecaMin = def.peca[0] * porte;
      var pecaMax = def.peca[1] * porte;
      var mao = def.mao * (porte > 1.5 ? 1.2 : 1) * fator;
      var totalMin = (pecaMin + mao);
      var totalMax = (pecaMax + mao);
      var diasMin = def.dias[0];
      var diasMax = def.dias[1];
      if (urgencia === "rapido") { diasMin = Math.ceil(diasMin / 2); diasMax = Math.ceil(diasMax / 2); }

      $("#orc-resumo").textContent = ap.nome + " · " + def.nome.toLowerCase();
      elFaixa.classList.add("troca");
      window.setTimeout(function () {
        if (def.semReparo) {
          elFaixa.textContent = "";
          elFaixa.appendChild(document.createTextNode("Sem conserto"));
          var sm = document.createElement("small");
          sm.textContent = "Tela de TV com linhas ou manchas é o painel, e trocar o painel costuma custar mais que uma TV nova. Dizemos isso antes de você gastar com visita.";
          elFaixa.appendChild(sm);
        } else {
          elFaixa.textContent = "";
          elFaixa.appendChild(document.createTextNode(totalMin === totalMax ? reais(totalMin) : faixa(totalMin, totalMax)));
          var s2 = document.createElement("small");
          s2.textContent = "faixa total estimada, peça e mão de obra, antes do diagnóstico";
          elFaixa.appendChild(s2);
        }
        elFaixa.classList.remove("troca");
      }, 120);

      $("#orc-diag").textContent = def.semReparo ? "R$ 0" : "R$ 0 se aprovar";
      $("#orc-peca").textContent = def.semReparo ? "não compensa" : (pecaMax === 0 ? "sem peça" : (pecaMin === 0 ? "até " + reais(pecaMax) : faixa(pecaMin, pecaMax)));
      $("#orc-mao").textContent = def.semReparo ? "só orientação" : reais(mao);
      var prazo;
      if (def.semReparo) prazo = "na hora";
      else if (diasMax === 0) prazo = "mesmo dia";
      else if (diasMin === diasMax) prazo = diasMin + (diasMin === 1 ? " dia útil" : " dias úteis");
      else prazo = (diasMin === 0 ? "mesmo dia" : diasMin) + " a " + diasMax + " dias úteis";
      $("#orc-prazo").textContent = prazo;
      $("#orc-garantia").textContent = def.semReparo ? "não se aplica" : "90 dias";
    }

    selAparelho.addEventListener("change", function () { preencheDefeitos(); calcula(); });
    selDefeito.addEventListener("change", calcula);
    selPorte.addEventListener("change", calcula);
    $$(".segmento", formOrc).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".segmento", formOrc).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        urgencia = b.getAttribute("data-urgencia");
        calcula();
      });
    });
    formOrc.addEventListener("submit", function (ev) { ev.preventDefault(); calcula(); });
    preencheDefeitos();
  }

  /* ------------------------------------------------------------------ */
  /* 3. Agendamento de retirada, entrega ou visita                       */
  /* ------------------------------------------------------------------ */
  var formAg = $("#form-ag");
  if (formAg) {
    var tipo = "retirada";
    var diaEscolhido = null;
    var janelaEscolhida = null;
    var caixaDias = $("#ag-dias");
    var botoesJanela = $$(".janela", formAg);
    var TIPOS = { retirada: "Retirada em casa", entrega: "Entrega do aparelho pronto", visita: "Visita técnica" };

    /* Janelas fictícias já ocupadas: índice do dia útil -> lista de janelas */
    var OCUPADAS = { 0: ["08:00 às 10:00", "10:00 às 12:00"], 1: ["13:30 às 15:30"], 3: ["08:00 às 10:00"], 4: ["08:00 às 10:00", "10:00 às 12:00", "13:30 às 15:30", "15:30 às 18:00"], 5: ["15:30 às 18:00"] };
    var TODAS_JANELAS = $$(".janela", formAg).map(function (b) { return b.getAttribute("data-janela"); });
    var ladoAg = $("#ag-lado");

    /* Quantas janelas de um dia estão fora: as ocupadas e, no sábado, as da tarde */
    function janelasFora(d, i) {
      var ocupadas = OCUPADAS[i] || [];
      var sabado = d.getDay() === 6;
      return TODAS_JANELAS.filter(function (j) {
        return ocupadas.indexOf(j) !== -1 || (sabado && (j.indexOf("13:30") === 0 || j.indexOf("15:30") === 0));
      }).length;
    }

    var diasUteis = [];
    var cursor = somaDias(hoje, 1);
    while (diasUteis.length < 7) {
      if (cursor.getDay() !== 0) diasUteis.push(cursor);
      cursor = somaDias(cursor, 1);
    }
    diasUteis.forEach(function (d, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dia";
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("data-indice", String(i));
      var fora = janelasFora(d, i);
      var estadoDia = fora === 0 ? "livre" : (fora >= TODAS_JANELAS.length ? "dia cheio" : "parte ocupada");
      if (fora > 0) b.classList.add(fora >= TODAS_JANELAS.length ? "dia-cheio" : "dia-parcial");
      b.setAttribute("aria-label", dataLonga(d) + ", " + estadoDia);
      var s = document.createElement("span");
      s.textContent = DIAS_SEMANA[d.getDay()];
      var f = document.createElement("strong");
      f.textContent = dd(d.getDate());
      b.appendChild(s);
      b.appendChild(f);
      b.addEventListener("click", function () {
        $$(".dia", caixaDias).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        diaEscolhido = i;
        atualizaJanelas();
      });
      caixaDias.appendChild(b);
    });

    function atualizaJanelas() {
      var ocupadas = diaEscolhido === null ? [] : (OCUPADAS[diaEscolhido] || []);
      var sabado = diaEscolhido !== null && diasUteis[diaEscolhido].getDay() === 6;
      botoesJanela.forEach(function (b) {
        var j = b.getAttribute("data-janela");
        var indisponivel = ocupadas.indexOf(j) !== -1 || (sabado && j.indexOf("13:30") === 0) || (sabado && j.indexOf("15:30") === 0);
        b.disabled = indisponivel;
        if (indisponivel && janelaEscolhida === j) {
          janelaEscolhida = null;
          b.setAttribute("aria-pressed", "false");
        }
      });
      $("#erro-janela").textContent = "";
    }
    botoesJanela.forEach(function (b) {
      b.addEventListener("click", function () {
        botoesJanela.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        janelaEscolhida = b.getAttribute("data-janela");
        $("#erro-janela").textContent = "";
      });
    });

    $$(".segmento", formAg).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".segmento", formAg).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        tipo = b.getAttribute("data-tipo");
        $("#campo-os-ag").hidden = tipo !== "entrega";
        $("#ag-aparelho").closest(".campo").hidden = tipo === "entrega";
      });
    });

    function marcaErro(id, msg) {
      var campo = $("#" + id);
      var erro = $("#erro-" + id.replace("ag-", ""));
      if (id === "ag-os") erro = $("#erro-os-ag");
      if (erro) erro.textContent = msg || "";
      if (msg) campo.setAttribute("aria-invalid", "true"); else campo.removeAttribute("aria-invalid");
      return !msg;
    }
    function telefoneValido(v) {
      var dig = v.replace(/\D/g, "");
      return dig.length === 10 || dig.length === 11;
    }
    function formataTelefone(v) {
      var d = v.replace(/\D/g, "");
      if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
      if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
      return v;
    }

    formAg.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      var primeiro = null;
      function falha(id) { ok = false; if (!primeiro) primeiro = $("#" + id); }

      if (!marcaErro("ag-nome", $("#ag-nome").value.trim().length >= 2 ? "" : "Diga como podemos te chamar.")) falha("ag-nome");
      if (!marcaErro("ag-telefone", telefoneValido($("#ag-telefone").value) ? "" : "Telefone com DDD, 10 ou 11 números.")) falha("ag-telefone");
      if (!marcaErro("ag-bairro", $("#ag-bairro").value ? "" : "Escolha o bairro.")) falha("ag-bairro");
      if (!marcaErro("ag-rua", $("#ag-rua").value.trim().length >= 3 ? "" : "Rua e número para o técnico achar.")) falha("ag-rua");
      if (tipo === "entrega") {
        var cod = $("#ag-os").value.toUpperCase().trim();
        if (!marcaErro("ag-os", /^BK-\d{5}$/.test(cod) ? "" : "Número da OS no formato BK-00000.")) falha("ag-os");
        else $("#ag-os").value = cod;
      }
      if (diaEscolhido === null || !janelaEscolhida) {
        $("#erro-janela").textContent = diaEscolhido === null ? "Escolha um dia e uma janela de horário." : "Escolha uma janela de horário disponível.";
        ok = false;
        if (!primeiro) primeiro = diaEscolhido === null ? $(".dia", caixaDias) : botoesJanela.filter(function (b) { return !b.disabled; })[0];
      }
      if (!ok) { if (primeiro) primeiro.focus(); return; }

      var lista = $("#ag-resumo-lista");
      lista.innerHTML = "";
      var protocolo = "AG-" + String(100000 + Math.floor(Math.random() * 900000));
      var linhas = [
        ["Protocolo", protocolo],
        ["Serviço", TIPOS[tipo]],
        ["Dia", dataLonga(diasUteis[diaEscolhido])],
        ["Janela", janelaEscolhida],
        ["Nome", $("#ag-nome").value.trim()],
        ["Telefone", formataTelefone($("#ag-telefone").value)],
        ["Endereço", $("#ag-rua").value.trim() + ", " + $("#ag-bairro").value]
      ];
      if (tipo === "entrega") linhas.push(["OS", $("#ag-os").value]);
      else if ($("#ag-aparelho").value.trim()) linhas.push(["Aparelho", $("#ag-aparelho").value.trim()]);
      var custo = tipo === "visita" ? "R$ 80 (abatido se aprovar o reparo)" : "R$ 25 (grátis em reparo acima de R$ 400)";
      linhas.push(["Deslocamento", custo]);
      linhas.forEach(function (par) {
        var div = document.createElement("div");
        var dt = document.createElement("dt");
        dt.textContent = par[0];
        var ddEl = document.createElement("dd");
        ddEl.textContent = par[1];
        div.appendChild(dt);
        div.appendChild(ddEl);
        lista.appendChild(div);
      });
      var resumo = $("#ag-resumo");
      if (ladoAg) ladoAg.classList.add("agendado");
      resumo.classList.add("ativo");
      resumo.setAttribute("tabindex", "-1");
      resumo.focus();
      resumo.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    $("#ag-novo").addEventListener("click", function () {
      $("#ag-resumo").classList.remove("ativo");
      if (ladoAg) ladoAg.classList.remove("agendado");
      formAg.reset();
      $$("[aria-invalid]", formAg).forEach(function (c) { c.removeAttribute("aria-invalid"); });
      $$(".erro-msg", formAg).forEach(function (e) { e.textContent = ""; });
      $$(".dia", caixaDias).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      botoesJanela.forEach(function (o) { o.setAttribute("aria-pressed", "false"); o.disabled = false; });
      diaEscolhido = null;
      janelaEscolhida = null;
      $("#ag-nome").focus();
    });

    /* limpa a mensagem de erro assim que a pessoa corrige o campo */
    $$("input, select, textarea", formAg).forEach(function (c) {
      c.addEventListener("input", function () {
        if (c.getAttribute("aria-invalid") === "true") marcaErro(c.id, "");
      });
      c.addEventListener("change", function () {
        if (c.getAttribute("aria-invalid") === "true") marcaErro(c.id, "");
      });
    });

    $("#ag-telefone").addEventListener("blur", function () {
      if (telefoneValido(this.value)) this.value = formataTelefone(this.value);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Dúvidas com busca                                                */
  /* ------------------------------------------------------------------ */
  var faqCampo = $("#faq-campo");
  if (faqCampo) {
    var itens = $$("#faq-lista details");
    var contagem = $("#faq-contagem");
    var nadaFaq = $("#faq-nada");
    function semAcento(s) {
      return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    }
    var textos = itens.map(function (d) { return semAcento(d.textContent); });
    function filtra() {
      var termo = semAcento(faqCampo.value.trim());
      var vistos = 0;
      itens.forEach(function (d, i) {
        var mostra = !termo || textos[i].indexOf(termo) !== -1;
        d.hidden = !mostra;
        if (mostra) vistos++;
        if (termo && mostra && vistos === 1) d.open = true;
        if (!termo) d.open = false;
      });
      nadaFaq.classList.toggle("ativo", vistos === 0);
      if (!termo) {
        contagem.textContent = itens.length + " perguntas";
        contagem.innerHTML = "";
        var st = document.createElement("strong");
        st.textContent = String(itens.length);
        contagem.appendChild(st);
        contagem.appendChild(document.createTextNode(" perguntas"));
      } else {
        contagem.innerHTML = "";
        var s = document.createElement("strong");
        s.textContent = String(vistos);
        contagem.appendChild(s);
        contagem.appendChild(document.createTextNode(vistos === 1 ? " pergunta com \"" + faqCampo.value.trim() + "\"" : " perguntas com \"" + faqCampo.value.trim() + "\""));
      }
    }
    faqCampo.addEventListener("input", filtra);
    faqCampo.addEventListener("search", filtra);
    filtra();
  }
})();
