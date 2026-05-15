'use client';
import { useParams } from 'next/navigation';
import { ProjectFormView } from '@/app/projects/new/page';
export default function ProjectEditPage() {
  const { id } = useParams();
  return <ProjectFormView editId={id} />;
}
