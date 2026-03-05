import { db } from '../db/connection.js';
import type { Deputy } from '../types.js';

interface UpsertDeputyInput {
  externalId: string;
  name: string;
  party: string;
  state: string;
  photoUrl: string;
}

export const deputyRepository = {
  upsert(input: UpsertDeputyInput): Deputy {
    db.prepare(
      `
      INSERT INTO deputies (external_id, name, party, state, photo_url)
      VALUES (@externalId, @name, @party, @state, @photoUrl)
      ON CONFLICT(external_id) DO UPDATE SET
        name = excluded.name,
        party = excluded.party,
        state = excluded.state,
        photo_url = excluded.photo_url;
      `,
    ).run(input);

    return this.findByExternalId(input.externalId)!;
  },

  findByExternalId(externalId: string): Deputy | undefined {
    return db.prepare('SELECT * FROM deputies WHERE external_id = ?').get(externalId) as Deputy | undefined;
  },

  searchLocal(query: string): Deputy[] {
    const term = `%${query}%`;
    return db.prepare('SELECT * FROM deputies WHERE name LIKE ? ORDER BY name ASC LIMIT 25').all(term) as Deputy[];
  },
};
