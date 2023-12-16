class Post < ApplicationRecord
  #broadcasts_to ->(post) { :posts_list }    #1st way of broadcasting

#   after_create_commit { broadcast_append_to :posts_list}   #2nd way
#   after_update_commit { broadcast_replace_to :posts_list}
#   after_destroy_commit { broadcast_remove_to :posts_list}

#when id is different 
    # after_create_commit do 
    #   update_post_count
    #   broadcast_append_to :posts_list, target: "posts-item", partial: "posts/post", locals: {post: self}
    # end

    # after_update_commit do 
    #    broadcast_replace_to :posts_list, target: self, partial: "posts/post", locals: {post: self}
    # end

    # after_destroy_commit do 
    #    update_post_count
    #    broadcast_remove_to :posts_list, target: self
    # end

    # def update_post_count
    #     # broadcast_update_to :posts_list, target: "posts-count", html: Post.count
    #     broadcast_update_to :posts_list, target: "posts-count", partial: "posts/count", locals: {count: Post.count}
    # end
end
