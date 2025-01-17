import { FC, ReactElement } from 'react'
import styles from './ActorCardGallery.module.scss'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { ActorCard } from '~/modules/Actors/Infrastructure/Components/ActorCard/ActorCard'
import {
  ActorCardSkeleton
} from '~/modules/Actors/Infrastructure/Components/ActorCard/ActorCardSkeleton/ActorCardSkeleton'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'

interface Props {
  actors: ActorCardDto[]
  loading: boolean
  emptyState: ReactElement | null
}

export const ActorCardGallery: FC<Partial<Props> & Pick<Props, 'actors'>> = ({
  actors,
  loading = false,
  emptyState = null,
}) => {
  let actorsSkeletonNumber

  if (actors.length <= defaultPerPage) {
    actorsSkeletonNumber = defaultPerPage - actors.length
  } else {
    actorsSkeletonNumber = actors.length % defaultPerPage
  }

  const skeletonActors = Array.from(Array(actorsSkeletonNumber).keys())
    .map((index) => (
      <ActorCardSkeleton key={ index }/>
    ))

  const actorsCards = actors.map((actor) => {
    return (
      <ActorCard
        actor={ actor }
        key={ actor.id }
      />
    )
  })

  let content: ReactElement | null = (
    <div className={ `
      ${styles.actorCardGallery__container}
      ${loading ? styles.actorCardGallery__container__loading : ''}
    ` }
    >
      { actorsCards }
      { loading ? skeletonActors : null }
    </div>
  )

  if (!loading && actors.length === 0) {
    content = emptyState
  }

  return content
}
