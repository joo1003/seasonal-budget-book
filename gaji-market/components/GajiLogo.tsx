import Image from 'next/image'

interface GajiLogoProps {
  size?: number
  showLaptop?: boolean
}

export default function GajiLogo({ size = 40 }: GajiLogoProps) {
  return (
    <Image
      src="/gajigaji.png"
      alt="가지마켓 로고"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}
