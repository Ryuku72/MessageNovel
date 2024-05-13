import ReactColor from "@uiw/react-color-circle";

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
    "#FAEDCB",
    "#C9E4DE",
    "#C6DEF1",
    "#DBCDF0",
    "#FFADAD",
    "#DFFDFF",
    "#FFD6A5",
    "#BdB2FF",
    "#FAD1FA",
    "#FEC868",
    "#F1F7B5",
    "#E8A2A2",
    "#A0C3D2",
    "#C0D8C0"
  ];

  const colorStyle = {
    display: "flex",
    width: "100%",
    background: "inherit",
    gap: "8px",
    padding: 0,
    height: 'auto'
  }
  
  return (
    <div className="w-full flex flex-col gap-3 font-mono">
      <label htmlFor={id} className="text-gray-600 flex gap-3">
        {title}
      </label>
      <div className="w-full" id={id}>
        <ReactColor
          color={value}
          colors={colors}
          onChange={(color) => onChange(color.hex)}
          style={colorStyle}
          pointProps={{ style: { width: '35px', height: '35px' } }}
        />
      </div>
    </div>
  );
}

