(function () {
  "use strict";

  // ES5 + XMLHttpRequest: compatibilidade com navegadores antigos de maquininhas.
  var form = document.getElementById("access-form");
  if (!form || !window.XMLHttpRequest) return;
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var phone = document.getElementById("phone");
  var submit = document.getElementById("submit");
  var message = document.getElementById("message");
  var modal = document.getElementById("legal-modal");
  var modalTitle = document.getElementById("modal-title");
  var modalContent = document.getElementById("modal-content");
  var successToast = document.getElementById("success-toast");
  var accessCard = document.querySelector(".access-card");
  var connectedOffer = document.getElementById("connected-offer");
  var androidConnect = document.getElementById("android-connect");
  var REGISTER_ENDPOINT = "https://ilccoqqhgrsqgbglyiha.supabase.co/functions/v1/buteco360-register";
  var PORTAL_URL = "https://buteco360.mystech.com.br/";
  var PENDING_KEY = "b360-pending-access";
  var START_KEY = "b360-auth-started";
  var VALID_DDDS = "11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99";
  var credentials = null;
  var submitting = false;

  function qs(name) {
    var search = window.location.search.replace(/^\?/, "").split("&");
    var i, parts, key;
    for (i = 0; i < search.length; i += 1) {
      parts = search[i].split("=");
      try {
        key = decodeURIComponent((parts.shift() || "").replace(/\+/g, " "));
        if (key === name) return decodeURIComponent(parts.join("=").replace(/\+/g, " "));
      } catch (ignore) {}
    }
    return "";
  }

  var hotspot = {
    mac: qs("mac"),
    ip: qs("ip"),
    linkLogin: qs("link-login") || qs("link-login-only"),
    linkOrig: qs("link-orig")
  };

  function trim(s) { return String(s || "").replace(/^\s+|\s+$/g, "").replace(/\s+/g, " "); }
  function onlyDigits(s) { return String(s || "").replace(/\D/g, ""); }
  function addClass(el, name) {
    if (el && (" " + el.className + " ").indexOf(" " + name + " ") < 0) el.className += " " + name;
  }
  function removeClass(el, name) {
    if (el) el.className = (" " + el.className + " ").replace(new RegExp(" " + name + " ", "g"), " ").replace(/^\s+|\s+$/g, "");
  }
  function setText(el, val) { if (el) el.textContent = val; }
  function setMessage(val, error) {
    setText(message, val);
    if (error) addClass(message, "error");
    else removeClass(message, "error");
  }
  function setBusy(busy, val) {
    submitting = busy;
    submit.disabled = busy;
    if (busy) addClass(submit, "loading");
    else removeClass(submit, "loading");
    if (val) setMessage(val);
  }
  function readStored(key) { try { return sessionStorage.getItem(key); } catch (ignore) { return null; } }
  function writeStored(key, val) { try { sessionStorage.setItem(key, val); return true; } catch (ignore) { return false; } }
  function eraseStored(key) { try { sessionStorage.removeItem(key); } catch (ignore) {} }
  function readPending() {
    var value = readStored(PENDING_KEY);
    if (!value) return null;
    try { return JSON.parse(value); } catch (ignore) { return null; }
  }
  function savePending(userpass, attempts) {
    writeStored(PENDING_KEY, JSON.stringify({
      at: new Date().getTime(),
      mac: hotspot.mac,
      ip: hotspot.ip,
      linkLogin: hotspot.linkLogin,
      credentials: userpass,
      attempts: attempts || 0
    }));
  }

  function onEvent(el, type, fn) {
    if (!el) return;
    if (el.addEventListener) el.addEventListener(type, fn, false);
    else if (el.attachEvent) el.attachEvent("on" + type, fn);
  }

  function validName(value) {
    var letters = trim(value).replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
    return value.length >= 2 && value.length <= 60 &&
      /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value) &&
      letters.length >= 2 && !/^(.)\1+$/i.test(letters);
  }
  function validPhone(value) {
    return /^\d{11}$/.test(value) &&
      ("," + VALID_DDDS + ",").indexOf("," + value.substr(0, 2) + ",") !== -1 &&
      value.charAt(2) === "9" && !/^(\d)\1+$/.test(value);
  }
  function formatPhone(value) {
    var d = onlyDigits(value).substr(0, 11);
    if (d.length <= 2) return d ? "(" + d : "";
    if (d.length <= 7) return "(" + d.substr(0, 2) + ") " + d.substr(2);
    return "(" + d.substr(0, 2) + ") " + d.substr(2, 5) + "-" + d.substr(7);
  }

  function isEventIp(ip) {
    var m = /^10\.77\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
    return !!m && Number(m[1]) <= 7 && Number(m[2]) <= 255;
  }

  function allowedRouterLogin(url) {
    var parser = document.createElement("a");
    parser.href = url;
    var hostname = String(parser.hostname || "").toLowerCase();
    var protocol = String(parser.protocol || "").toLowerCase();
    var path = String(parser.pathname || "");
    return (protocol === "http:" || protocol === "https:") &&
      (hostname === "10.77.0.1" ||
        hostname === "login.buteco360.local" ||
        hostname === "login.buteco360.mystech.com.br") &&
      /\/login\/?$/.test(path) && !/\/[^/]+\/login\/?$/.test(path);
  }

  // A CCR1009 usa 10.77.0.1/21; IP direto evita DNS incompatível no browser da maquininha.
  function routerLoginUrl() {
    if (isEventIp(hotspot.ip)) return "http://10.77.0.1/login";
    if (hotspot.linkLogin && allowedRouterLogin(hotspot.linkLogin)) return hotspot.linkLogin;
    return "";
  }

  function showPending(userpass, detail) {
    credentials = userpass;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    addClass(accessCard, "is-connected");
    addClass(accessCard, "android-preauth");
    if (connectedOffer) connectedOffer.setAttribute("aria-hidden", "false");
    setText(connectedOffer ? connectedOffer.querySelector(".connected-kicker") : null, "CADASTRO CONFIRMADO");
    setText(connectedOffer ? connectedOffer.querySelector("h2") : null, "Seu Wi-Fi está quase pronto.");
    setText(connectedOffer ? connectedOffer.querySelector(".connected-copy") : null,
      detail || "Se o Wi-Fi não liberou automaticamente, toque abaixo para tentar novamente.");
    if (androidConnect) {
      androidConnect.style.display = "";
      androidConnect.disabled = false;
      androidConnect.textContent = "Tentar liberar meu Wi-Fi";
    }
    window.scrollTo(0, 0);
  }

  function submitHotspotLogin(userpass) {
    if (!userpass || !userpass.username || !userpass.password) return false;
    var url = routerLoginUrl();
    if (!url) return false;
    var previous = readPending();
    savePending(userpass, previous && previous.at && new Date().getTime() - previous.at < 900000 ? (previous.attempts || 0) + 1 : 1);
    writeStored(START_KEY, String(new Date().getTime()));

    var loginForm = document.createElement("form");
    loginForm.method = "POST";
    loginForm.action = url;
    loginForm.style.display = "none";
    loginForm.acceptCharset = "UTF-8";
    var fields = {
      username: userpass.username,
      password: userpass.password,
      dst: PORTAL_URL + "?connected=1"
    };
    var key, field;
    for (key in fields) {
      if (fields.hasOwnProperty(key)) {
        field = document.createElement("input");
        field.type = "hidden";
        field.name = key;
        field.value = fields[key];
        loginForm.appendChild(field);
      }
    }
    document.body.appendChild(loginForm);
    loginForm.submit();
    return true;
  }

  function attemptLogin(userpass) {
    showPending(userpass, "Cadastro confirmado. Autenticando seu aparelho na rede do evento...");
    if (androidConnect) {
      androidConnect.disabled = true;
      androidConnect.textContent = "Conectando ao Wi-Fi...";
    }
    // Pequeno intervalo para renderizar confirmação e salvar o voucher antes da navegação.
    window.setTimeout(function () {
      if (!submitHotspotLogin(userpass)) {
        showPending(userpass, "Cadastro salvo, mas o endereço do Hotspot não foi recebido. Reconecte-se ao Wi-Fi do evento.");
        if (androidConnect) androidConnect.textContent = "Tentar novamente";
      }
    }, 180);
  }

  function restorePending() {
    var pending = readPending();
    if (!pending) return;
    if (new Date().getTime() - pending.at > 900000) {
      eraseStored(PENDING_KEY);
      return;
    }
    if (hotspot.mac && pending.mac && hotspot.mac.toLowerCase() !== pending.mac.toLowerCase()) return;
    if (!hotspot.ip && pending.ip) hotspot.ip = pending.ip;
    if (!hotspot.linkLogin && pending.linkLogin) hotspot.linkLogin = pending.linkLogin;
    if (pending.credentials && pending.credentials.username && pending.credentials.password) {
      showPending(pending.credentials,
        pending.attempts > 0 ?
        "Seu cadastro já está salvo. O roteador voltou ao portal sem confirmar a conexão. Toque abaixo para tentar novamente, sem preencher os dados." :
        "Cadastro salvo. Toque abaixo para liberar a conexão.");
    }
  }

  function showSuccess(verified) {
    eraseStored(PENDING_KEY);
    eraseStored(START_KEY);
    if (androidConnect) androidConnect.style.display = "none";
    if (form) form.style.display = "none";
    addClass(accessCard, "is-connected");
    removeClass(accessCard, "android-preauth");
    if (connectedOffer) connectedOffer.setAttribute("aria-hidden", "false");
    setText(connectedOffer ? connectedOffer.querySelector(".connected-kicker") : null, verified ? "ACESSO AUTORIZADO" : "AUTENTICAÇÃO ENVIADA");
    setText(connectedOffer ? connectedOffer.querySelector("h2") : null, verified ? "Pronto, boa navegação!" : "Confira sua conexão.");
    setText(connectedOffer ? connectedOffer.querySelector(".connected-copy") : null,
      verified ? "A autenticação retornou do roteador. Aproveite o Wi-Fi do Buteco 360." :
      "O roteador retornou ao portal. Teste abrir um site para confirmar se a internet foi liberada.");
    if (verified && successToast) {
      successToast.setAttribute("aria-hidden", "false");
      addClass(successToast, "show");
    }
  }

  if (qs("connected") === "1") {
    var started = Number(readStored(START_KEY) || 0);
    showSuccess(started > 0 && new Date().getTime() - started < 600000);
  } else {
    restorePending();
  }

  onEvent(firstName, "input", function () { firstName.value = firstName.value.replace(/[0-9]/g, ""); });
  onEvent(lastName, "input", function () { lastName.value = lastName.value.replace(/[0-9]/g, ""); });
  onEvent(phone, "input", function () { phone.value = formatPhone(phone.value); });

  onEvent(form, "submit", function (event) {
    event = event || window.event;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;
    if (submitting) return false;
    setMessage("");
    var f = trim(firstName.value);
    var l = trim(lastName.value);
    var p = onlyDigits(phone.value);
    if (!validName(f)) { setMessage("Informe um nome válido.", true); firstName.focus(); return false; }
    if (!validName(l)) { setMessage("Informe um sobrenome válido.", true); lastName.focus(); return false; }
    if (!validPhone(p)) { setMessage("Informe um celular válido com DDD.", true); phone.focus(); return false; }
    if (!document.getElementById("terms").checked) { setMessage("Aceite os Termos de Uso e a Política de Privacidade.", true); return false; }

    setBusy(true, "Registrando cadastro e liberando a internet...");
    var req = new XMLHttpRequest();
    try {
      req.open("POST", REGISTER_ENDPOINT, true);
      req.setRequestHeader("Content-Type", "application/json");
      req.timeout = 20000;
      var finished = false;
      function failure(text) {
        if (finished) return;
        finished = true;
        setBusy(false);
        setMessage(text || "Não foi possível concluir o cadastro. Tente novamente.", true);
      }
      req.onreadystatechange = function () {
        if (req.readyState !== 4 || finished) return;
        var data = {};
        try { data = JSON.parse(req.responseText || "{}"); } catch (ignore) {}
        if (req.status < 200 || req.status >= 300 || !data.ok) {
          failure("Falha ao registrar. Os dados foram mantidos; tente novamente.");
          return;
        }
        finished = true;
        setBusy(false);
        if (!data.hotspot_login || !data.hotspot_login.username || !data.hotspot_login.password) {
          setMessage("Cadastro salvo. A liberação no roteador está pendente.", true);
          return;
        }
        savePending(data.hotspot_login, 0);
        attemptLogin(data.hotspot_login);
      };
      req.onerror = function () { failure("Sem comunicação com o cadastro. Mantenha o Wi-Fi conectado e tente novamente."); };
      req.ontimeout = function () { failure("A conexão com o cadastro demorou. Tente novamente."); };
      req.send(JSON.stringify({
        firstName: f, lastName: l, phone: p, acceptedTerms: true, hotspot: hotspot
      }));
    } catch (error) {
      setBusy(false);
      setMessage("Seu navegador não conseguiu enviar o cadastro. Tente novamente.", true);
    }
    return false;
  });

  onEvent(androidConnect, "click", function () {
    if (credentials) attemptLogin(credentials);
  });

  var termsHtml = "<p>O acesso ao Wi-Fi do evento é destinado aos clientes e visitantes do estabelecimento. O usuário se compromete a utilizar a conexão de forma lícita, responsável e sem prejudicar a rede ou terceiros.</p><p>O acesso poderá ser limitado ou interrompido para manutenção, segurança, uso abusivo ou necessidade operacional.</p>";
  var privacyHtml = "<p>Ao solicitar o acesso, você informa nome, sobrenome e celular. Esses dados podem ser utilizados para controle de acesso, segurança da rede e relacionamento do evento com seus clientes, conforme a legislação aplicável.</p><p>Os dados não devem ser expostos publicamente e devem ser protegidos pelos sistemas responsáveis pelo armazenamento.</p>";
  var links = document.querySelectorAll("[data-modal]");
  var i;
  for (i = 0; i < links.length; i += 1) {
    (function (button) {
      onEvent(button, "click", function () {
        var isTerms = button.getAttribute("data-modal") === "terms";
        var html = isTerms ? termsHtml : privacyHtml;
        if (modal && modal.showModal) {
          setText(modalTitle, isTerms ? "Termos de Uso" : "Política de Privacidade");
          modalContent.innerHTML = html;
          modal.showModal();
        } else {
          window.alert(isTerms ?
            "O acesso ao Wi-Fi deve ser usado de forma lícita e responsável." :
            "Nome, sobrenome e celular serão usados para controle do acesso e relacionamento do evento.");
        }
      });
    })(links[i]);
  }
  onEvent(document.getElementById("close-modal"), "click", function () {
    if (modal && modal.close) modal.close();
  });
})();