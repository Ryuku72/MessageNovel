export type TitleInputProps = {
  title: string;
  id: string;
  value: string;
  type?: string;
  labelColor?: string;
  placeholder: string;
  minLength?: number;
  onChange: (value: string) => void;
};

export default function TitleInput({
  title,
  id,
  value,
  placeholder,
  labelColor = 'text-gray-600',
  onChange,
  type = 'text',
  minLength = 1
}: TitleInputProps) {
  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className={`w-full text-sm font-medium ${labelColor}`}>
        {title}
      </label>
      <input
        aria-label={title}
        id={id}
        type={type}
        name={id}
        required={true}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={id}
        minLength={minLength}
        className="w-full h-11 font-normal text-base border border-gray-300 rounded-lg py-2 px-3 text-gray-500"
      />
    </div>
  );
}
