import { websiteName } from '../payload.config'

export default function Icon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icon.png`} alt={`${websiteName} Icon`} />
}
