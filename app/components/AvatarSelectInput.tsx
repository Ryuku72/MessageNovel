export type AvatarInputProps = {
  title: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AvatarInput({ title, id, value, onChange }: AvatarInputProps) {
  return (
    <div className="flex flex-shrink-0 flex-col justify-center items-center">
      <label
        htmlFor={id}
        className="flex flex-col items-center gap-2 font-mono font-medium text-sm text-gray-600 cursor-pointer hover:text-blue-500">
        <img alt="create-img" className="w-32 h-32 rounded-full object-cover" src={value} />
        {title}
        <input id={id} name={id} className="hidden" type="file" onChange={onChange} />
      </label>
    </div>
  );
}
