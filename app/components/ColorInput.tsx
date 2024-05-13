export type ColorInputProps = {
  title: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ColorInput({
  title,
  id,
  value,
  onChange,
}: ColorInputProps) {
  const colors = [
    "#D3D3D3", // Pastel Black
    "#FFCCCC", // Pastel Maroon
    "#FFFFCC", // Pastel Olive
    "#B2DFDB", // Darker Pastel Green
    "#FFFF99", // Pastel Yellow
    "#99CCFF", // Pastel Blue
    "#FF99CC", // Pastel Fuchsia
    "#CCCCFF", // Pastel Navy
    "#99FFFF", // Pastel Teal
    "#FF9999", // Pastel Red
    "#CCFFCC", // Pastel Green
    "#FFDAB9", // Brighter Pastel Orange
  ];

  const colorStyle = {
    display: "flex",
    width: "100%",
    background: "inherit",
    gap: "8px",
    padding: 0,
    height: "auto",
  };

  return (
    <div className="w-full max-w-52 flex flex-col gap-3 font-mono">
      <label htmlFor={id} className="text-gray-600 flex gap-3">
        {title}
      </label>
      <div className="w-full flex gap-3 flex-wrap" id={id}>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => {
              console.log(color);
              onChange(color);
            }}
            className="flex flex-shrink-0 items-center justify-center w-8 h-8 p-1 scale-100 rounded transition cursor-pointer hover:scale-110 shadow-slate-300 shadow"
            style={{ backgroundColor: color }}
          >
            <div
              className={
                color === value
                  ? "bg-white rounded-full h-2 w-2 shadow"
                  : "hidden"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
