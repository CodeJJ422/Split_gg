# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "localStorageHandler", to: "localStorageHandler.js"
pin "getRankHandler", to: "getRankHandler.js"
pin "createTeamHandler", to: "createTeamHandler.js"