import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();
const port = 3001;

router.get('/', async (ctx) => {
	let desc = 'Biobot Kits API';
	desc += '\nGET /kits';
	desc += '\nPOST /kits'
	desc += '\nPUT /kits/{id}'
	desc += '\nDELETE /kits/{id}'
	desc += '\nPOST /kits/upload';
	ctx.body = desc;
});

router.get('/kits', (ctx) => {
	const kits = [
		{ id: 1, labelId: "84-507-1938", shippingTrackingCode : "3241486508" }
	];

  ctx.body = kits;
});

app
	.use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});