export const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">Please wait...</p>
      </div>
    </div>
  );
};
