export function LabelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="scale(1.8)">
        <path
          d="M12.0208 4.9496L8.48528 1.41406L4.94975 4.9496L4.94975 11.5186C4.94975 12.1833 5.49422 12.7278 6.1589 12.7278H10.8117C11.4763 12.7278 12.0208 12.1833 12.0208 11.5186L12.0208 4.9496Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.48528 4.94971L8.48882 4.95324"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <defs>
        <clipPath id="clip0_167_1175">
          <rect
            width="12"
            height="12"
            fill="currentColor"
            transform="translate(8.48528) rotate(45)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
