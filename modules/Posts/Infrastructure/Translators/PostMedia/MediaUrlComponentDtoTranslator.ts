import { MediaUrlApplicationDto } from '~/modules/Posts/Application/Dtos/PostMedia/MediaUrlApplicationDto'
import {
  MediaProviderComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostMedia/MediaProviderComponentDtoTranslator'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export abstract class MediaUrlComponentDtoTranslator {
  public static fromApplicationDto (
    applicationDto: MediaUrlApplicationDto,
    postMediaType: string
  ): MediaUrlComponentDto {
    return {
      title: applicationDto.title,
      url: applicationDto.url,
      type: applicationDto.type,
      mediaType: postMediaType,
      provider: MediaProviderComponentDtoTranslator.fromApplicationDto(applicationDto.provider),
    }
  }
}
