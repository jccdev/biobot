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
		let page: number = convertToNullableInt(ctx.query['page'] as string);
		const pageSize: number = convertToNullableInt(ctx.query['pageSize'] as string);
		const kits = await KitsService.get({page, pageSize});
		ctx.body = kits;
	});

	router.get('/kits/search', async (ctx) => {
		const searchText = ctx.query['text'] as string;
		const kits = await KitsService.search(searchText);
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