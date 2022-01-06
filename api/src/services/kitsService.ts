import { Kit } from '../shared-types/kit';
import { PagedResult } from '../shared-types/pagedResult';
import { DataAccess } from './dataAccess';
import { CacheService } from './cacheService';

export class KitsService {
	static async get(
		options?: Partial<{
			search?: string;
			exact?: boolean;
			pageSize: number;
			page: number;
		}>,
	): Promise<PagedResult<Kit>> {
		// map options to default
		const innerOpts = {
			exact: options.exact ?? false,
			search: options.search,
			pageSize: options.pageSize ?? 10,
			page: options.page ?? 1,
		};

		// default query
		let query = DataAccess.db<Kit>('kits');

		if (innerOpts.search != null) {
			// if its an exact search match return single result
			if (options.exact) {
				query = query.where({ id: +innerOpts.search });
			} else {
				// return any match
				const match = `%${innerOpts.search}%`;
				query = query
					.orWhere('id', 'like', match)
					.orWhere('label_id', 'like', match)
					.orWhere('shipping_tracking_code', 'like', match);
			}
		}

		// get paged results
		const data = await query
			.clone()
			.offset((innerOpts.page - 1) * innerOpts.pageSize)
			.limit(innerOpts.pageSize);

		// get total count of all results
		const total_count = +(await query.clone().count())[0]['count(*)'];

		return {
			data,
			page: innerOpts.page,
			pageSize: innerOpts.pageSize,
			totalCount: total_count,
		};
	}

	static async getSingle(id: number): Promise<Kit> {
		return DataAccess.db.where({ id: id }).first().from<Kit>('kits');
	}

	static async upload(kits: []): Promise<void> {
		const batchSize = 100;

		while (kits.length > 0) {
			const max = kits.length < batchSize ? kits.length : batchSize;
			const batch = kits.splice(0, max);
			await DataAccess.db<Kit>('kits').insert(batch).onConflict('id').merge();
		}

		return;
	}

	static async autocomplete(search: string): Promise<Kit[]> {
		const cacheHit = CacheService.get<Kit[]>('kits', search);
		if (cacheHit) {
			return cacheHit;
		}

		const limit = 10;
		let results: Kit[] = [];

		// id match is first rank result
		const exactId = await DataAccess.db
			.where({ id: +search })
			.first()
			.from<Kit>('kits');

		if (exactId) {
			if (this.limitAdd([exactId], results, limit)) {
				return this.cacheAndReturn(search, results);
			}
		}

		// next rank is label exact matches
		const exactLabels = await DataAccess.db
			.where({ label_id: search })
			.limit(limit)
			.from<Kit>('kits');

		if (exactLabels.length > 0) {
			if (this.limitAdd(exactLabels, results, limit)) {
				return this.cacheAndReturn(search, results);
			}
		}

		// next rank is tracking exact matches
		const exactTracking = await DataAccess.db
			.where({ shipping_tracking_code: search })
			.limit(limit)
			.from<Kit>('kits');

		if (exactTracking) {
			if (this.limitAdd(exactLabels, results, limit)) {
				return this.cacheAndReturn(search, results);
			}
		}

		// final is partial matches
		const match = `${search}%`;
		const partial = await DataAccess.db
			.orWhere('id', 'like', match)
			.orWhere('label_id', 'like', match)
			.orWhere('shipping_tracking_code', 'like', match)
			.limit(limit)
			.from<Kit>('kits');

		this.limitAdd(partial, results, limit);
		return this.cacheAndReturn(search, results);
	}

	private static limitAdd(forAdd: Kit[], all: Kit[], limit: number) {
		for (let i = 0; i < forAdd.length; i++) {
			if (all.find((x) => x.id === forAdd[i].id) == null) {
				all.push(forAdd[i]);
			}
			if (all.length === limit) {
				return true;
			}
		}

		return false;
	}

	private static cacheAndReturn(key: string, kits: Kit[]) {
		CacheService.set<Kit[]>('kits', key, kits);
		return kits;
	}
}
