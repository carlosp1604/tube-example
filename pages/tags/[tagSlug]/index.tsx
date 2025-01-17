import { GetServerSideProps } from 'next'
import { container } from '~/awilix.container'
import { GetPosts } from '~/modules/Posts/Application/GetPosts/GetPosts'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import {
  PostCardComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCardComponentDtoTranslator'
import {
  InfrastructureSortingCriteria,
  InfrastructureSortingOptions
} from '~/modules/Shared/Infrastructure/InfrastructureSorting'
import { PostsQueryParamsParser } from '~/modules/Posts/Infrastructure/Frontend/PostsQueryParamsParser'
import { GetTagBySlug } from '~/modules/PostTag/Application/GetTagBySlug/GetTagBySlug'
import { TagPage, TagPageProps } from '~/components/pages/TagPage/TagPage'
import {
  TagPageComponentDtoTranslator
} from '~/modules/PostTag/Infrastructure/Translators/TagPageComponentDtoTranslator'
import { PaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import {
  HtmlPageMetaContextService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextService'
import { Settings } from 'luxon'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export const getServerSideProps: GetServerSideProps<TagPageProps> = async (context) => {
  const tagSlug = context.query.tagSlug

  if (!tagSlug) {
    return {
      notFound: true,
    }
  }

  const locale = context.locale ?? 'en'

  Settings.defaultLocale = locale
  Settings.defaultZone = 'Europe/Madrid'

  const paginationQueryParams = new PostsQueryParamsParser(
    context.query,
    {
      sortingOptionType: {
        defaultValue: PaginationSortingType.LATEST,
        parseableOptionTypes: [
          PaginationSortingType.LATEST,
          PaginationSortingType.OLDEST,
          PaginationSortingType.MOST_VIEWED,
        ],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }
  )

  if (paginationQueryParams.parseFailed) {
    const stringPaginationParams = paginationQueryParams.getParsedQueryString()

    return {
      redirect: {
        destination: `/${locale}/tags/${tagSlug}?${stringPaginationParams}`,
        permanent: false,
      },
    }
  }

  const { env } = process
  let baseUrl = ''

  if (!env.BASE_URL) {
    throw Error('Missing env var: BASE_URL. Required in the tag page')
  } else {
    baseUrl = env.BASE_URL
  }

  // Experimental: Try yo improve performance
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )

  const htmlPageMetaContextService = new HtmlPageMetaContextService(context)

  const props: TagPageProps = {
    tag: {
      imageUrl: null,
      slug: '',
      name: '',
      id: '',
    },
    initialOrder: paginationQueryParams.sortingOptionType ?? PaginationSortingType.LATEST,
    initialPage: paginationQueryParams.page ?? 1,
    initialPosts: [],
    initialPostsNumber: 0,
    htmlPageMetaContextProps: htmlPageMetaContextService.getProperties(),
    baseUrl,
  }

  const getTag = container.resolve<GetTagBySlug>('getTagBySlugUseCase')
  const getPosts = container.resolve<GetPosts>('getPostsUseCase')

  try {
    const tag = await getTag.get(tagSlug.toString())

    props.tag = TagPageComponentDtoTranslator.fromApplicationDto(tag, locale)
  } catch (exception: unknown) {
    console.error(exception)

    return {
      notFound: true,
    }
  }

  try {
    let sortCriteria: InfrastructureSortingCriteria = InfrastructureSortingCriteria.DESC
    let sortOption: InfrastructureSortingOptions = InfrastructureSortingOptions.DATE
    let page = 1

    if (paginationQueryParams.componentSortingOption) {
      sortOption = paginationQueryParams.componentSortingOption.option
      sortCriteria = paginationQueryParams.componentSortingOption.criteria
    }

    if (paginationQueryParams.page) {
      page = paginationQueryParams.page
    }

    const producerPosts = await getPosts.get({
      page,
      filters: [{ type: FilterOptions.TAG_SLUG, value: String(tagSlug) }],
      sortCriteria,
      sortOption,
      postsPerPage: defaultPerPage,
    })

    props.initialPosts = producerPosts.posts.map((post) => {
      return PostCardComponentDtoTranslator.fromApplication(post.post, post.postViews, locale)
    })
    props.initialPostsNumber = producerPosts.postsNumber
  } catch (exception: unknown) {
    console.error(exception)
  }

  return {
    props,
  }
}

export default TagPage
