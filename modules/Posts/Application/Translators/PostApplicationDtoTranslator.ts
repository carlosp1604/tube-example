import { MetaApplicationDtoTranslator } from './MetaApplicationDtoTranslator'
import { TagApplicationDtoTranslator } from '~/modules/PostTag/Application/TagApplicationDtoTranslator'
import { Post } from '~/modules/Posts/Domain/Post'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'
import { ProducerApplicationDtoTranslator } from '~/modules/Producers/Application/ProducerApplicationDtoTranslator'
import { PostTranslationsDtoTranslator } from '~/modules/Posts/Application/Translators/PostTranslationsDtoTranslator'
import {
  PostMediaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostMedia/PostMediaApplicationDtoTranslator'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class PostApplicationDtoTranslator {
  public static fromDomain (post: Post): PostApplicationDto {
    let deletedAt: string | null = null

    if (post.deletedAt) {
      deletedAt = post.deletedAt.toISO()
    }

    return {
      id: post.id,
      createdAt: post.createdAt.toISO(),
      actors: post.actors.map((actor) => {
        return ActorApplicationDtoTranslator.fromDomain(actor)
      }),
      description: post.description,
      meta: post.meta.map((meta) => {
        return MetaApplicationDtoTranslator.fromDomain(meta)
      }),
      publishedAt: post.publishedAt?.toISO() ?? '',
      tags: post.tags.map((tag) => {
        return TagApplicationDtoTranslator.fromDomain(tag)
      }),
      title: post.title,
      type: post.type,
      producer: post.producer !== null
        ? ProducerApplicationDtoTranslator.fromDomain(post.producer)
        : null,
      slug: post.slug,
      translations: PostTranslationsDtoTranslator.fromDomain(post),
      actor: post.actor !== null
        ? ActorApplicationDtoTranslator.fromDomain(post.actor)
        : null,
      postMedia: post.postMedia.map((postMedia) => {
        return PostMediaApplicationDtoTranslator.fromDomain(postMedia)
      }),
      deletedAt,
    }
  }
}
