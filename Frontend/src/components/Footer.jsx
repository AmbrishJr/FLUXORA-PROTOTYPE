function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-16 bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="space-y-1 text-center md:text-left">
          <p className="font-medium text-slate-200">
            Fluxora – Smart Mobility prototype.
          </p>
          <p>
            Powered by FastAPI, React, TailwindCSS, and Mapbox.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Fluxora team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

