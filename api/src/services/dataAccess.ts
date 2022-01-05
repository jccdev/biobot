import knex, { Knex } from 'knex';

export class DataAccess {
	private static _db: Knex<any, unknown[]> = null;
	
	private constructor() {
		// static class
	}

	static get db(): Knex<any, unknown[]> {
		if(this._db == null) {
			this._db = knex({
				client: 'sqlite3',
				connection: {
					filename: "./db/local.sqlite3"
				},
				useNullAsDefault: true
			});
		}
		return this._db;
	}
}
