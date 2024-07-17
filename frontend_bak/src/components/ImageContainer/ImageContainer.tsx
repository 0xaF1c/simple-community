import { ReactElement } from 'react'
import { useStyles } from './styles'
import { classList } from '../../utils/classList'

type IImageContainerProps = {
  src: string
  textProtect?: boolean
  title?: string
  subTitle?: string
  children?: ReactElement[] | ReactElement | string
  variant?: 'top' | 'bottom'
  height?: number
}
enum VARIANT_ALIGN_ITEMS {
  top = 'flex-start',
  bottom = 'flex-end',
}

export function ImageContainer({
  src,
  textProtect,
  variant,
  title,
  subTitle,
  children,
  height,
}: IImageContainerProps) {
  const classes = useStyles()
  const _variant = variant ?? 'bottom'
  const _height = height ?? 300

  return (
    <div
      className={classes.container}
      style={{
        backgroundImage: `url(${src})`,
        height: _height + 'px',
        alignItems: VARIANT_ALIGN_ITEMS[_variant],
      }}
    >
      {textProtect && (
        <div
          className={classList([
            classes.textProtectShader,
            classes['textProtectShader' + _variant],
          ])}
          style={{
            height: _height / 2 + 'px',
          }}
        >
          <div
            className={classList([
              classes.text,
              classes['text' + _variant],
            ])}
            style={{
              alignItems: VARIANT_ALIGN_ITEMS[_variant],
            }}
          >
            {children ?? (
              <>
                <div className={classes.title}>{title}</div>
                <div className={classes.subTitle}>{subTitle}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
