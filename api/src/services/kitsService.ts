import { Kit } from "../types/kit";
import { DataAccess } from "./dataAccess";

export class KitsService {
	static async get(options?: Partial<{ pageSize: number; page: number;}>): Promise<{ values: Kit[], page: number, pageSize: number, total_count: number }> {
		const innerOpts = {
			pageSize: options.pageSize ?? 20,
			page: options.page ?? 1,
		}
		
		let query = DataAccess.db.select();
		const values = await query.clone().offset((innerOpts.page - 1) * innerOpts.pageSize).limit(innerOpts.pageSize).from<Kit>('kits');
		const total_count = +((await query.clone().count('*').from<Kit>('kits'))[0]['count(*)']);
		
		return { values, page: innerOpts.page, pageSize: innerOpts.pageSize, total_count };
	}

	static async getSingle(id: number): Promise<Kit> {
		return DataAccess.db.where({id: id}).first().from<Kit>('kits');
	}

	static async search(text: string): Promise<Kit[]> {
		const match = `%${text}%`;
		return await DataAccess.db
			.orWhere('id', 'like', match)
			.orWhere('label_id', 'like', match)
			.orWhere('shipping_tracking_code', 'like', match)
			.from<Kit>('kits');
	}
}
