import { db } from '../db/connection.js';
import type { Vote } from '../types.js';

interface UpsertVoteInput {
  projectId: number;
  deputyId: number;
  voteValue: string;
  voteDateTime: string | null;
}

export const voteRepository = {
  upsert(input: UpsertVoteInput): void {
    db.prepare(
      `
      INSERT INTO votes (project_id, deputy_id, vote_value, vote_datetime)
      VALUES (@projectId, @deputyId, @voteValue, @voteDateTime)
      ON CONFLICT(project_id, deputy_id) DO UPDATE SET
        vote_value = excluded.vote_value,
        vote_datetime = excluded.vote_datetime;
      `,
    ).run(input);
  },

  listByProject(projectId: number): (Vote & { deputy_name: string; party: string; state: string; photo_url: string })[] {
    return db
      .prepare(
        `
        SELECT
          v.*,
          d.name as deputy_name,
          d.party as party,
          d.state as state,
          d.photo_url as photo_url
        FROM votes v
        INNER JOIN deputies d ON d.id = v.deputy_id
        WHERE v.project_id = ?
        ORDER BY d.name ASC
        `,
      )
      .all(projectId) as (Vote & { deputy_name: string; party: string; state: string; photo_url: string })[];
  },

  listByDeputy(deputyId: number): Array<{
    vote_value: string;
    vote_datetime: string | null;
    project_external_id: string;
    project_title: string;
    relevance_score: number;
    relevance_label: string;
    interest_type: string;
  }> {
    return db
      .prepare(
        `
        SELECT
          v.vote_value,
          v.vote_datetime,
          p.external_id as project_external_id,
          p.title as project_title,
          p.relevance_score,
          p.relevance_label,
          p.interest_type
        FROM votes v
        INNER JOIN projects p ON p.id = v.project_id
        WHERE v.deputy_id = ?
        ORDER BY v.vote_datetime DESC
        `,
      )
      .all(deputyId) as Array<{
      vote_value: string;
      vote_datetime: string | null;
      project_external_id: string;
      project_title: string;
      relevance_score: number;
      relevance_label: string;
      interest_type: string;
    }>;
  },
};
