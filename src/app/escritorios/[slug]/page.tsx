import { notFound } from 'next/navigation';
import { offices } from '@/data/offices';
import { Office } from '@/types/office';
import OfficeProfileCard from '@/components/OfficeProfileCard';
import { NavigationMenu } from '@/app/navigation-menu';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReviewForm } from '@/components/ReviewForm';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return offices.map((office) => ({
    slug: office.slug,
  }));
}

function getOffice(slug: string): Office | undefined {
  return offices.find((o) => o.slug === slug);
}

export default function OfficeProfilePage({ params }: Props) {
  const office = getOffice(params.slug);

  if (!office) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      <div className="container mx-auto p-4 sm:p-8">
        <header className="mb-8">
          <Button asChild variant="outline">
            <Link href="/escritorios">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a lista de escritórios
            </Link>
          </Button>
        </header>

        <main className="space-y-8">
          <OfficeProfileCard office={office} />
          
          <div className="max-w-3xl mx-auto">
            <ReviewForm lawyerId={office.id} />
          </div>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}