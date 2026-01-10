import { useEffect, useRef, useState } from 'react'

const PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' // 1x1 transparent gif

export default function LazyImage({ src, alt, className = '', placeholder = PLACEHOLDER, ...rest }) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px 0px' } // start loading a bit before in-view
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const resolvedSrc = hasError ? placeholder : isVisible ? src : placeholder

  return (
    <img
      ref={imgRef}
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setHasError(true)}
      {...rest}
    />
  )
}

