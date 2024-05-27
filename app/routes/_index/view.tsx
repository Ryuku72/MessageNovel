import { PublicLayout } from '~/components/PublicLayout';
import LOCALES from '~/locales/language_en.json';

export default function IndexView() {
  return (
    <PublicLayout>
      <h1 className="text-red-700 text-6xl m-0 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        {LOCALES._index.title}
      </h1>
    </PublicLayout>
  );
}
