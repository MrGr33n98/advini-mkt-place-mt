import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { usersApi, RailsUser, RailsApiResponse } from '@/lib/rails-api';

interface Props {
  initialData: RailsApiResponse<RailsUser[]> | null;
  error: string | null;
}

export default function RailsUsersPage({ initialData, error }: Props) {
  const [users, setUsers] = useState(initialData?.users || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialData?.meta?.current_page || 1);

  const loadPage = async (page: number) => {
    setLoading(true);
    try {
      const data = await usersApi.getAll(page, 10);
      setUsers(data.users || []);
      setCurrentPage(page);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Erro ao carregar usuários
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Usuários do Rails
          </h1>
          <p className="text-gray-600">
            Dados carregados via SSR do backend Rails
          </p>
          <div className="mt-4 text-sm text-blue-600">
            <span className="font-medium">Renderização:</span> Server-Side (SSR)
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: RailsUser) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-400">ID: {user.id}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {user.email}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-gray-500 text-xs">Posts</div>
                    <div className="font-semibold text-gray-900">
                      {user.posts_count}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-gray-500 text-xs">Comentários</div>
                    <div className="font-semibold text-gray-900">
                      {user.comments_count}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div>
                    <span className="font-medium">Criado:</span>{' '}
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div>
                    <span className="font-medium">Atualizado:</span>{' '}
                    {new Date(user.updated_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* User Posts Preview */}
                {user.posts && user.posts.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Posts recentes:
                    </div>
                    <div className="space-y-1">
                      {user.posts.slice(0, 2).map((post) => (
                        <div key={post.id} className="text-xs text-gray-600 truncate">
                          • {post.title}
                        </div>
                      ))}
                      {user.posts.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{user.posts.length - 2} mais...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-600">Carregando...</span>
            </div>
          </div>
        )}

        {/* Pagination */}
        {initialData?.meta && initialData.meta.total_pages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => loadPage(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span className="text-sm text-gray-700">
              Página {currentPage} de {initialData.meta.total_pages}
              {' '}({initialData.meta.total_count} usuários total)
            </span>
            
            <button
              onClick={() => loadPage(currentPage + 1)}
              disabled={currentPage >= initialData.meta.total_pages || loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-500">
              Não há usuários disponíveis no momento.
            </p>
          </div>
        )}

        {/* SSR Info */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            Informações SSR
          </h3>
          <div className="text-xs text-green-600 space-y-1">
            <p>Dados carregados no servidor durante o build</p>
            <p>Endpoint: {process.env.NEXT_PUBLIC_API_URL}/users</p>
            <p>Renderização: Server-Side Rendering (SSR)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Server-Side Rendering
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch data from Rails API during server-side rendering
    const data = await usersApi.getAll(1, 10);
    
    return {
      props: {
        initialData: data,
        error: null,
      },
    };
  } catch (error) {
    console.error('SSR Error:', error);
    
    return {
      props: {
        initialData: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
    };
  }
};