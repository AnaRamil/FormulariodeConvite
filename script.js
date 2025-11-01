;(function () {
  ;("use strict")

  /* ---------- Utilities ---------- */
  const $ = (sel, ctx = document) =>
    Array.from((ctx || document).querySelectorAll(sel))
  const qs = (sel, ctx = document) => (ctx || document).querySelector(sel)

  function createErrorMessage(message) {
    const el = document.createElement("div")
    el.className = "error-message"
    el.textContent = message
    return el
  }

  /* ---------- Modal for image grid ---------- */
  function initImageModal() {
    // Criar elementos de imagem clicáveis para os temas
    const themeImages = $(".theme-image img")
    if (!themeImages.length) return

    // Create modal elements if not present
    let modal = qs(".modal")
    if (!modal) {
      modal = document.createElement("div")
      modal.className = "modal"
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="Fechar">×</button>
          <img class="modal-img" alt="preview" />
        </div>
      `
      document.body.appendChild(modal)
    }

    const modalImg = qs(".modal-img", modal)
    const closeBtn = qs(".modal-close", modal)

    function open(src, alt) {
      modal.classList.add("open")
      modalImg.src = src
      modalImg.alt = alt || ""
      document.body.style.overflow = "hidden"
    }

    function close() {
      modal.classList.remove("open")
      modalImg.src = ""
      document.body.style.overflow = ""
    }

    themeImages.forEach((img) => {
      img.style.cursor = "pointer"
      img.addEventListener("click", () => open(img.src, img.alt))
    })

    modal.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("modal-backdrop") ||
        e.target === closeBtn
      )
        close()
    })
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close()
    })
  }

  /* ---------- Segmented control (move background) ---------- */
  function initSegmentedControl() {
    const groups = $(".segmented-control")
    groups.forEach((group) => {
      const optionsContainer = qs(".segmented-options", group)
      if (!optionsContainer) return

      const options = $(".segmented-option", optionsContainer)
      const bg = qs(".segmented-background", optionsContainer)
      if (!options.length || !bg) return

      function activate(el) {
        options.forEach((o) => o.classList.remove("active", "inactive"))
        el.classList.add("active")
        options.forEach((o) => {
          if (o !== el) o.classList.add("inactive")
        })

        // move bg to element position
        const rect = el.getBoundingClientRect()
        const parentRect = optionsContainer.getBoundingClientRect()
        const left = rect.left - parentRect.left
        bg.style.width = `${rect.width}px`
        bg.style.transform = `translateX(${left}px)`

        // Atualizar valor no dataset se necessário
        const value = el.dataset.value
        if (value) {
          group.dataset.selectedValue = value
        }
      }

      // Initialize active
      const initial =
        qs(".segmented-option.active", optionsContainer) || options[0]
      if (initial) activate(initial)

      options.forEach((o) => {
        o.addEventListener("click", () => activate(o))
      })

      // Reposition on resize
      window.addEventListener("resize", () => {
        const act =
          qs(".segmented-option.active", optionsContainer) || options[0]
        if (act) activate(act)
      })
    })
  }

  /* ---------- Theme toggle (light/dark) ---------- */
  function initThemeToggle() {
    // Criar toggle switch funcional
    const toggleSwitches = $(".toggle-switch")
    if (!toggleSwitches.length) return

    function applyTheme(isDark) {
      document.documentElement.classList.toggle("theme-dark", isDark)
      document.documentElement.classList.toggle("theme-light", !isDark)
      try {
        localStorage.setItem("theme-dark", isDark ? "1" : "0")
      } catch (e) {}
    }

    // Restore saved theme
    try {
      const saved = localStorage.getItem("theme-dark")
      if (saved !== null) applyTheme(saved === "1")
    } catch (e) {}

    toggleSwitches.forEach((toggle) => {
      // Converter div em elemento clicável
      if (toggle.tagName === "DIV") {
        toggle.style.cursor = "pointer"

        // Inicializar estado baseado no tema atual
        const isDark = document.documentElement.classList.contains("theme-dark")
        if (isDark) {
          toggle.classList.add("active")
        }

        toggle.addEventListener("click", () => {
          const willBeDark = !toggle.classList.contains("active")
          toggle.classList.toggle("active", willBeDark)
          applyTheme(willBeDark)
        })
      }
    })
  }

  /* ---------- Color selection (apply CSS variable) ---------- */
  function initColorSelection() {
    const swatches = $(".color-option")
    if (!swatches.length) return

    const colorOptions = document.querySelectorAll(".color-option")

    colorOptions.forEach((option) => {
      option.addEventListener("click", function () {
        colorOptions.forEach((opt) => opt.classList.remove("selected"))
        this.classList.add("selected")

        const color = this.getAttribute("data-color")
        // cor selecionada para personalizar o convite
        console.log("Cor selecionada:", color)
      })
    })

    function setAccent(color) {
      document.documentElement.getAttribute.setProperty("--accent-color", color)
      // Aplicar a cor aos elementos que usam as cores da marca
      document.documentElement.style.setProperty("--brand-light", color)
      document.documentElement.style.setProperty("--brand-dark", color)
      document.documentElement.style.setProperty("--brand-mid", color)

      try {
        localStorage.setItem("accent-color", color)
      } catch (e) {}
    }

    // Restore saved color
    try {
      const saved = localStorage.getItem("accent-color")
      if (saved) setAccent(saved)
    } catch (e) {}

    swatches.forEach((s) => {
      s.addEventListener("click", () => {
        const color = s.dataset.color
        if (color) {
          setAccent(color)
          // mark active
          swatches.forEach((x) => x.classList.remove("selected"))
          s.classList.add("selected")
        }
      })
    })
  }

  /* ---------- Theme selection (only one active) ---------- */
  function initThemeSelection() {
    const items = $(".theme-option")
    if (!items.length) return

    items.forEach((it) => {
      it.addEventListener("click", () => {
        items.forEach((x) => x.classList.remove("selected"))
        it.classList.add("selected")

        // Armazenar tema selecionado se necessário
        const theme = it.dataset.theme
        if (theme) {
          try {
            localStorage.setItem("selected-theme", theme)
          } catch (e) {}
        }
      })
    })

    // Restore saved theme
    try {
      const saved = localStorage.getItem("selected-theme")
      if (saved) {
        const savedItem = qs(`[data-theme="${saved}"]`)
        if (savedItem) {
          items.forEach((x) => x.classList.remove("selected"))
          savedItem.classList.add("selected")
        }
      }
    } catch (e) {}
  }

  /* ---------- File upload validation ---------- */
  function initFileUploads() {
    const uploads = $("input.file-upload[type=file]")
    if (!uploads.length) return

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
    const maxBytes = 5 * 1024 * 1024 // 5MB

    uploads.forEach((input) => {
      const parent = input.parentElement
      if (!parent) return

      // Criar elemento de mensagem se não existir
      let msgEl = qs(".file-error", parent)
      if (!msgEl) {
        msgEl = document.createElement("div")
        msgEl.className = "file-error error-message"
        parent.appendChild(msgEl)
      }

      input.addEventListener("change", () => {
        const file = input.files && input.files[0]
        if (!file) {
          msgEl.textContent = ""
          return
        }

        if (!allowed.includes(file.type)) {
          msgEl.textContent = "Tipo de arquivo não suportado."
          input.value = ""
          return
        }
        if (file.size > maxBytes) {
          msgEl.textContent = "Arquivo muito grande (máx 5MB)."
          input.value = ""
          return
        }
        msgEl.textContent = ""
      })
    })
  }

  /* ---------- Checkbox group validation ---------- */
  function initCheckboxGroups() {
    const groups = $(".checkbox-group")
    if (!groups.length) return

    groups.forEach((group) => {
      const checkboxItems = $(".checkbox-item", group)
      const min = parseInt(group.dataset.min || "1", 10) || 1

      // Encontrar ou criar elemento de erro
      let errorEl = qs(".checkbox-error", group)
      if (!errorEl) {
        errorEl = document.createElement("div")
        errorEl.className = "checkbox-error error-message"
        group.appendChild(errorEl)
      }

      checkboxItems.forEach((item) => {
        const realCheckbox = qs(".real-checkbox", item)
        const customCheckbox = qs(".custom-checkbox", item)

        if (realCheckbox && customCheckbox) {
          // Sincronizar estado inicial
          if (realCheckbox.checked) {
            customCheckbox.classList.add("checked")
          } else {
            customCheckbox.classList.remove("checked")
          }

          // Tornar todo o item clicável
          item.addEventListener("click", (e) => {
            // Não disparar se clicou diretamente no checkbox real
            if (e.target !== customCheckbox) {
              customCheckbox.checked = !customCheckbox.checked
              customCheckbox.dispatchEvent(
                new Event("change", { bubbles: true })
              )
            }
          })

          // Sincronizar mudanças no checkbox real
          realCheckbox.addEventListener("change", function () {
            customCheckbox.classList.toggle("checked", this.checked)
            validateCheckboxGroup(group)
          })
        }
      })

      function validateCheckboxGroup() {
        const realCheckboxes = $(".real-checkbox", group)
        const requiredCheckboxes = realCheckboxes.filter((cb) =>
          cb.hasAttribute("required")
        )
        const checked = realCheckboxes.filter((b) => b.checked).length
        const requiredChecked = requiredCheckboxes.filter(
          (b) => b.checked
        ).length

        // Validar checkboxes obrigatórios
        if (
          requiredCheckboxes.length > 0 &&
          requiredChecked < requiredCheckboxes.length
        ) {
          errorEl.textContent = "Aceite os termos obrigatórios para continuar."
          errorEl.style.display = "block"
          return false
        }

        // Validar quantidade mínima
        if (checked < min) {
          errorEl.textContent = `Selecione ao menos ${min} opção(ões).`
          errorEl.style.display = "block"
          return false
        }

        errorEl.textContent = ""
        errorEl.style.display = "none"
        return true
      }

      // Validar inicialmente
      validateCheckboxGroup()
    })
  }

  /* ---------- Form validation ---------- */
  function initFormValidation() {
    const forms = $("form")
    if (!forms.length) return

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRe = /^[0-9 ()+\-\.]{10,}$/ // Mais restritivo para números brasileiros

    forms.forEach((form) => {
      // Remover classe error inicial do campo nome
      const nameField = qs("#contact-name", form)
      if (nameField) {
        nameField.classList.remove("error")
      }

      form.addEventListener("submit", (e) => {
        const valid = validateForm(form)
        if (!valid) {
          e.preventDefault()
          // Scroll para o primeiro erro
          const firstError =
            qs(".invalid", form) || qs(".error-message:not(:empty)", form)
          if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }
      })

      // Live validation for inputs
      ;["input", "change", "blur"].forEach((ev) => {
        form.addEventListener(
          ev,
          (event) => {
            const t = event.target
            if (!t || !(t instanceof HTMLElement)) return
            if (t.matches("[required]")) validateField(t)
            if (t.matches('[type="email"]')) validateEmail(t)
            if (t.matches('[type="tel"]')) validatePhone(t)
            if (t.matches('[type="date"]')) validateDate(t)
          },
          true
        )
      })

      function validateField(field) {
        const parent = field.parentElement
        let existing =
          parent &&
          qs(".error-message:not(.checkbox-error):not(.file-error)", parent)

        // Remover apenas se for mensagem de campo obrigatório
        if (existing && existing.textContent === "Campo obrigatório") {
          existing.remove()
          existing = null
        }

        if (field.required) {
          const empty =
            field.type === "checkbox" || field.type === "radio"
              ? !field.checked
              : !field.value.trim()
          if (empty) {
            if (!existing) {
              parent &&
                parent.appendChild(createErrorMessage("Campo obrigatório"))
            }
            field.classList.add("invalid")
            return false
          }
        }
        field.classList.remove("invalid")
        if (existing && existing.textContent === "Campo obrigatório") {
          existing.remove()
        }
        return true
      }

      function validateEmail(field) {
        const parent = field.parentElement
        if (!parent) return true
        let existing = qs(
          ".error-message:not(.checkbox-error):not(.file-error)",
          parent
        )

        if (existing && existing.textContent === "Email inválido") {
          existing.remove()
          existing = null
        }

        if (!field.value.trim()) return true // required handled elsewhere
        if (!emailRe.test(field.value.trim())) {
          if (!existing) {
            parent.appendChild(createErrorMessage("Email inválido"))
          }
          field.classList.add("invalid")
          return false
        }
        field.classList.remove("invalid")
        if (existing && existing.textContent === "Email inválido") {
          existing.remove()
        }
        return true
      }

      function validatePhone(field) {
        const parent = field.parentElement
        if (!parent) return true
        let existing = qs(
          ".error-message:not(.checkbox-error):not(.file-error)",
          parent
        )

        if (existing && existing.textContent === "Telefone inválido") {
          existing.remove()
          existing = null
        }

        if (!field.value.trim()) return true
        const cleanPhone = field.value.replace(/\D/g, "")
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
          if (!existing) {
            parent.appendChild(createErrorMessage("Telefone inválido"))
          }
          field.classList.add("invalid")
          return false
        }
        field.classList.remove("invalid")
        if (existing && existing.textContent === "Telefone inválido") {
          existing.remove()
        }
        return true
      }

      function validateDate(field) {
        const parent = field.parentElement
        if (!parent) return true
        let existing = qs(
          ".error-message:not(.checkbox-error):not(.file-error)",
          parent
        )

        if (existing && existing.textContent === "Data inválida") {
          existing.remove()
          existing = null
        }

        if (!field.value) return true
        const d = new Date(field.value)
        if (isNaN(d.getTime())) {
          if (!existing) {
            parent.appendChild(createErrorMessage("Data inválida"))
          }
          field.classList.add("invalid")
          return false
        }
        field.classList.remove("invalid")
        if (existing && existing.textContent === "Data inválida") {
          existing.remove()
        }
        return true
      }

      function validateForm(formEl) {
        // remove existing generic messages (exceto checkbox e file errors)
        Array.from(
          formEl.querySelectorAll(
            ".error-message:not(.checkbox-error):not(.file-error)"
          )
        ).forEach((n) => n.remove())

        const requireds = Array.from(formEl.querySelectorAll("[required]"))
        let ok = true

        requireds.forEach((r) => {
          if (!validateField(r)) ok = false
        })

        // email/phone/date specific checks
        Array.from(formEl.querySelectorAll('[type="email"]')).forEach((f) => {
          if (f.value.trim() && !validateEmail(f)) ok = false
        })
        Array.from(formEl.querySelectorAll('[type="tel"]')).forEach((f) => {
          if (f.value.trim() && !validatePhone(f)) ok = false
        })
        Array.from(formEl.querySelectorAll('[type="date"]')).forEach((f) => {
          if (f.value && !validateDate(f)) ok = false
        })

        // checkbox groups
        const groups = Array.from(formEl.querySelectorAll(".checkbox-group"))
        groups.forEach((g) => {
          const min = parseInt(g.dataset.min || "1", 10) || 1
          const boxes = Array.from(g.querySelectorAll(".real-checkbox"))
          const checked = boxes.filter((b) => b.checked).length
          const errorEl = qs(".checkbox-error", g)

          if (checked < min) {
            if (errorEl) {
              errorEl.textContent = `Selecione ao menos ${min}.`
            }
            ok = false
          } else if (errorEl) {
            errorEl.textContent = ""
          }
        })

        return ok
      }
    })
  }

  /* ---------- Initialize all ---------- */
  function initAll() {
    initImageModal()
    initSegmentedControl()
    initThemeToggle()
    initColorSelection()
    initThemeSelection()
    initFileUploads()
    initCheckboxGroups()
    initFormValidation()

    console.log("Festivite - JavaScript inicializado com sucesso!")
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll)
  } else {
    initAll()
  }

  // Export validator for manual calls if needed
  window.FormUtils = {
    validateForm: function (formEl) {
      return formEl ? validateForm(formEl) : false
    },
  }
})()
