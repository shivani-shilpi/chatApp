class PostsController < ApplicationController
  before_action :set_post, only: %i[ show edit update destroy ]

  def index
    @posts = Post.all
  end

  def show
  end

  def new
    @post = Post.new
  end

  def edit
  end

  def create
    @post = Post.new(post_params)

    respond_to do |format|
      if @post.save
        Broadcaster::Post::Created.new(@post).call
        # update_post_count
        # Turbo::StreamsChannel.broadcast_append_to :posts_list, target: "posts-item", partial: "posts/post", locals: {post: @post}
        format.html { redirect_to post_url(@post), notice: "Post was successfully created." }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end
 
  def update
    respond_to do |format|
      if @post.update(post_params)
        Turbo::StreamsChannel.broadcast_replace_to :posts_list, target: @post, partial: "posts/post", locals: {post: @post}
        format.html { redirect_to post_url(@post), notice: "Post was successfully updated." }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @post.destroy

    respond_to do |format|
      update_post_count
      Turbo::StreamsChannel.broadcast_remove_to :posts_list, target: @post
      format.html { redirect_to posts_url, notice: "Post was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def update_post_count
      # broadcast_update_to :posts_list, target: "posts-count", html: Post.count
      Turbo::StreamsChannel.broadcast_update_to :posts_list, target: "posts-count", partial: "posts/count", locals: {count: Post.count}
    end

    def set_post
      @post = Post.find(params[:id])
    end

    def post_params
      params.require(:post).permit(:title, :discription)
    end
end
