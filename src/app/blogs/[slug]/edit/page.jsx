'use client';
import { useParams } from 'next/navigation';
import { BlogFormView } from '@/app/blogs/new/page';
export default function BlogEditPage() {
  const { slug } = useParams();
  return <BlogFormView editId={slug} />;
}
