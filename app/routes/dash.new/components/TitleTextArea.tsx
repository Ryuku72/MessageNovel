export type TitleTextAreaProps = {
  title: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  limit?: number;
};

export default function TitleTextArea({ title, id, value, placeholder, onChange, limit = 125 }: TitleTextAreaProps) {
  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className="w-full text-sm font-medium text-gray-600">
        {title} <span className="text-xs font-medium text-gray-500">{`(Max Length ${limit} characters)`}</span>
      </label>
      <textarea
        id={id}
        name={id}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={id}
        rows={10}
        className="w-full text-base font-normal border border-gray-300 rounded-lg p-3 text-gray-500 resize-none"
        maxLength={limit}
      />
    </div>
  );
}
