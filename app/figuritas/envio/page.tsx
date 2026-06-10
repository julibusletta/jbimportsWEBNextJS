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
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <EnvioForm pack={pack} />
      </div>
    </main>
  );
}
