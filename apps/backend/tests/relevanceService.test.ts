import { describe, expect, it } from 'vitest';
import { relevanceService } from '../src/services/relevanceService.js';

describe('relevanceService', () => {
  it('classifica como alta relevancia e interesse_povo quando texto tem termos sociais', () => {
    const result = relevanceService.scoreFromText('Projeto para saude, educacao e seguranca publica');
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.label).toBe('Alta relevancia');
    expect(result.interestType).toBe('interesse_povo');
  });

  it('classifica como interesse_proprio quando texto tem termos de interesse proprio', () => {
    const result = relevanceService.scoreFromText('Projeto sobre fundo eleitoral e beneficio parlamentar');
    expect(result.interestType).toBe('interesse_proprio');
  });
});
