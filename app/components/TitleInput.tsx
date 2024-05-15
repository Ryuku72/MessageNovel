export type TitleInputProps = {
  title: string;
  id: string;
  value: string;
  type?: string;
  labelColor?: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function TitleInput({
  title,
  id,
  value,
  placeholder,
  labelColor = 'text-gray-600',
  onChange,
  type = "text"
}: TitleInputProps) {
  return (
    <div className="w-full flex flex-col gap-3 font-mono">
      <label htmlFor={id} className={`w-full ${labelColor}`}>
        {title}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 font-normal border border-gray-300 rounded-lg py-2 px-4 text-gray-500"
      />
    </div>
  );
}
