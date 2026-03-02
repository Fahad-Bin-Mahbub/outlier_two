export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
      <p className="text-sm text-neutral-500 font-medium">Loading project...</p>
    </div>
  </div>
);
