import { websiteName } from '../payload.config'

export default function Logo() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/logo.webp`} alt={`${websiteName} Logo`} />
}
