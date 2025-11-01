type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  return <div>PostPage: {id}</div>;
}
