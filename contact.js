document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")
  const successMessage = document.getElementById("successMessage")

  // Form validation
  function validateField(field, errorElement, validationFn) {
    const isValid = validationFn(field.value)

    if (isValid) {
      field.classList.remove("is-invalid")
      errorElement.style.display = "none"
    } else {
      field.classList.add("is-invalid")
      errorElement.style.display = "block"
    }

    return isValid
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function validateRequired(value) {
    return value.trim() !== ""
  }

  // Real-time validation
  const fields = [
    {
      field: document.getElementById("firstName"),
      error: document.getElementById("firstNameError"),
      validator: validateRequired,
    },
    {
      field: document.getElementById("lastName"),
      error: document.getElementById("lastNameError"),
      validator: validateRequired,
    },
    {
      field: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validator: validateEmail,
    },
    {
      field: document.getElementById("subject"),
      error: document.getElementById("subjectError"),
      validator: validateRequired,
    },
    {
      field: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validator: validateRequired,
    },
  ]

  fields.forEach(({ field, error, validator }) => {
    field.addEventListener("blur", () => {
      validateField(field, error, validator)
    })

    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field, error, validator)
      }
    })
  })

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    let isFormValid = true

    // Validate all fields
    fields.forEach(({ field, error, validator }) => {
      const isValid = validateField(field, error, validator)
      if (!isValid) {
        isFormValid = false
      }
    })

    if (isFormValid) {
      // Simulate form submission
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...'

      setTimeout(() => {
        // Show success message
        successMessage.style.display = "block"

        // Reset form
        form.reset()

        // Reset button
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message'

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: "smooth", block: "center" })

        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = "none"
        }, 5000)
      }, 2000)
    } else {
      // Focus on first invalid field
      const firstInvalidField = form.querySelector(".is-invalid")
      if (firstInvalidField) {
        firstInvalidField.focus()
      }
    }
  })

  // Phone number formatting (optional enhancement)
  const phoneField = document.getElementById("phone")
  phoneField.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2")
    }
    e.target.value = value
  })
})
