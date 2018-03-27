// Copyright 2018 Clément Bizeau
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Koa from 'koa';
import * as cors from 'koa2-cors';
import * as Router from 'koa-router';
import * as request from 'request-promise-native';
import { depenciesContainer } from './inversify.config';
import { Stocks, CloseHist } from './services/stocks';

const app = new Koa();
const router = new Router();
const stocksApi = depenciesContainer.get<Stocks>(Stocks.name);

router.get('/history/list', async (ctx, next) => {
  const stocks: CloseHist[][] = [];
  for (const symbol of ctx.query.symbols) {
    const stock = await stocksApi.getCloseHist(symbol).toPromise();
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
