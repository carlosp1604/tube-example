import { FC } from 'react'
import styles from './VideoSourcesMenu.module.scss'
import Image from 'next/image'
import { BsPlay } from 'react-icons/bs'
import useTranslation from 'next-translate/useTranslation'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'
import { ModalMenuHeader } from '~/modules/Shared/Infrastructure/Components/ModalMenuHeader/ModalMenuHeader'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'

export interface Props {
  mediaUrls: MediaUrlComponentDto[]
  selectedUrl: MediaUrlComponentDto | null
  onClickOption: (mediaUrl: MediaUrlComponentDto) => void
  menuOpen: boolean
  onClickMenu: () => void
}

export const VideoSourcesMenu: FC<Props> = ({ mediaUrls, selectedUrl, onClickOption, menuOpen, onClickMenu }) => {
  const { t } = useTranslation('post')

  return (
    <div className={ `
      ${styles.videoSourcesMenu__container}
      ${menuOpen ? styles.videoSourcesMenu__container__open : ''}
    ` }
      onClick={ () => onClickMenu() }
    >
      <ModalMenuHeader
        title={ t('post_video_player_sources_menu_title') }
        subtitle={ t('post_video_player_sources_menu_subtitle') }
        icon={ <BsPlay /> }
      />

      <div className={ styles.videoSourcesMenu__optionsList }>
        { mediaUrls.map((mediaUrl) => {
          return (
            <button
              key={ mediaUrl.url }
              className={ `
              ${styles.videoSourcesMenu__optionItem}
              ${menuOpen ? styles.videoSourcesMenu__optionItem__open : ''}
              ${selectedUrl && selectedUrl.url === mediaUrl.url
                ? styles.videoSourcesMenu__optionItem__selected
                : ''}
            ` }
              onClick={ () => { onClickOption(mediaUrl) } }
            >
              <Image
                src={ mediaUrl.provider.logoUrl }
                alt={ mediaUrl.provider.name }
                className={ styles.videoSourcesMenu__optionLogo }
                width={ 200 }
                height={ 200 }
                sizes={ '100vw' }
                placeholder={ 'blur' }
                blurDataURL={ rgbDataURL(81, 80, 80) }
              />
              <span>
                { mediaUrl.title }
              </span>
            </button>
          )
        }) }
      </div>
    </div>
  )
}
