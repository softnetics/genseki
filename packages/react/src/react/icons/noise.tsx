export function Noise(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="300"
      height="300"
      {...props}
    >
      <filter id="n" x="0" y="0">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" stitchTiles="stitch" />
      </filter>

      <rect width="300" height="300" fill="#fff" />
      <rect width="300" height="300" filter="url(#n)" opacity="0.80" />
    </svg>
  )
}
