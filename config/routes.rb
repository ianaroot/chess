Rails.application.routes.draw do
  devise_for :users
  root "arena#index"

  resources :bots
  resources :matches, only: [ :show, :create, :update ]

  get "up" => "rails/health#show", as: :rails_health_check
end
