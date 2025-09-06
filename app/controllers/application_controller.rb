class ApplicationController < ActionController::Base
  before_action :basic_auth, unless: -> { Rails.env.test? }

  def basic_auth
    authenticate_or_request_with_http_basic do |username, password|
      username == ENV["BASIC_AUTH_USER_ORIGIN"] && password == ENV["BASIC_AUTH_PASSWORD_ORIGIN"]
    end
  end

end
