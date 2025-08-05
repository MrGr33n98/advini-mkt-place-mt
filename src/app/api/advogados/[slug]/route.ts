import { NextResponse } from 'next/server';
import { lawyers } from '@/data/lawyers';

// Simulate a database delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await sleep(300); 

  const slug = params.slug;
  const lawyer = lawyers.find((l) => l.slug === slug);

  if (!lawyer) {
    return NextResponse.json({ error: 'Advogado não encontrado' }, { status: 404 });
  }

  return NextResponse.json(lawyer);
}