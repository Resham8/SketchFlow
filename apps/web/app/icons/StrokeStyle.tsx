export default function StrokeStyle({
  styleType,
}: {
  styleType: "solid" | "dashed" | "dotted";
}) {
  {
    if (styleType === "solid")
      return (
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          viewBox="0 0 20 20"
          className=""
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M4.167 10h11.666"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      );
  }

  {
    if (styleType === "dashed")
      return (
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          viewBox="0 0 24 24"
          className=""
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g strokeWidth="2">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 12h2"></path>
            <path d="M17 12h2"></path>
            <path d="M11 12h2"></path>
          </g>
        </svg>
      );
  }

  {
    if (styleType === "dotted")
      return (
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          viewBox="0 0 24 24"
          className=""
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g strokeWidth="2">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 12v.01"></path>
            <path d="M8 12v.01"></path>
            <path d="M12 12v.01"></path>
            <path d="M16 12v.01"></path>
            <path d="M20 12v.01"></path>
          </g>
        </svg>
      );
  }
}
