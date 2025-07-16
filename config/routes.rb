Rails.application.routes.draw do
  root to: "matches#index"
  resources :matches, only: :create
  resources :teams, only: :create
end
