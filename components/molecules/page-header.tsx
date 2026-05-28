interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-16 text-center md:text-left">
      <h1 className="text-5xl font-extrabold tracking-tight mb-2">{title}</h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
