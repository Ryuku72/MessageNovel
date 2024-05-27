import { SVG_Component_props } from '~/types';

export default function SupabaseLogo({ className = '', svgColor = '#3ecf8e', uniqueId }: SVG_Component_props) {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 1465 1502">
      <defs>
        <linearGradient
          id={`${uniqueId}_g1`}
          x2="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(539.819,226.399,-338.743,807.688,724.964,734.759)">
          <stop offset="0" stopColor="#249361" />
          <stop offset="1" stopColor="#3ecf8e" />
        </linearGradient>
        <linearGradient
          id={`${uniqueId}_g2`}
          x2="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(245.712,462.539,-527.578,280.262,485.873,407.926)">
          <stop offset="0" stopColor="#000000" stopOpacity="1" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        id={`${uniqueId}_Layer`}
        className="s0"
        fill={`url(#${uniqueId}_g1)`}
        d="m855.7 1476.5c-38.4 48.2-116.3 21.8-117.2-39.9l-13.5-901.5h607.3c110.1 0 171.4 126.8 103 212.8z"
      />
      <path
        id={`${uniqueId}_Layer`}
        className="s1"
        opacity="0.2"
        fill={`url(#${uniqueId}_g2)`}
        d="m855.7 1476.5c-38.4 48.2-116.3 21.8-117.2-39.9l-13.5-901.5h607.3c110.1 0 171.4 126.8 103 212.8z"
      />
      <path
        id={`${uniqueId}_Layer`}
        className="s2"
        fill={svgColor}
        d="m608.7 25.8c38.4-48.3 116.3-21.9 117.2 39.8l5.9 901.5h-599.8c-110 0-171.3-126.8-102.9-212.8z"
      />
      <path
        id={`${uniqueId}_Layer`}
        className="s1"
        opacity="0.2"
        fill={`url(#${uniqueId}_g2)`}
        d="m608.7 25.8c38.4-48.3 116.3-21.9 117.2 39.8l5.9 901.5h-599.8c-110 0-171.3-126.8-102.9-212.8z"
      />
    </svg>
  );
}
