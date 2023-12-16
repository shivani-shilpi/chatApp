class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room
  after_create_commit { broadcast_append_to self.room }
  before_create :confirm_participant
  has_many_attached :attachments, dependent: :destroy
  # validate :validate_attachment_filetypes

  def confirm_participant
    if self.room.is_private
      is_participant = Participant.where(user_id: self.user.id, room_id: self.room.id).first
      throw :abort unless is_participant
    end
  end
  
  def chat_attachment(index)
    target = attachments[index]
    return unless attachments.attached?
    # return target if target.content_type.eql?('image/gif')  #if you use this then remove if image/gif condition

    if target.image?
      target.variant(resize_to_limit: [150, 150]).processed
    elsif target.video?
      target.variant(resize_to_limit: [150, 150]).processed
    end
  end
  
  # private
  # def validate_attachment_filetypes
  #   return unless attachments.attached?
    
  #   attachments.each do |attachment|
  #     unless attachment.content_type.in?(%w[image/jpeg image/png image/gif video/mp4 audio/mp3])
  #       errors.add(:attachments, 'must be a JPEG, PNG, GIF, MP3 or MP4')
  #     end
  #   end
  # end
end
