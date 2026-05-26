export function ScanlineOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 mix-blend-screen">
      <div className="scanline-mask absolute inset-0 opacity-[0.16]" />
      <div className="absolute inset-x-0 top-0 h-1/2 animate-scan bg-gradient-to-b from-transparent via-cyan/10 to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_110px_rgba(0,0,0,0.62)]" />
    </div>
  );
}
