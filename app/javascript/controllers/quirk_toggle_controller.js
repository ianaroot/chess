import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggle"]

  connect() {
    this.updateStyles()
  }

  toggle(event) {
    this.updateStyles()
  }

  updateStyles() {
    this.toggleTargets.forEach(checkbox => {
      const label = checkbox.closest("label")
      if (label) {
        if (checkbox.checked) {
          label.classList.add("bg-amber-900/50", "border-amber-500")
          label.classList.remove("border-gray-600")
        } else {
          label.classList.remove("bg-amber-900/50", "border-amber-500")
          label.classList.add("border-gray-600")
        }
      }
    })
  }
}
