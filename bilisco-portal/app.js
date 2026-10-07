(() => {
  if (window.location.hostname === "bilisco.pages.dev") {
    window.location.replace("https://bilisco.mystech.com.br" + window.location.pathname + window.location.search + window.location.hash);
    return;
  }
  const form = document.getElementById("access-form");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const phone = document.getElementById("phone");
  const submit = document.getElementById("submit");
  const message = document.getElementById("message");
  const modal = document.getElementById("legal-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const successToast = document.getElementById("success-toast");
  const accessCard = document.querySelector(".access-card");
  const connectedOffer = document.getElementById("connected-offer");
  const continueBrowsing = document.getElementById("continue-browsing");
  const androidConnect = document.getElementById("android-connect");
  const isAndroid = /Android/i.test(navigator.userAgent);

  const REGISTER_ENDPOINT = "https://ilccoqqhgrsqgbglyiha.supabase.co/functions/v1/register-lead";
  const PENDING_KEY = "bilisco-pending-lead";
  const VALID_DDDS = new Set(["11","12","13","14","15","16","17","18","19","21","22","24","27","28","31","32","33","34","35","37","38","41","42","43","44","45","46","47","48","49","51","53","54","55","61","62","63","64","65","66","67","68","69","71","73","74","75","77","79","81","82","83","84","85","86","87","88","89","91","92","93","94","95","96","97","98","99"]);

  const params = new URLSearchParams(window.location.search);
  const hotspot = {
    mac: params.get("mac") || "",
    ip: params.get("ip") || "",
    linkLogin: params.get("link-login") || params.get("link-login-only") || "",
    linkOrig: params.get("link-orig") || ""
  };

  const legal = {
    terms: { title: "Termos de Uso", html: "<p>O acesso ao Wi-Fi do Bilisco é destinado aos clientes e visitantes do estabelecimento. O usuário se compromete a utilizar a conexão de forma lícita, responsável e sem prejudicar a rede ou terceiros.</p><p>O acesso poderá ser limitado ou interrompido para manutenção, segurança, uso abusivo ou necessidade operacional.</p>" },
    privacy: { title: "Política de Privacidade", html: "<p>Ao solicitar o acesso, você informa nome, sobrenome e celular. Esses dados podem ser utilizados para controle de acesso, segurança da rede e relacionamento do Bilisco com seus clientes, conforme a legislação aplicável.</p><p>Os dados não devem ser expostos publicamente e devem ser protegidos pelos sistemas responsáveis pelo armazenamento.</p>" }
  };

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  function showSuccess(text = "Seu acesso foi liberado. Boa navegação.") {
    const small = successToast?.querySelector("small");
    if (small) small.textContent = text;
    successToast?.setAttribute("aria-hidden", "false");
    successToast?.classList.add("show");
  }

  function normalizeName(value) { return value.trim().replace(/\s+/g, " "); }
  function validName(value) {
    const name = normalizeName(value);
    if (name.length < 2 || name.length > 60) return false;
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(name)) return false;
    const letters = name.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
    return letters.length >= 2 && !/^(.)\1+$/i.test(letters);
  }
  function normalizePhone(value) { return value.replace(/\D/g, "").slice(0, 11); }
  function validPhone(digits) { return digits.length === 11 && VALID_DDDS.has(digits.slice(0, 2)) && digits.charAt(2) === "9" && !/^(\d)\1+$/.test(digits); }
  function formatPhone(value) {
    const d = normalizePhone(value);
    if (d.length <= 2) return d ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  async function savePendingLead() {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;
    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
        keepalive: true
      });
      if (response.ok || response.status === 409) localStorage.removeItem(PENDING_KEY);
    } catch (error) {
      console.warn("Lead pendente; nova tentativa será feita quando houver internet.", error);
    }
  }

  function submitHotspotLogin() {
    if (!hotspot.linkLogin) return false;
    const loginForm = document.createElement("form");
    loginForm.method = "POST";
    loginForm.action = hotspot.linkLogin;
    loginForm.style.display = "none";

    const fields = {
      username: "bilisco-portal",
      password: "BILISCO2026",
      dst: `${window.location.origin}${window.location.pathname}?connected=1`
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      loginForm.appendChild(input);
    });
    document.body.appendChild(loginForm);
    loginForm.submit();
    return true;
  }

  [firstName, lastName].forEach(input => input.addEventListener("input", () => {
    input.value = input.value.replace(/[0-9]/g, "");
    input.setCustomValidity("");
  }));
  phone.addEventListener("input", () => { phone.value = formatPhone(phone.value); phone.setCustomValidity(""); });

  document.querySelectorAll("[data-modal]").forEach(button => button.addEventListener("click", () => {
    const item = legal[button.dataset.modal];
    modalTitle.textContent = item.title;
    modalContent.innerHTML = item.html;
    modal.showModal();
  }));
  document.getElementById("close-modal").addEventListener("click", () => modal.close());

  form.addEventListener("submit", event => {
    event.preventDefault();
    setMessage("");
    const cleanFirst = normalizeName(firstName.value);
    const cleanLast = normalizeName(lastName.value);
    const digits = normalizePhone(phone.value);

    if (!validName(cleanFirst)) { firstName.setCustomValidity("Informe um nome válido, usando apenas letras."); firstName.reportValidity(); firstName.setCustomValidity(""); firstName.focus(); return; }
    if (!validName(cleanLast)) { lastName.setCustomValidity("Informe um sobrenome válido, usando apenas letras."); lastName.reportValidity(); lastName.setCustomValidity(""); lastName.focus(); return; }
    if (!validPhone(digits)) { phone.setCustomValidity("Informe um celular brasileiro válido com DDD e 9 dígitos."); phone.reportValidity(); phone.setCustomValidity(""); phone.focus(); return; }
    if (!document.getElementById("terms").checked) { setMessage("Aceite os Termos de Uso e a Política de Privacidade para continuar.", true); return; }
    if (!hotspot.linkLogin) { setMessage("Reconecte ao Wi-Fi para iniciar uma nova sessão.", true); return; }

    localStorage.setItem(PENDING_KEY, JSON.stringify({ firstName: cleanFirst, lastName: cleanLast, phone: digits, acceptedTerms: true, hotspot }));

    if (isAndroid) {
      form.style.display = "none";
      setMessage("");
      accessCard?.classList.add("is-connected", "android-preauth");
      connectedOffer?.setAttribute("aria-hidden", "false");

      const kicker = connectedOffer?.querySelector(".connected-kicker");
      const heading = connectedOffer?.querySelector("h2");
      const copy = connectedOffer?.querySelector(".connected-copy");
      if (kicker) kicker.textContent = "SEU ACESSO ESTÁ PRONTO";
      if (heading) heading.textContent = "Antes de navegar, conheça a i9.";
      if (copy) copy.textContent = "Internet fibra para sua casa a partir de R$ 79,90.";
      return;
    }

    submit.disabled = true;
    submit.classList.add("loading");
    setMessage("Conectando você ao Wi-Fi...");

    if (!submitHotspotLogin()) {
      submit.disabled = false;
      submit.classList.remove("loading");
      setMessage("Não foi possível iniciar a autenticação. Reconecte ao Wi-Fi e tente novamente.", true);
    }
  });

  androidConnect?.addEventListener("click", () => {
    androidConnect.disabled = true;
    androidConnect.textContent = "Liberando acesso...";
    if (!submitHotspotLogin()) {
      androidConnect.disabled = false;
      androidConnect.textContent = "Liberar meu acesso →";
    }
  });

  async function handleConnectedReturn() {
    if (params.get("connected") !== "1") return;

    let originalDestination = "";
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
      originalDestination = pending?.hotspot?.linkOrig || "";
    } catch (error) {
      console.warn("Não foi possível recuperar o destino original.", error);
    }

    if (continueBrowsing && originalDestination && /^https?:\/\//i.test(originalDestination)) {
      continueBrowsing.href = originalDestination;
    }

    form.style.display = "none";
    setMessage("");
    successToast?.classList.remove("show");
    successToast?.setAttribute("aria-hidden", "true");
    accessCard?.classList.add("is-connected");
    connectedOffer?.setAttribute("aria-hidden", "false");
    await savePendingLead();
  }

  window.addEventListener("online", savePendingLead);
  handleConnectedReturn();
})();
