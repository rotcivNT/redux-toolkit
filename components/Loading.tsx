export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <div className="size-12 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 size-12 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
      </div>
    </div>
  );
}
