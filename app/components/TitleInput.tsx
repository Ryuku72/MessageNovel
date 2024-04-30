export type TitleInputProps = {
  title: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function TitleInput({
  title,
  id,
  value,
  placeholder,
  onChange,
}: TitleInputProps) {
  return (
    <div className="w-full flex flex-col gap-3 font-mono">
      <label htmlFor={id} className="w-full text-gray-600">
        {title}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 font-normal border border-gray-300 rounded-lg py-2 px-4 text-gray-500"
      />
    </div>
  );
}
