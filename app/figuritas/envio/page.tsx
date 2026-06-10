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
    <main className="min-h-screen w-full bg-white text-gray-900 pt-32 pb-16 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center mx-auto">
        <EnvioForm pack={pack} />
      </div>
    </main>
  );
}
