import { PACKS } from '../data';
import EnvioForm from './EnvioForm';
import { redirect } from 'next/navigation';

export default async function EnvioPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const packId = searchParams.pack;
  
  if (!packId || typeof packId !== 'string') {
    redirect('/figuritas');
  }

  const pack = PACKS.find((p) => p.id === packId);

  if (!pack) {
    redirect('/figuritas');
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto w-full">
        <EnvioForm pack={pack} />
      </div>
    </main>
  );
}
