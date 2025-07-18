export function DotsCard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      height="50"
      viewBox="0 0 88 50"
      width="88"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <radialGradient
        id="a"
        cx="0"
        cy="0"
        gradientTransform="matrix(0 53.5 -53.5 0 34.5 -3.5)"
        gradientUnits="userSpaceOnUse"
        r="1"
      >
        <stop offset="0" stopColor="#d9d9d9" />
        <stop offset="1" stopColor="#737373" stopOpacity="0" />
      </radialGradient>
      <mask id="b" height="107" maskUnits="userSpaceOnUse" width="107" x="-19" y="-57">
        <path d="m-19-57h107v107h-107z" fill="url(#a)" />
      </mask>
      <g fill="#cbd5e1" mask="url(#b)">
        <circle cx="4.5" cy="1.5" r="1.5" />
        <circle cx="13.5" cy="1.5" r="1.5" />
        <circle cx="22.5" cy="1.5" r="1.5" />
        <circle cx="31.5" cy="1.5" r="1.5" />
        <circle cx="40.5" cy="1.5" r="1.5" />
        <circle cx="49.5" cy="1.5" r="1.5" />
        <circle cx="58.5" cy="1.5" r="1.5" />
        <circle cx="67.5" cy="1.5" r="1.5" />
        <circle cx="76.5" cy="1.5" r="1.5" />
        <circle cx="4.5" cy="10.5" r="1.5" />
        <circle cx="13.5" cy="10.5" r="1.5" />
        <circle cx="22.5" cy="10.5" r="1.5" />
        <circle cx="31.5" cy="10.5" r="1.5" />
        <circle cx="40.5" cy="10.5" r="1.5" />
        <circle cx="49.5" cy="10.5" r="1.5" />
        <circle cx="58.5" cy="10.5" r="1.5" />
        <circle cx="67.5" cy="10.5" r="1.5" />
        <circle cx="76.5" cy="10.5" r="1.5" />
        <circle cx="4.5" cy="19.5" r="1.5" />
        <circle cx="13.5" cy="19.5" r="1.5" />
        <circle cx="22.5" cy="19.5" r="1.5" />
        <circle cx="31.5" cy="19.5" r="1.5" />
        <circle cx="40.5" cy="19.5" r="1.5" />
        <circle cx="49.5" cy="19.5" r="1.5" />
        <circle cx="58.5" cy="19.5" r="1.5" />
        <circle cx="67.5" cy="19.5" r="1.5" />
        <circle cx="76.5" cy="19.5" r="1.5" />
        <circle cx="4.5" cy="28.5" r="1.5" />
        <circle cx="13.5" cy="28.5" r="1.5" />
        <circle cx="22.5" cy="28.5" r="1.5" />
        <circle cx="31.5" cy="28.5" r="1.5" />
        <circle cx="40.5" cy="28.5" r="1.5" />
        <circle cx="49.5" cy="28.5" r="1.5" />
        <circle cx="58.5" cy="28.5" r="1.5" />
        <circle cx="67.5" cy="28.5" r="1.5" />
        <circle cx="76.5" cy="28.5" r="1.5" />
        <circle cx="4.5" cy="37.5" r="1.5" />
        <circle cx="13.5" cy="37.5" r="1.5" />
        <circle cx="22.5" cy="37.5" r="1.5" />
        <circle cx="31.5" cy="37.5" r="1.5" />
        <circle cx="40.5" cy="37.5" r="1.5" />
        <circle cx="49.5" cy="37.5" r="1.5" />
        <circle cx="58.5" cy="37.5" r="1.5" />
        <circle cx="67.5" cy="37.5" r="1.5" />
        <circle cx="76.5" cy="37.5" r="1.5" />
      </g>
    </svg>
  )
}
