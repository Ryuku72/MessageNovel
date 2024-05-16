export type PasswordInputProps = {
  title: string;
  id: string;
  value: string;
  labelColor?: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function PasswordInput({
  title,
  id,
  value,
  placeholder,
  labelColor = 'text-gray-600',
  onChange
}: PasswordInputProps) {
  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className={`w-full font-medium ${labelColor}`}>
        {title}
      </label>
      <input
        id={id}
        type="password"
        autoComplete="new-password"
        minLength={6}
        maxLength={32}
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
