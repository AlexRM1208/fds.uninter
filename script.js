document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupAccordion();
  setupGalleryModal();
  setupAttractionFilters();
  setupContactForm();
});

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-principal");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupAccordion() {
  const accordions = document.querySelectorAll("[data-accordion]");

  accordions.forEach((accordion) => {
    const buttons = accordion.querySelectorAll(".accordion-button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".accordion-item");
        const content = item.querySelector(".accordion-content");
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        buttons.forEach((otherButton) => {
          const otherItem = otherButton.closest(".accordion-item");
          const otherContent = otherItem.querySelector(".accordion-content");

          otherButton.setAttribute("aria-expanded", "false");
          otherContent.hidden = true;
        });

        button.setAttribute("aria-expanded", String(!isExpanded));
        content.hidden = isExpanded;
      });
    });
  });
}

function setupGalleryModal() {
  const cards = document.querySelectorAll(".gallery-card");

  if (!cards.length) return;

  let backdrop = null;

  function closeModal() {
    if (backdrop) {
      backdrop.remove();
      backdrop = null;
      document.body.style.overflow = "";
    }
  }

  function openModal(title, image) {
    closeModal();

    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
          <h2 id="modalTitle">${escapeHTML(title)}</h2>
          <button class="modal-close" type="button" aria-label="Fechar imagem">×</button>
        </div>
        <img src="${escapeHTML(image)}" alt="${escapeHTML(title)}" />
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";

    const closeButton = backdrop.querySelector(".modal-close");

    closeButton.focus();
    closeButton.addEventListener("click", closeModal);

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeModal();
    });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.dataset.title || "Imagem de Curitiba";
      const image = card.dataset.image;

      if (image) openModal(title, image);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function setupAttractionFilters() {
  const filters = document.querySelectorAll(".filter-chip");
  const attractions = document.querySelectorAll(".attraction-card");

  if (!filters.length || !attractions.length) return;

  filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const selectedFilter = filterButton.dataset.filter;

      filters.forEach((button) => button.classList.remove("active"));
      filterButton.classList.add("active");

      attractions.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = selectedFilter === "todos" || selectedFilter === category;

        card.hidden = !shouldShow;
      });
    });
  });
}

function setupContactForm() {
  const form = document.querySelector("#contactForm");

  if (!form) return;

  const fields = {
    nome: {
      input: form.querySelector("#nome"),
      error: form.querySelector("#nomeError"),
      validate(value) {
        if (value.trim().length < 3) return "Informe um nome com pelo menos 3 caracteres.";
        return "";
      }
    },
    email: {
      input: form.querySelector("#email"),
      error: form.querySelector("#emailError"),
      validate(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value.trim())) return "Informe um e-mail válido.";
        return "";
      }
    },
    assunto: {
      input: form.querySelector("#assunto"),
      error: form.querySelector("#assuntoError"),
      validate(value) {
        if (!value) return "Selecione um assunto.";
        return "";
      }
    },
    mensagem: {
      input: form.querySelector("#mensagem"),
      error: form.querySelector("#mensagemError"),
      validate(value) {
        if (value.trim().length < 10) return "Escreva uma mensagem com pelo menos 10 caracteres.";
        return "";
      }
    }
  };

  const status = form.querySelector("#formStatus");

  Object.values(fields).forEach(({ input, error, validate }) => {
    input.addEventListener("input", () => {
      const message = validate(input.value);

      error.textContent = message;
      input.setAttribute("aria-invalid", String(Boolean(message)));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let hasError = false;

    Object.values(fields).forEach(({ input, error, validate }) => {
      const message = validate(input.value);

      error.textContent = message;
      input.setAttribute("aria-invalid", String(Boolean(message)));

      if (message) hasError = true;
    });

    if (hasError) {
      status.textContent = "Confira os campos destacados antes de enviar.";
      return;
    }

    status.textContent = "Mensagem enviada com sucesso! Obrigado pela sugestão.";
    form.reset();

    Object.values(fields).forEach(({ input }) => {
      input.setAttribute("aria-invalid", "false");
    });
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
