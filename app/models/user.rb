class User < ApplicationRecord
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable

  # ニックネーム必須・一意
  validates :nickname, presence: true, uniqueness: true

  # パスワードバリデーション（6文字以上）
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?

  has_many :favorite_players, dependent: :destroy

  # Devise にメール不要を伝える
  def email_required?
    false
  end

  def email_changed?
    false
  end

  private

  # パスワードが必要か判定（新規登録または変更時のみ）
  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end