import { PostMedia as PrismaPostMediaModel } from '@prisma/client'
import { DateTime } from 'luxon'
import { PostMedia } from '~/modules/Posts/Domain/PostMedia/PostMedia'
import {
  PostMediaWithMediaUrlWithMediaProvider
} from '~/modules/Posts/Infrastructure/PrismaModels/PostMediaModel'
import { MediaUrlModelTranslator } from '~/modules/Posts/Infrastructure/ModelTranslators/MediaUrlModelTranslator'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { MediaUrl } from '~/modules/Posts/Domain/PostMedia/MediaUrl'

export class PostMediaModelTranslator {
  public static toDomain (prismaPostMediaModel: PrismaPostMediaModel): PostMedia {
    const postMediaWithMediaUrlWithProvider = prismaPostMediaModel as PostMediaWithMediaUrlWithMediaProvider

    const mediaUrlsCollection:
      Collection<MediaUrl, MediaUrl['url'] & string> = Collection.initializeCollection()

    postMediaWithMediaUrlWithProvider.mediaUrls.forEach((mediaUrl) => {
      const domainMediaUrl = MediaUrlModelTranslator.toDomain(mediaUrl)

      mediaUrlsCollection.addItem(domainMediaUrl, domainMediaUrl.url + domainMediaUrl.type)
    })

    return new PostMedia(
      prismaPostMediaModel.id,
      prismaPostMediaModel.type,
      prismaPostMediaModel.title,
      prismaPostMediaModel.postId,
      prismaPostMediaModel.thumbnailUrl,
      DateTime.fromJSDate(prismaPostMediaModel.createdAt),
      DateTime.fromJSDate(prismaPostMediaModel.updatedAt),
      mediaUrlsCollection
    )
  }

  public static toDatabase (postMedia: PostMedia): PrismaPostMediaModel {
    return {
      postId: postMedia.postId,
      updatedAt: postMedia.updatedAt.toJSDate(),
      type: postMedia.type,
      createdAt: postMedia.createdAt.toJSDate(),
      id: postMedia.id,
      thumbnailUrl: postMedia.thumbnailUrl,
      title: postMedia.title,
    }
  }
}
