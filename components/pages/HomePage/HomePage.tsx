import { NextPage } from 'next'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { PostsPaginationSortingType } from '~/modules/Posts/Infrastructure/Frontend/PostsPaginationSortingType'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { Home } from '~/components/Home/Home'
import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import { useRouter } from 'next/router'

export interface Props {
  page: number
  order: PostsPaginationSortingType
  initialPosts: PostCardComponentDto[]
  initialPostsNumber: number
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
  htmlPageMetaContextProps: HtmlPageMetaContextProps
  baseUrl: string
}

export const HomePage: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation('home_page')
  const locale = useRouter().locale ?? 'en'

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: t('home_page_title'),
    url: props.htmlPageMetaContextProps.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${props.baseUrl}/${locale}/posts/search?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  let canonicalUrl = props.baseUrl

  if (locale !== 'en') {
    canonicalUrl = `${props.baseUrl}/${locale}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaResourceService(
      t('home_page_title'),
      t('home_page_description'),
      HtmlPageMetaContextResourceType.WEBSITE,
      canonicalUrl // canonical -> Home page
    )
  ).getProperties()

  const htmlPageMetaProps = {
    ...props.htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  return (
    <>
      <HtmlPageMeta { ...htmlPageMetaProps } />

      <Home
        page={ props.page }
        activeProducer={ props.activeProducer }
        producers={ props.producers }
        initialPosts={ props.initialPosts }
        initialPostsNumber={ props.initialPostsNumber }
        order={ props.order }
      />
    </>
  )
}
