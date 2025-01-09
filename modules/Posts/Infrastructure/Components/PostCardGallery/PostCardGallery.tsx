import { FC, ReactElement, useMemo, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardGallery.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { useSession } from 'next-auth/react'
import { PostCardOptionConfiguration, usePostCardOptions } from '~/hooks/PostCardOptions'
import {
  PostCardWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardWithOptions/PostCardWithOptions'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'
import dynamic from 'next/dynamic'
import { useToast } from '~/components/AppToast/ToastContext'

const PostCardGalleryOptions = dynamic(() => import(
  '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'
).then((module) => module.PostCardGalleryOptions), { ssr: false }
)

interface Props {
  posts: PostCardComponentDto[]
  postCardOptions: PostCardOptionConfiguration[]
  loading: boolean
  emptyState: ReactElement | null
}

export const PostCardGallery: FC<Partial<Props> & Pick<Props, 'posts' | 'postCardOptions'>> = ({
  posts,
  postCardOptions,
  loading = false,
  emptyState = null,
}) => {
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostCard, setSelectedPostCard] = useState<PostCardComponentDto | null>(null)
  const buildOptions = usePostCardOptions()

  const { t } = useTranslation('post_card_gallery')
  const { status } = useSession()
  const { error } = useToast()

  const postCardGalleryOptions = buildOptions(
    postCardOptions,
    () => setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
  )

  let onClickOptions : ((post: PostCardComponentDto) => void) | undefined

  if (postCardGalleryOptions.length > 0) {
    onClickOptions = async (post: PostCardComponentDto) => {
      if (status !== 'authenticated') {
        error(t('user_must_be_authenticated_error_message'))

        return
      }

      setSelectedPostCard(post)
      setPostCardOptionsMenuOpen(true)
    }
  }

  let postsSkeletonNumber

  if (posts.length <= defaultPerPage) {
    postsSkeletonNumber = defaultPerPage - posts.length
  } else {
    postsSkeletonNumber = posts.length % defaultPerPage
  }

  const createSkeletonList = (skeletonNumber: number): ReactElement[] => {
    return Array.from(Array(skeletonNumber).keys())
      .map((index) => (
        <PostCardSkeleton
          key={ index }
          loading={ loading }
        />
      ))
  }

  const skeletonPosts = createSkeletonList(postsSkeletonNumber)

  const postCards = useMemo(() => {
    return posts.map((post) => {
      return (
        <PostCardWithOptions
          post={ post }
          onClickOptions={ () => {
            if (onClickOptions) {
              onClickOptions(post)
            }
          } }
          showOptionsButton={ !!onClickOptions }
          key={ post.id }
        />
      )
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts])

  return (
    <div className={ `
      ${styles.postCardGallery__container}
      ${loading && posts.length !== 0 ? styles.postCardGallery__container__loading : ''}
    ` }
    >
      <PostCardGalleryOptions
        options={ postCardGalleryOptions }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
        selectedPostCard={ selectedPostCard as PostCardComponentDto }
      />
      { postCards }
      { loading ? skeletonPosts : null }
    </div>
  )
}
