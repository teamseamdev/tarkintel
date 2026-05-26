interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="min-h-screen p-4 pb-28 lg:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        {children}
      </div>
    </div>
  );
}