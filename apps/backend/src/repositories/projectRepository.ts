import { db } from '../db/connection.js';
import type { InterestType, Project } from '../types.js';

interface UpsertProjectInput {
  externalId: string;
  title: string;
  summary: string;
  status: string;
  voteDate: string | null;
  relevanceScore: number;
  relevanceLabel: string;
  interestType: InterestType;
}

export const projectRepository = {
  upsert(input: UpsertProjectInput): Project {
    const now = new Date().toISOString();
    db.prepare(
      `
      INSERT INTO projects (
        external_id, title, summary, status, vote_date,
        relevance_score, relevance_label, interest_type, is_relevant,
        created_at, updated_at
      ) VALUES (
        @externalId, @title, @summary, @status, @voteDate,
        @relevanceScore, @relevanceLabel, @interestType, @isRelevant,
        @createdAt, @updatedAt
      )
      ON CONFLICT(external_id) DO UPDATE SET
        title = excluded.title,
        summary = excluded.summary,
        status = excluded.status,
        vote_date = excluded.vote_date,
        relevance_score = excluded.relevance_score,
        relevance_label = excluded.relevance_label,
        interest_type = excluded.interest_type,
        is_relevant = excluded.is_relevant,
        updated_at = excluded.updated_at;
      `,
    ).run({
      externalId: input.externalId,
      title: input.title,
      summary: input.summary,
      status: input.status,
      voteDate: input.voteDate,
      relevanceScore: input.relevanceScore,
      relevanceLabel: input.relevanceLabel,
      interestType: input.interestType,
      isRelevant: input.relevanceScore >= 40 ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    });

    return this.findByExternalId(input.externalId)!;
  },

  findByExternalId(externalId: string): Project | undefined {
    return db.prepare('SELECT * FROM projects WHERE external_id = ?').get(externalId) as Project | undefined;
  },

  searchLocal(query: string): Project[] {
    const searchTerm = `%${query}%`;
    return db
      .prepare('SELECT * FROM projects WHERE title LIKE ? OR summary LIKE ? ORDER BY vote_date DESC LIMIT 30')
      .all(searchTerm, searchTerm) as Project[];
  },
};
