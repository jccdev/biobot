import { Kit } from "../shared-types/kit";
import { PagedResult } from "../shared-types/pagedResult";
import { DataAccess } from "./dataAccess";

export class KitsService {
	static async get(options?: Partial<{ search?: string; pageSize: number; page: number;}>): Promise<PagedResult<Kit>> {
		const innerOpts = {
			search: options.search,
			pageSize: options.pageSize ?? 10,
			page: options.page ?? 1,
		}
		
		let query = DataAccess.db.select();

		if(innerOpts.search) {
			const match = `%${innerOpts.search}%`;
			query = query
				.orWhere('id', 'like', match)
				.orWhere('label_id', 'like', match)
				.orWhere('shipping_tracking_code', 'like', match)
		}
		
		const data = await query.clone().offset((innerOpts.page - 1) * innerOpts.pageSize).limit(innerOpts.pageSize).from<Kit>('kits');
		const total_count = +((await query.clone().count('*').from<Kit>('kits'))[0]['count(*)']);
		
		return { data, page: innerOpts.page, pageSize: innerOpts.pageSize, totalCount: total_count };
	}

	static async getSingle(id: number): Promise<Kit> {
		return DataAccess.db.where({id: id}).first().from<Kit>('kits');
	}

	static async autocomplete(search: string): Promise<Kit[]> {
		const match = `%${search}%`;
		return await DataAccess.db
			.orWhere('id', 'like', match)
			.orWhere('label_id', 'like', match)
			.orWhere('shipping_tracking_code', 'like', match)
			.from<Kit>('kits');
	}
}
