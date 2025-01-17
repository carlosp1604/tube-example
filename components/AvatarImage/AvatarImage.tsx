import { FC } from 'react'
import Image from 'next/image'
import { CommonAvatar } from '~/components/AvatarImage/CommonAvatar'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'

interface Props {
  imageUrl: string | null
  avatarClassName: string
  imageClassName: string
  avatarName: string
  imageAlt: string
  priority: boolean
  color: string | undefined
  rounded: boolean
}

export const AvatarImage: FC<Partial<Props> & Omit<Props, 'priority' | 'color' | 'rounded'>> = ({
  imageUrl,
  avatarClassName,
  avatarName,
  imageClassName,
  imageAlt,
  priority = false,
  color = undefined,
  rounded = true,
}) => {
  let avatar = (
    <CommonAvatar className={ avatarClassName } avatarName={ avatarName } color={ color } rounded={ rounded }/>
  )

  if (imageUrl !== null) {
    avatar = (
      <Image
        alt={ imageAlt }
        className={ imageClassName }
        src={ imageUrl }
        width={ 200 }
        height={ 200 }
        sizes={ '100vw' }
        priority={ priority }
        placeholder={ 'blur' }
        blurDataURL={ rgbDataURL(81, 80, 80) }
      />
    )
  }

  return (avatar)
}
