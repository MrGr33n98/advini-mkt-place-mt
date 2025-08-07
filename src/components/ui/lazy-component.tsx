"use client";

import { useState, useEffect, useRef, ReactNode, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number; // Porcentagem da viewport para trigger
  rootMargin?: string;
  className?: string;
  minHeight?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Hook para Intersection Observer
function useIntersectionObserver(
  threshold = 0.1,
  rootMargin = "50px"
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

// Componente de loading skeleton customizável
interface LoadingSkeletonProps {
  type?: 'card' | 'chart' | 'table' | 'text' | 'custom';
  lines?: number;
  height?: number;
  className?: string;
}

function LoadingSkeleton({ 
  type = 'card', 
  lines = 3, 
  height = 200,
  className 
}: LoadingSkeletonProps) {
  switch (type) {
    case 'chart':
      return (
        <div className={cn("space-y-4", className)}>
          <Skeleton className="h-8 w-48" />
          <Skeleton className={`h-${height} w-full`} />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      );
    
    case 'table':
      return (
        <div className={cn("space-y-3", className)}>
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/6" />
            </div>
          ))}
        </div>
      );
    
    case 'text':
      return (
        <div className={cn("space-y-2", className)}>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={cn(
                "h-4",
                i === lines - 1 ? "w-3/4" : "w-full"
              )} 
            />
          ))}
        </div>
      );
    
    case 'card':
    default:
      return (
        <Card className={className}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className={cn(
                      "h-4",
                      i === lines - 1 ? "w-2/3" : "w-full"
                    )} 
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
  }
}

// Componente principal de lazy loading
export function LazyComponent({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "50px",
  className,
  minHeight = 200,
  onLoad,
  onError
}: LazyComponentProps) {
  const { ref, hasIntersected } = useIntersectionObserver(threshold, rootMargin);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (hasIntersected && !isLoading && !error) {
      setIsLoading(true);
      
      // Simular carregamento assíncrono
      const timer = setTimeout(() => {
        try {
          setIsLoading(false);
          onLoad?.();
        } catch (err) {
          setError(err as Error);
          setIsLoading(false);
          onError?.(err as Error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [hasIntersected, isLoading, error, onLoad, onError]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
  };

  return (
    <div 
      ref={ref} 
      className={cn("w-full", className)}
      style={{ minHeight: hasIntersected ? 'auto' : minHeight }}
    >
      {!hasIntersected ? (
        // Placeholder antes de entrar na viewport
        <div 
          className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg"
          style={{ height: minHeight }}
        >
          <div className="text-center text-muted-foreground">
            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Componente será carregado quando visível</p>
          </div>
        </div>
      ) : error ? (
        // Estado de erro
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 dark:text-red-400">
              <RefreshCw className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Erro ao carregar</h3>
              <p className="text-sm mb-4">{error.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="border-red-200 text-red-600 hover:bg-red-100"
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        // Estado de carregamento
        fallback || (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )
      ) : (
        // Conteúdo carregado
        <Suspense fallback={fallback || <LoadingSkeleton />}>
          {children}
        </Suspense>
      )}
    </div>
  );
}

// Hook para lazy loading de dados
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadData = async () => {
    if (hasLoaded) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      setHasLoaded(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    setHasLoaded(false);
    await loadData();
  };

  useEffect(() => {
    if (hasLoaded) {
      refetch();
    }
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    hasLoaded,
    loadData,
    refetch,
  };
}

// Componente para lazy loading de imagens
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className,
  fallback,
  placeholder,
  onLoad,
  onError
}: LazyImageProps) {
  const { ref, hasIntersected } = useIntersectionObserver(0.1, "50px");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {!hasIntersected ? (
        // Placeholder antes de entrar na viewport
        <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
          {placeholder ? (
            <img src={placeholder} alt="" className="opacity-50" />
          ) : (
            <div className="text-muted-foreground text-sm">Carregando...</div>
          )}
        </div>
      ) : hasError ? (
        // Estado de erro
        fallback || (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Erro ao carregar imagem</div>
          </div>
        )
      ) : (
        // Imagem
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}

// Componente para seções lazy
interface LazySectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  skeletonType?: 'card' | 'chart' | 'table' | 'text';
  skeletonLines?: number;
  className?: string;
}

export function LazySection({
  children,
  title,
  description,
  skeletonType = 'card',
  skeletonLines = 3,
  className
}: LazySectionProps) {
  return (
    <LazyComponent
      className={className}
      fallback={
        <div className="space-y-4">
          {title && (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              {description && <Skeleton className="h-4 w-96" />}
            </div>
          )}
          <LoadingSkeleton 
            type={skeletonType} 
            lines={skeletonLines}
          />
        </div>
      }
    >
      {children}
    </LazyComponent>
  );
}