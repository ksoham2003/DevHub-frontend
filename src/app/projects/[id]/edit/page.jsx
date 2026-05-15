'use client';

import { useParams } from 'next/navigation';
import { ProjectFormView } from '@/app/projects/new/page';

// /projects/[id]/edit
export default function ProjectEditPage() {
  const { id } = useParams();
  return <ProjectFormView editId={id} />;
}
