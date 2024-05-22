import { Link, useSubmit } from '@remix-run/react';

import LOCALES from '~/locales/language_en.json';

import { UserDataEntry } from '~/services/Auth';

export default function PrivateNavBar({ user, title }: { user: UserDataEntry; title: string }) {
  const submit = useSubmit();

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append('type', 'sign_out');
    submit(formData, { method: 'post' });
  };

  const LocalStrings = LOCALES.dash;
  return (
    <div className="w-full flex gap-5 tems-center p-8 flex-wrap">
      <div className="flex flex-1">
        <Link
          to="/settings"
          className={`flex flex-row gap-3 rounded bg-opacity-50 backdrop-blur-sm self-start px-5 py-2.5 ${user.color} shadow-sm cursor-pointer`}>
          <div className="flex justify-center rounded-full w-8 h-8 flex-none bg-white bg-opacity-50 backdrop-blur-sm p-[1px]">
            <img alt="create-img" className="w-full h-full rounded-full object-cover" src={user.avatar} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-600 text-xl">{user.username}</p>
          </div>
        </Link>
      </div>
    <div className="flex flex-shrink-[1] flex-grow-[1] justify-center basis-auto">
      <h1 className="text-red-700 text-4xl text-center m-0 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        {title}
      </h1>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          className="rounded-lg w-full max-w-button px-5 py-2.5 text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center"
          type="button"
          onClick={handleSubmit}>
          {LocalStrings.primary_button}
        </button>
      </div>
    </div>
  );
}
