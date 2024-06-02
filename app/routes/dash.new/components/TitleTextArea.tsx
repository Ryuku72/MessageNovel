export type TitleTextAreaProps = {
  title: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  limit?: number;
};

export default function TitleTextArea({ title, id, value, placeholder, onChange, limit = 500 }: TitleTextAreaProps) {
  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className="w-full text-sm font-medium text-gray-600">
        {title} <span className="text-xs font-medium text-gray-500">{`(Minimium 120 and Maximium ${limit} characters)`}</span>
      </label>
      <div className="relative">
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={id}
        rows={10}
        className="w-full text-base font-normal border border-gray-300 rounded-lg p-3 text-gray-500 resize-none"
        minLength={120}
        maxLength={limit}
        required={true}
      />
      <p className={`absolute bottom-3 right-3 text-xs font-medium ${value?.length >= 120 ? 'text-green-500' : 'text-red-400'}`}>Length: {value.length}</p>
      </div>
    </div>
  );
}
