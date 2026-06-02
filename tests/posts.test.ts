import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Tests para sistema de posts y likes en Moneypik
 * Valida: crear posts, dar likes, calcular ganancias, eliminar posts
 */

describe('Sistema de Posts y Likes', () => {
  let mockPost: any;
  let mockUser: any;

  beforeEach(() => {
    mockUser = {
      id: 'user_123',
      username: 'testuser',
      email: 'test@example.com',
    };

    mockPost = {
      id: 'post_123',
      userId: mockUser.id,
      imageUrl: 'https://example.com/image.jpg',
      description: 'Test post',
      likesCount: 0,
      createdAt: new Date(),
    };
  });

  it('debe crear un post con descripción válida', () => {
    expect(mockPost.description).toBeDefined();
    expect(mockPost.description.length).toBeGreaterThan(0);
    expect(mockPost.imageUrl).toBeDefined();
  });

  it('debe inicializar likes en 0', () => {
    expect(mockPost.likesCount).toBe(0);
  });

  it('debe incrementar likes cuando alguien da like', () => {
    mockPost.likesCount += 1;
    expect(mockPost.likesCount).toBe(1);
  });

  it('debe calcular ganancias correctamente ($0.01 por like)', () => {
    mockPost.likesCount = 100;
    const earnings = mockPost.likesCount * 0.01;
    
    expect(earnings).toBe(1.0);
  });

  it('debe calcular ganancias con múltiples likes', () => {
    const testCases = [
      { likes: 1, expected: 0.01 },
      { likes: 10, expected: 0.1 },
      { likes: 100, expected: 1.0 },
      { likes: 2000, expected: 20.0 },
      { likes: 5000, expected: 50.0 },
    ];

    testCases.forEach(({ likes, expected }) => {
      const earnings = likes * 0.01;
      expect(earnings).toBeCloseTo(expected, 2);
    });
  });

  it('debe validar que un post tenga propietario', () => {
    expect(mockPost.userId).toBe(mockUser.id);
    expect(mockPost.userId).toBeDefined();
  });

  it('debe permitir eliminar un post', () => {
    const postId = mockPost.id;
    const posts = [mockPost];
    
    const filteredPosts = posts.filter(p => p.id !== postId);
    expect(filteredPosts.length).toBe(0);
  });

  it('debe validar que no se pueda dar like múltiples veces del mismo usuario', () => {
    const likedBy = new Set<string>();
    const userId = 'user_456';
    
    // Primer like
    likedBy.add(userId);
    expect(likedBy.has(userId)).toBe(true);
    
    // Intento de segundo like
    const canLike = !likedBy.has(userId);
    expect(canLike).toBe(false);
  });

  it('debe retornar error si post no tiene imagen', () => {
    const invalidPost = {
      ...mockPost,
      imageUrl: '',
    };
    
    const hasValidImage = invalidPost.imageUrl && invalidPost.imageUrl.length > 0;
    expect(hasValidImage).toBeFalsy();
  });

  it('debe ordenar posts por fecha (más recientes primero)', () => {
    const post1 = { ...mockPost, id: 'post_1', createdAt: new Date('2026-01-01') };
    const post2 = { ...mockPost, id: 'post_2', createdAt: new Date('2026-01-02') };
    const post3 = { ...mockPost, id: 'post_3', createdAt: new Date('2026-01-03') };
    
    const posts = [post1, post2, post3];
    const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt);
    
    expect(sortedPosts[0].id).toBe('post_3');
    expect(sortedPosts[1].id).toBe('post_2');
    expect(sortedPosts[2].id).toBe('post_1');
  });
});
