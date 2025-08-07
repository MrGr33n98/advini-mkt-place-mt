import { useState } from 'react';
import useSWR from 'swr';
import { postsApi, RailsPost, RailsApiResponse } from '@/lib/rails-api';

// SWR fetcher function
const fetcher = (url: string) => {
  const path = url.replace('/api/v1', '');
  return postsApi.getAll();
};

export default function RailsPostsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  // Use SWR to fetch posts from Rails API
  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/posts?page=${currentPage}&per_page=${perPage}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    mutate();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Erro ao carregar posts
            </h2>
            <p className="text-red-600 mb-4">
              {error.message || 'Não foi possível conectar com o servidor Rails'}
            </p>
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Posts do Rails
          </h1>
          <p className="text-gray-600">
            Dados carregados diretamente do backend Rails via API
          </p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && !data && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Posts List */}
        {data && (
          <>
            <div className="space-y-6">
              {data.posts?.map((post: RailsPost) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <header className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>Por: {post.user.email}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span>•</span>
                      <span>{post.comments_count} comentários</span>
                      {post.published_at && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Publicado</span>
                        </>
                      )}
                    </div>
                  </header>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {post.body.length > 200 
                        ? `${post.body.substring(0, 200)}...` 
                        : post.body
                      }
                    </p>
                  </div>

                  <footer className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        ID: {post.id} • Atualizado: {new Date(post.updated_at).toLocaleDateString('pt-BR')}
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Ver detalhes →
                      </button>
                    </div>
                  </footer>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {data.meta && data.meta.total_pages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <span className="text-sm text-gray-700">
                  Página {data.meta.current_page} de {data.meta.total_pages}
                  {' '}({data.meta.total_count} posts total)
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= data.meta.total_pages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}

            {/* API Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Informações da API
              </h3>
              <div className="text-xs text-blue-600 space-y-1">
                <p>Endpoint: {process.env.NEXT_PUBLIC_API_URL}/posts</p>
                <p>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
                <p>Status: {isLoading ? 'Carregando...' : 'Conectado'}</p>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {data && (!data.posts || data.posts.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-500">
              Não há posts disponíveis no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}