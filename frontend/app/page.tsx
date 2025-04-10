import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="dark bg-foreground text-background">
        <h1>Hello World</h1>
      </div>
      <div className="dark bg-card-foreground text-background">
        <h1>Hello World</h1>
      </div>
      <div className="dark bg-sidebar-foreground text-background">
        <h1>Hello World</h1>
      </div>
    </div>
  );
}
