import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["triggerList", "triggersJson", "template"]
  static values = { nextId: Number }

  connect() {
    this.nextIdValue = this.nextIdValue || 1
    this.loadExisting()
  }

  loadExisting() {
    if (this.triggersJsonTarget.value) {
      try {
        const triggers = JSON.parse(this.triggersJsonTarget.value)
        triggers.forEach(trigger => {
          this.addTriggerCard(trigger)
        })
      } catch (e) {
        // ignore parse errors
      }
    }
  }

  addTrigger() {
    const trigger = {
      id: `t${this.nextIdValue++}`,
      name: "New Trigger",
      enabled: true,
      condition: { type: "always", params: {} },
      action: { type: "boost_move", params: { amount: 50 } }
    }
    this.addTriggerCard(trigger)
    this.serialize()
  }

  addTriggerCard(trigger) {
    const card = document.createElement("div")
    card.className = "bg-gray-700 rounded-lg p-4 border border-gray-600 trigger-card"
    card.dataset.triggerId = trigger.id
    card.innerHTML = this.cardHTML(trigger)
    this.triggerListTarget.appendChild(card)
  }

  cardHTML(trigger) {
    return `
      <div class="flex items-center justify-between mb-3">
        <input type="text" value="${this.escapeHtml(trigger.name)}" class="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 text-sm font-medium trigger-name" data-action="change->rule-builder#serialize">
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 text-xs">
            <input type="checkbox" ${trigger.enabled ? "checked" : ""} class="trigger-enabled" data-action="change->rule-builder#serialize">
            On
          </label>
          <button type="button" class="text-red-400 hover:text-red-300 text-sm" data-action="click->rule-builder#removeTrigger">Remove</button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-400 mb-1">When...</label>
          <select class="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 text-sm trigger-condition" data-action="change->rule-builder#serialize">
            <option value="always" ${trigger.condition.type === "always" ? "selected" : ""}>Always</option>
            <option value="piece_threatened" ${trigger.condition.type === "piece_threatened" ? "selected" : ""}>Piece Threatened</option>
            <option value="can_fork" ${trigger.condition.type === "can_fork" ? "selected" : ""}>Can Fork</option>
            <option value="losing_material" ${trigger.condition.type === "losing_material" ? "selected" : ""}>Losing Material</option>
            <option value="winning_material" ${trigger.condition.type === "winning_material" ? "selected" : ""}>Winning Material</option>
            <option value="in_check" ${trigger.condition.type === "in_check" ? "selected" : ""}>In Check</option>
            <option value="early_game" ${trigger.condition.type === "early_game" ? "selected" : ""}>Early Game</option>
            <option value="late_game" ${trigger.condition.type === "late_game" ? "selected" : ""}>Late Game</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">Then...</label>
          <select class="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 text-sm trigger-action" data-action="change->rule-builder#serialize">
            <option value="boost_move" ${trigger.action.type === "boost_move" ? "selected" : ""}>Boost All Moves</option>
            <option value="retreat" ${trigger.action.type === "retreat" ? "selected" : ""}>Retreat</option>
            <option value="play_aggressively" ${trigger.action.type === "play_aggressively" ? "selected" : ""}>Play Aggressively</option>
            <option value="play_conservatively" ${trigger.action.type === "play_conservatively" ? "selected" : ""}>Play Conservatively</option>
            <option value="weighted_choice" ${trigger.action.type === "weighted_choice" ? "selected" : ""}>Weighted Choice</option>
          </select>
        </div>
      </div>
    `
  }

  removeTrigger(event) {
    const card = event.target.closest(".trigger-card")
    if (card) {
      card.remove()
      this.serialize()
    }
  }

  serialize() {
    const cards = this.triggerListTarget.querySelectorAll(".trigger-card")
    const triggers = []

    cards.forEach((card, index) => {
      triggers.push({
        id: card.dataset.triggerId || `t${index + 1}`,
        name: card.querySelector(".trigger-name").value,
        enabled: card.querySelector(".trigger-enabled").checked,
        condition: { type: card.querySelector(".trigger-condition").value, params: {} },
        action: { type: card.querySelector(".trigger-action").value, params: {} }
      })
    })

    this.triggersJsonTarget.value = JSON.stringify(triggers)
  }

  escapeHtml(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }
}
