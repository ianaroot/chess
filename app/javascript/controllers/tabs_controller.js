import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel"]

  show(event) {
    const tabName = event.currentTarget.dataset.tab

    this.tabTargets.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add("text-amber-400", "border-amber-400")
        tab.classList.remove("text-gray-400", "border-transparent")
      } else {
        tab.classList.remove("text-amber-400", "border-amber-400")
        tab.classList.add("text-gray-400", "border-transparent")
      }
    })

    this.panelTargets.forEach(panel => {
      if (panel.dataset.tab === tabName) {
        panel.classList.remove("hidden")
      } else {
        panel.classList.add("hidden")
      }
    })
  }
}
