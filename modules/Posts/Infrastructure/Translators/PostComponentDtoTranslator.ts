import { VideoComponentDtoTranslator } from './VideoComponentDtoTranslator'
import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import {
  PostComponentDto,
  PostComponentDtoActorDto, PostComponentDtoProducerDto,
  PostComponentDtoTagDto
} from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'
import { PostMediaComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/PostMediaComponentDto'
import {
  PostMediaComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/PostMediaComponentDtoTranslator'
import { MetaApplicationDto } from '~/modules/Posts/Application/Dtos/MetaApplicationDto'

export class PostComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostApplicationDto, locale: string): PostComponentDto {
    const actors: PostComponentDtoActorDto[] = applicationDto.actors.map((actor) => ({
      name: actor.name,
      slug: actor.slug,
      id: actor.id,
      imageUrl: actor.imageUrl,
    }))

    const tags: PostComponentDtoTagDto[] = applicationDto.tags.map((tag) => {
      const languageHasTranslations =
        tag.translations.find((translation) => translation.language === locale)

      let nameTranslation = tag.name

      if (languageHasTranslations) {
        const nameFieldTranslation =
          languageHasTranslations.translations.find((translation) => translation.field === 'name')

        if (nameFieldTranslation) {
          nameTranslation = nameFieldTranslation.value
        }
      }

      return {
        name: nameTranslation,
        id: tag.id,
        slug: tag.slug,
      }
    })

    let producer: PostComponentDtoProducerDto | null = null

    if (applicationDto.producer !== null) {
      producer = {
        name: applicationDto.producer.name,
        slug: applicationDto.producer.slug,
        id: applicationDto.producer.id,
        imageUrl: applicationDto.producer.imageUrl,
        brandHexColor: applicationDto.producer.brandHexColor,
      }
    }

    let actor: PostComponentDtoActorDto | null = null

    if (applicationDto.actor !== null) {
      actor = {
        slug: applicationDto.actor.slug,
        name: applicationDto.actor.name,
        id: applicationDto.actor.id,
        imageUrl: applicationDto.actor.imageUrl,
      }
    }

    const video = VideoComponentDtoTranslator.fromApplicationDto(applicationDto)

    const formattedPublishedAt = (new DateService()).formatDateToDateMedFromIso(applicationDto.publishedAt, locale)

    const languageHasTranslations = applicationDto.translations.find((translation) => translation.language === locale)

    let titleTranslation = applicationDto.title
    let descriptionTranslation = applicationDto.description

    if (languageHasTranslations) {
      const titleFieldTranslation =
        languageHasTranslations.translations.find((translation) => translation.field === 'title')
      const descriptionFieldTranslation =
        languageHasTranslations.translations.find((translation) => translation.field === 'description')

      if (titleFieldTranslation) {
        titleTranslation = titleFieldTranslation.value
      }

      if (descriptionFieldTranslation) {
        descriptionTranslation = descriptionFieldTranslation.value
      }
    }

    const thumb = PostComponentDtoTranslator.getMeta(applicationDto.meta, 'thumb')

    const duration = PostComponentDtoTranslator.getMeta(applicationDto.meta, 'duration')

    const resolution = PostComponentDtoTranslator.getMeta(applicationDto.meta, 'resolution')

    const postMediaVideoType: PostMediaComponentDto[] = applicationDto.postMedia
      .filter((postMedia) => postMedia.type === 'Video')
      .map((postMedia) => {
        return PostMediaComponentDtoTranslator.fromApplicationDto(postMedia)
      })

    const postMediaEmbedType: PostMediaComponentDto[] = applicationDto.postMedia
      .filter((postMedia) => postMedia.type === 'Embed')
      .map((postMedia) => {
        return PostMediaComponentDtoTranslator.fromApplicationDto(postMedia)
      })

    const postMediaImageType: PostMediaComponentDto[] = applicationDto.postMedia
      .filter((postMedia) => postMedia.type === 'Image')
      .map((postMedia) => {
        return PostMediaComponentDtoTranslator.fromApplicationDto(postMedia)
      })

    return {
      id: applicationDto.id,
      slug: applicationDto.slug,
      actors,
      video,
      tags,
      producer,
      description: descriptionTranslation,
      formattedPublishedAt,
      publishedAt: applicationDto.publishedAt,
      title: titleTranslation,
      type: applicationDto.type,
      thumb: thumb ? thumb.value : '',
      resolution: resolution ? resolution.value : '',
      duration: duration ? duration.value : '0',
      actor,
      postMediaVideoType,
      postMediaImageType,
      postMediaEmbedType,
    }
  }

  private static getMeta (postMeta: MetaApplicationDto[], type: string): MetaApplicationDto | undefined {
    return postMeta.find((meta) => {
      return meta.type === type
    })
  }
}
