import { notFound } from "next/navigation";
import { offices } from "@/data/offices";
import { NavigationMenu } from "@/app/navigation-menu";
import EnhancedOfficeProfileCard from "@/components/EnhancedOfficeProfileCard";
import { ReviewForm } from "@/components/ReviewForm";

interface OfficeProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: OfficeProfilePageProps) {
  const { slug } = await params;
  const office = offices.find((office) => office.slug === slug);
  
  if (!office) {
    return {
      title: "Escritório não encontrado",
    };
  }

  return {
    title: `${office.name} - Escritório de Advocacia`,
    description: office.description || `Conheça o escritório ${office.name}, especializado em ${office.specialties.join(', ')}.`,
    keywords: `${office.name}, escritório advocacia, ${office.specialties.join(', ')}, advogados Cuiabá`,
    openGraph: {
      title: `${office.name} - Escritório de Advocacia`,
      description: office.description || `Conheça o escritório ${office.name}, especializado em ${office.specialties.join(', ')}.`,
      images: [office.logo_url],
    },
  };
}

export default async function OfficeProfilePage({ params }: OfficeProfilePageProps) {
  const { slug } = await params;
  const office = offices.find((office) => office.slug === slug);

  if (!office) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <EnhancedOfficeProfileCard office={office} />
        <div className="mt-8">
          <ReviewForm lawyerId={office.id} />
        </div>
      </div>
    </div>
  );
}