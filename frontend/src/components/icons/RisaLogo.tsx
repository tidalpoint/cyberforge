import { FC, SVGAttributes } from 'react'

type Props = SVGAttributes<SVGElement>

const RisaLogo: FC<Props> = (props) => {
  return (
    <svg viewBox="0 0 29 15" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.62493 11.2434C6.61276 12.2483 5.23941 12.813 3.80753 12.813H0V15H3.80753C5.82376 15 7.75709 14.2052 9.1826 12.7899L13 9H9.88463L7.62493 11.2434Z"
        fill="currentColor"
      />
      <path d="M7 9H4V6H7V9Z" fill="currentColor" />
      <path
        d="M3.8078 -6.06306e-08H0V2.18687H3.8078C5.24 2.18687 6.61306 2.75161 7.62546 3.7567L9.8851 6H13L9.18291 2.21048C7.75708 0.794955 5.8239 -6.06306e-08 3.8078 -6.06306e-08Z"
        fill="currentColor"
      />
      <path
        d="M21.3751 3.75657C22.3872 2.75168 23.7606 2.18705 25.1925 2.18705L29 2.18705L29 0L25.1925 -3.32865e-07C23.1762 -5.09129e-07 21.2429 0.794836 19.8174 2.21009L16 6L19.1154 6L21.3751 3.75657Z"
        fill="currentColor"
      />
      <path d="M22 6L25 6L25 9L22 9L22 6Z" fill="currentColor" />
      <path
        d="M25.1922 15L29 15L29 12.8131L25.1922 12.8131C23.76 12.8131 22.3869 12.2484 21.3745 11.2433L19.1149 9L16 9L19.8171 12.7895C21.2429 14.205 23.1761 15 25.1922 15Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default RisaLogo
