import { z } from 'zod';
import { insertVideoAnalysisSchema, searchRequestSchema, analyzeRequestSchema, videoAnalysis } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  youtube: {
    search: {
      method: 'POST' as const,
      path: '/api/youtube/search',
      input: searchRequestSchema,
      responses: {
        200: z.array(z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          thumbnailUrl: z.string(),
          channelTitle: z.string(),
          publishedAt: z.string(),
        })),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    analyze: {
      method: 'POST' as const,
      path: '/api/youtube/analyze',
      input: analyzeRequestSchema,
      responses: {
        200: z.custom<typeof videoAnalysis.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<typeof videoAnalysis.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/history/:id',
      responses: {
        200: z.custom<typeof videoAnalysis.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
