import Router from 'koa-router';
import { KitsService } from '../services/kitsService';

function convertToNullableInt(value: string) : number{
	const converted = parseInt(value);
	if(isNaN(converted)) {
		return null;
	}
	return converted;
}

export function registerKitRoutes(router: Router) {
	router.get('/kits', async (ctx) => {
		const search = ctx.query['search'] as string;
		let page: number = convertToNullableInt(ctx.query['page'] as string);
		const pageSize: number = convertToNullableInt(ctx.query['pageSize'] as string);
		const kits = await KitsService.get({search, page, pageSize});
		ctx.body = kits;
	});

	router.get('/kits/autocomplete', async (ctx) => {
		const searchText = ctx.query['search'] as string;
		const kits = await KitsService.autocomplete(searchText);
		ctx.body = kits;
	})

	router.get('/kits/:id', async (ctx) => {
		const id = convertToNullableInt(ctx.params.id) ?? -1;
		const kit = await KitsService.getSingle(id);
		if(kit) {
			ctx.body = kit;
		}
		else {
			ctx.status = 404;
			ctx.message = 'Not found.';
		}
	});
}