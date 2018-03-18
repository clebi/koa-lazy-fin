import * as Koa from 'koa';
import * as cors from 'koa2-cors';
import * as Router from 'koa-router';
import * as request from 'request-promise-native';
import { AlphaVantageApi, StocksApi } from './services/stocks';

const app = new Koa();
const router = new Router();
let stocksApi: StocksApi = new AlphaVantageApi();

class CloseHist {
  constructor(readonly symbol: string, readonly mstime: number, readonly close: number, readonly mv_close: number) { }
}

router.get('/history/list', async (ctx, next) => {
  let stocks = new Array<CloseHist[]>();
  for (let symbol of ctx.query.symbols) {
    var sma = await stocksApi.getSMA(symbol);
    var hist = await stocksApi.getHistory(symbol);
    let stock = new Array<CloseHist>();
    for (let day in hist['Time Series (Daily)']) {
      if (hist['Time Series (Daily)'][day]['4. close'] <= 0) {
        continue;
      }
      stock.push(new CloseHist(
        symbol,
        new Date(day).getTime(),
        hist['Time Series (Daily)'][day]['4. close'],
        sma['Technical Analysis: SMA'][day]['SMA'])
      );
    }
    stocks.push(stock);
  }
  ctx.type = 'application/json';
  ctx.body = JSON.stringify(stocks);
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
