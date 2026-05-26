import dynamic from "next/dynamic";

const GameShell = dynamic(() => import("@/components/game/GameShell"), { ssr: false });

export default function Home() {
  return <GameShell />;
}
