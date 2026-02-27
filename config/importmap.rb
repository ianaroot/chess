# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "@hotwired/turbo-rails", to: "turbo.min.js"

# Chess engine modules
pin_all_from "app/javascript/engine", under: "engine"

# Bot decision engine modules
pin_all_from "app/javascript/bot", under: "bot"
