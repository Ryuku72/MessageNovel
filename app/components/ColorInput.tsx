export type ColorInputProps = {
  title: string;
  id: string;
  textAlign?: string;
  textSize?: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ColorInput({ title, id, value, textAlign = 'text-center', textSize = 'text-sm', onChange }: ColorInputProps) {
  const colors = [
    'bg-pastel-black',
    'bg-pastel-red',
    'bg-pastel-brown',
    'bg-pastel-orange',
    'bg-pastel-yellow',
    'bg-pastel-indigo',
    'bg-pastel-blue',
    'bg-pastel-green',
    'bg-pastel-emerald',
    'bg-pastel-purple'
  ];

  return (
    <div className="w-full flex flex-col gap-3 font-mono">
      <label htmlFor={id} className={`text-gray-600 font-medium w-full ${textSize} ${textAlign}`}>
        {title}
      </label>
      <div className="w-full grid grid-cols-[repeat(auto-fill,32px)] gap-3">
        {colors.map(color => (
          <button
            key={color}
            aria-label={color + '_button'}
            type="button"
            onClick={() => onChange(color)}
            className={`flex flex-shrink-0 items-center justify-center w-8 h-8 p-1 scale-100 rounded transition cursor-pointer hover:scale-110 shadow-slate-300 shadow ${color}`}>
            <div className={color === value ? 'bg-white rounded-full h-2 w-2 shadow' : 'hidden'} />
          </button>
        ))}
      </div>
      <input id={id} name={id} value={value} className="hidden" required readOnly />
    </div>
  );
}
