import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { getMovieById } from "@/app/lib/api.type";
import Breadcrumb from "@/app/components/Breadcrumb/Breadcrumb";

interface MoviePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  try {
    const movie = await getMovieById(params.id);

    return {
      title: `${movie.title} | Movie Database`,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Movie Not Found | Movie Database",
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  let movie;

  try {
    movie = await getMovieById(params.id);
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/" },
    { label: movie.title },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Poster */}
            <div className="md:w-1/3">
              <div className="relative h-96 md:h-full">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{movie.title}</h1>

              {movie.tagline && (
                <p className="text-xl text-gray-600 italic mb-6">{"}{movie.tagline}{"}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="font-semibold text-gray-700">Release Date:</span>
                  <p className="text-gray-900">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Runtime:</span>
                  <p className="text-gray-900">
                    {movie.runtime ? `${movie.runtime} minutes` : "N/A"}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Rating:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-900">
                      {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Status:</span>
                  <p className="text-gray-900">{movie.status}</p>
                </div>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6">
                  <span className="font-semibold text-gray-700">Genres:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movie.genres.map((genre: { id: number; name: string }) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Overview</h2>
                <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
              </div>

              {movie.budget > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">Budget:</span>
                    <p className="text-gray-900">
                      ${movie.budget.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">Revenue:</span>
                    <p className="text-gray-900">
                      ${movie.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
