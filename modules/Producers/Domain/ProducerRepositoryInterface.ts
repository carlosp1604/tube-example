import { Producer } from './Producer'
import { ActorSortingOption } from '~/modules/Actors/Domain/ActorSorting'
import { SortingCriteria } from '~/modules/Shared/Domain/SortingCriteria'
import { ProducersWithPostsCountViewsCountWithTotalCount } from '~/modules/Producers/Domain/ProducerWithCountInterface'
import { ProducerFilterOptionInterface } from '~/modules/Producers/Domain/ProducerFilterOption'

export interface ProducerRepositoryInterface {
  /**
   * Insert a Producer in the persistence layer
   * @param producer Producer to persist
   */
  save(producer: Producer): Promise<void>

  /**
   * Count producers number
   * @return number of producers
   */
  count (): Promise<number>

  /**
   * TODO: Pagination for this use-case
   * Get first 20 most popular Producers
   * @param includedProducersSlugs producers Slug to include
   * @return Array of Producer
   */
  getPopular(includedProducerSlugs: Array<Producer['slug']>): Promise<Producer[]>

  /**
   * Find a Producer given its slug
   * @param producerSlug Producer Slug
   * @return Producer if found or null
   */
  findBySlug (producerSlug: Producer['slug']): Promise<Producer | null>

  /**
   * Find a Producer given its ID
   * @param producerId Producer ID
   * @return Producer if found or null
   */
  findById (producerId: Producer['id']): Promise<Producer | null>

  /**
   * Find Producers based on sorting criteria
   * @param offset Records offset
   * @param limit Records limit
   * @param sortingOption Sorting option
   * @param sortingCriteria Sorting criteria
   * @param filters Producer filters
   * @return ProducersWithPostsCountViewsCountWithTotalCount
   */
  findWithOffsetAndLimit (
    offset: number,
    limit: number,
    sortingOption: ActorSortingOption,
    sortingCriteria: SortingCriteria,
    filters: ProducerFilterOptionInterface[]
  ): Promise<ProducersWithPostsCountViewsCountWithTotalCount>

  /**
   * Add a new producer view for a producer given its ID
   * @param producerId Producer ID
   */
  addProducerView (producerId: Producer['id']): Promise<void>
}
