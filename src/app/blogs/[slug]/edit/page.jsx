'use client';

import { useParams } from 'next/navigation';
import { BlogFormView } from '@/app/blogs/new/page';

// /blogs/[slug]/edit — here `slug` param holds the blog _id for editing
export default function BlogEditPage() {
  const { slug } = useParams();
  return <BlogFormView editId={slug} />;
}
