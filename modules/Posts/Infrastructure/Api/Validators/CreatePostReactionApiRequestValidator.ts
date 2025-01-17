import { z, ZodError } from 'zod'
import { PostsApiRequestValidatorError } from '~/modules/Posts/Infrastructure/Api/Validators/PostsApiRequestValidatorError'
import { CreatePostReactionApiRequest } from '~/modules/Posts/Infrastructure/Api/Requests/CreatePostReactionApiRequest'

export class CreatePostReactionApiRequestValidator {
  private static addPostReactionApiRequestSchema = z.object({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    reactionType: z.string().min(1),
  })

  public static validate (request: CreatePostReactionApiRequest): PostsApiRequestValidatorError | void {
    try {
      this.addPostReactionApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostsApiRequestValidatorError.addPostReactionRequest(exception.issues)
    }
  }
}
