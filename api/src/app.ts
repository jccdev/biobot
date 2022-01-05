import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { registerKitRoutes } from './routes/kitRoutes';

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

registerKitRoutes(router);

app
	.use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});