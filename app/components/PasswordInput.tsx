import { useState } from 'react';

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
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className={`w-full font-medium ${labelColor}`}>
        {title}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          minLength={6}
          maxLength={32}
          name={id}
          required
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 font-normal border border-gray-300 rounded-lg py-2 px-4 text-gray-500 pr-11"
        />
        <div className="h-11 w-11 border-gray-300 rounded-e p-1 absolute top-0 right-0 flex items-center justify-center">
          <input
            id="default-checkbox"
            type="checkbox"
            onClick={() => setShowPassword(!showPassword)}
            value={showPassword ? 1 : 0}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-emerald-800 rounded focus:ring-blue-500 focus:ring-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
