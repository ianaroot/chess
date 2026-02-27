import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slider", "value"]

  connect() {
    this.sliderTargets.forEach(slider => {
      this.updateValue(slider)
    })
  }

  update(event) {
    this.updateValue(event.target)
  }

  updateValue(slider) {
    const display = this.element.querySelector(`[data-weight-name="${slider.dataset.weightName}"]`)
    if (display) {
      display.textContent = slider.value
    }
  }
}
