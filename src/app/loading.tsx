export default function Loading() {
  return (
    <div className="mt-5 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="font-extrabold md:text-5xl text-3xl">
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: 31 }).map((_, index) => (
            <div
              key={index}
              className={`inline-block bg-gray-300 rounded animate-pulse ${
                [7, 10, 14].includes(index)
                  ? "w-4 h-12 md:h-16"
                  : "w-6 h-12 md:h-16"
              }`}
              style={{
                animationDelay: `${index * 0.08}s`,
                animationDuration: "1.8s",
              }}
            />
          ))}
        </div>
      </div>
      <div className="max-w-5xl w-full space-y-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-11/12"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-10/12"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-9/12"></div>
        </div>

        <div className="grid place-items-center">
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
