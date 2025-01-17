import { DeletePostReactionApplicationRequestDto } from './DeletePostReactionApplicationRequestDto'
import { DeletePostReactionApplicationException } from './DeletePostReactionApplicationException'
import { PostRepositoryInterface, RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import { ReactionableModelDomainException } from '~/modules/Reactions/Domain/ReactionableModelDomainException'

export class DeletePostReaction {
  private options: RepositoryOptions[] = ['reactions']

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async delete (request: DeletePostReactionApplicationRequestDto): Promise<void> {
    const [post, user] = await Promise.all([
      this.getPost(request.postId),
      this.getUser(request.userId),
    ])

    this.deleteReactionFromPost(post, user)

    await this.postRepository.deleteReaction(request.userId, request.postId)
  }

  private async getPost (postId: DeletePostReactionApplicationRequestDto['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, this.options)

    if (post === null) {
      throw DeletePostReactionApplicationException.postNotFound(postId)
    }

    return post as Post
  }

  private async getUser (userId: DeletePostReactionApplicationRequestDto['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (user === null) {
      throw DeletePostReactionApplicationException.userNotFound(userId)
    }

    return user
  }

  private deleteReactionFromPost (post: Post, user: User): void {
    try {
      post.deletePostReaction(user.id)
    } catch (exception: unknown) {
      if (!(exception instanceof ReactionableModelDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case ReactionableModelDomainException.userHasNotReactedId:
          throw DeletePostReactionApplicationException.userHasNotReacted(user.id, post.id)

        default:
          throw exception
      }
    }
  }
}
