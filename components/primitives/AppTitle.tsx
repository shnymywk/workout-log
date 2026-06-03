type AppTitleProps = {
  title: string;
  description: string;
};

export function AppTitle({ title, description }: AppTitleProps) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
