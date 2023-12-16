class Broadcaster::Post::Created 
   attr_reader :post
   def initialize(post)
     @post = post
   end

   def call
    add_post_to_list
    update_posts_count
   end

   private 

   def add_post_to_list
    Turbo::StreamsChannel.broadcast_append_to :posts_list, target: "posts-item", partial: "posts/post", locals: {post: @post}
   end

   def update_posts_count
    Turbo::StreamsChannel.broadcast_update_to :posts_list, target: "posts-count", partial: "posts/count", locals: {count: Post.count}
   end
end