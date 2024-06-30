export type TitleInputProps = {
  title: string;
  id: string;
  value: string;
  type?: string;
  labelColor?: string;
  placeholder?: string;
  minLength?: number;
  textSize?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export default function TitleInput({
  title,
  id,
  value,
  placeholder = 'Update Text...',
  labelColor = 'text-gray-600',
  textSize = 'text-sm',
  onChange = () => {},
  type = 'text',
  minLength = 1,
  disabled = false
}: TitleInputProps) {
  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className={`w-full ${textSize} font-medium ${labelColor}`}>
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
        disabled={disabled}
        className="w-full h-11 font-normal text-base border border-gray-300 rounded-lg py-2 px-3 text-gray-500 bg-white  disabled:bg-opacity-60"
      />
    </div>
  );
}
