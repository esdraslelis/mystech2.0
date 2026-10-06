(() => {
  const form = document.getElementById("access-form");
  const phone = document.getElementById("phone");
  const submit = document.getElementById("submit");
  const message = document.getElementById("message");
  const modal = document.getElementById("legal-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  const SUPABASE_URL = "https://ilccoqqhgrsqgbglyiha.supabase.co";
  const REGISTER_ENDPOINT = `${SUPABASE_URL}/functions/v1/register-lead`;

  const params = new URLSearchParams(window.location.search);
  const hotspot = {
    mac: params.get("mac") || "",
    ip: params.get("ip") || "",
    linkLogin: params.get("link-login") || params.get("link-login-only") || "",
    linkOrig: params.get("link-orig") || "",
    chapId: params.get("chap-id") || "",
    chapChallenge: params.get("chap-challenge") || ""
  };

  const legal = {
    terms: {
      title: "Termos de Uso",
      html: "<p>O acesso ao Wi-Fi do Bilisco é destinado aos clientes e visitantes do estabelecimento. O usuário se compromete a utilizar a conexão de forma lícita, responsável e sem prejudicar a rede ou terceiros.</p><p>O acesso poderá ser limitado ou interrompido para manutenção, segurança, uso abusivo ou necessidade operacional.</p>"
    },
    privacy: {
      title: "Política de Privacidade",
      html: "<p>Ao solicitar o acesso, você informa nome, sobrenome e celular. Esses dados podem ser utilizados para controle de acesso, segurança da rede e relacionamento do Bilisco com seus clientes, conforme a legislação aplicável.</p><p>Os dados não devem ser expostos publicamente e devem ser protegidos pelos sistemas responsáveis pelo armazenamento.</p>"
    }
  };

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  function normalizePhone(value) {
    return value.replace(/\D/g, "").slice(0, 11);
  }

  function formatPhone(value) {
    const d = normalizePhone(value);
    if (d.length <= 2) return d ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function buildTrialUrl() {
    if (!hotspot.linkLogin || !hotspot.mac) return null;
    const sep = hotspot.linkLogin.includes("?") ? "&" : "?";
    const dst = hotspot.linkOrig || "https://www.google.com/";
    return `${hotspot.linkLogin}${sep}dst=${encodeURIComponent(dst)}&username=${encodeURIComponent("T-" + hotspot.mac)}`;
  }

  phone.addEventListener("input", () => {
    phone.value = formatPhone(phone.value);
  });

  document.querySelectorAll("[data-modal]").forEach(button => {
    button.addEventListener("click", () => {
      const item = legal[button.dataset.modal];
      modalTitle.textContent = item.title;
      modalContent.innerHTML = item.html;
      modal.showModal();
    });
  });

  document.getElementById("close-modal").addEventListener("click", () => modal.close());

  form.addEventListener("submit", async event => {
    event.preventDefault();
    setMessage("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const digits = normalizePhone(phone.value);
    if (digits.length < 10) {
      setMessage("Informe um celular com DDD válido.", true);
      phone.focus();
      return;
    }

    const payload = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      phone: digits,
      acceptedTerms: true,
      hotspot
    };

    submit.disabled = true;
    submit.classList.add("loading");
    setMessage("Liberando seu acesso...");

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const trialUrl = buildTrialUrl();
      if (!trialUrl) {
        setMessage("Cadastro concluído. Falta a RB enviar os parâmetros de autenticação.", true);
        return;
      }

      setMessage("Cadastro concluído. Conectando...");
      window.location.assign(trialUrl);
    } catch (error) {
      console.error(error);
      setMessage("Não foi possível liberar o acesso agora. Tente novamente.", true);
    } finally {
      submit.disabled = false;
      submit.classList.remove("loading");
    }
  });
})();