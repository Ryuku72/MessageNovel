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
  return (
    <div className="w-full flex flex-col gap-3 font-mono">
      <label htmlFor={id} className="text-gray-600 flex gap-3">
        {title}
      </label>
      <div className="flex gap-4 items-center">
        <input
          id={id}
          type="color"
          className="border-none bg-transparent w-10 h-10 cursor-pointer"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <p className="text-gray-500 uppercase">{value}</p>
      </div>
    </div>
  );
}
