import { SVG_Component_props } from '~/types';

export function ArrowClockwiseIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={svgColor}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
    </svg>
  );
}

export function ArrowCounterClockwiseIcon({
  className = '',
  svgColor = 'currentColor',
  uniqueId
}: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
    </svg>
  );
}

export function QuoteIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
      <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
    </svg>
  );
}

export function CheveronDownIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
}

export function CodeIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
    </svg>
  );
}

export function JustifyIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function LinkIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
      <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
    </svg>
  );
}

export function ListOLIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
      />
      <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z" />
    </svg>
  );
}

export function ListULIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
      />
    </svg>
  );
}

export function PencilFillIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
    </svg>
  );
}

export function CheckListIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
      <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
    </svg>
  );
}

export function TextCenterIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TextLeftIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TextParagraphIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TextRightIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path
        fillRule="evenodd"
        d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TypeBoldIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
    </svg>
  );
}

export function TextH1Icon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z" />
    </svg>
  );
}

export function TextH2Icon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z" />
    </svg>
  );
}

export function TextH3Icon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z" />
    </svg>
  );
}

export function TypeItalicIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
    </svg>
  );
}

export function TypeStrikeThroughIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
    </svg>
  );
}

export function TypeUnderlineIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
    </svg>
  );
}

export function HorizontalRuleIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={svgColor}
      className={className}
      id={uniqueId}
      viewBox="0 0 16 16"
      width="16"
      height="16">
      <path d="M0 10.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zM12 0H4a2 2 0 0 0-2 2v7h1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v7h1V2a2 2 0 0 0-2-2zm2 12h-1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2H2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2z" />
    </svg>
  );
}

export function FileImageIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={svgColor} id={uniqueId} viewBox="0 0 16 16" className={className}>
      <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
    </svg>
  );
}

export function MicIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
      <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
    </svg>
  );
}

export function StickyIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z" />
    </svg>
  );
}

export function SendIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} className={className} id={uniqueId}>
      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
    </svg>
  );
}

export function ChatIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
      <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
    </svg>
  );
}

export function TrashIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill={svgColor} id={uniqueId} className={className}>
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
    </svg>
  );
}

export function DisconnectIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg fill={svgColor} id={uniqueId} className={className} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 0 0-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z"></path>{' '}
      </g>
    </svg>
  );
}

export function ConnectIcon({ className = '', svgColor = 'currentColor', uniqueId }: SVG_Component_props) {
  return (
    <svg
      fill={svgColor}
      id={uniqueId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 297 297"
      xmlSpace="preserve">
      <g>
        <path
          d="M166.264,259C166.267,259,166.262,259,166.264,259c24.646,0,50.552-6.369,71.899-18.432
		c2.737-1.547,4.594-4.283,5.019-7.398c0.425-3.115-0.631-6.25-2.855-8.473l-66.434-66.443c9.732-13.521,8.528-32.537-3.625-44.694
		c-12.152-12.152-31.166-13.356-44.686-3.623L59.151,43.495c-2.223-2.224-5.358-3.279-8.474-2.854
		c-3.115,0.425-5.854,2.282-7.399,5.02c-28.422,50.313-23.286,112.725,11.358,157.69l-40.393,79.091
		c-1.559,3.118-1.392,6.822,0.441,9.788c1.833,2.966,5.071,4.771,8.558,4.771h132.963c5.556,0,10.06-4.504,10.06-10.06V259z
		 M156.04,127.786c4.256,4.256,5.307,10.52,3.157,15.77l-18.919-18.923C145.527,122.482,151.788,123.532,156.04,127.786z
		 M146.145,276.88H39.518l29.003-58.015c21.534,20.814,48.478,34.097,77.624,38.509V276.88z M167.859,238.887
		c-0.002,0-0.006,0-0.008,0c-32.827-0.002-63.688-12.786-86.896-35.997c-35.689-35.695-45.609-89.648-26.126-135.261
		l161.364,161.385C200.996,235.501,184.521,238.887,167.859,238.887z"
        />
        <path
          d="M153.607,73.852c31.08,0,56.366,25.289,56.367,56.375c0,5.556,4.505,10.06,10.06,10.06c5.557,0,10.061-4.505,10.061-10.06
		c-0.001-42.18-34.313-76.495-76.487-76.495c-5.556,0-10.059,4.504-10.059,10.06C143.548,69.347,148.052,73.852,153.607,73.852z"
        />
        <path
          d="M153.607,0c-5.556,0-10.059,4.504-10.059,10.06c0,5.556,4.503,10.061,10.059,10.061
		c60.704,0.001,110.091,49.394,110.091,110.106c0,5.555,4.504,10.06,10.06,10.06c5.556,0,10.061-4.505,10.061-10.06
		C283.818,58.42,225.405,0.001,153.607,0z"
        />
      </g>
    </svg>
  );
}
