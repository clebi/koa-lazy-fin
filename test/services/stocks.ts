import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
import 'mocha';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { AlphaVantageApi, HistoryPoint, SMAPoint } from '../../src/services/alpha-vantage';
import { Stocks } from '../../src/services/stocks';

const TEST_SYMBOL = 'CW8.PA';
const TEST_HISTORY_POINTS: HistoryPoint[] = [
  new HistoryPoint(TEST_SYMBOL, 10, 50),
  new HistoryPoint(TEST_SYMBOL, 20, 60),
];
const TEST_SMA_POINTS: Map<number, SMAPoint> = new Map([
  [10, new SMAPoint(TEST_SYMBOL, 10, 100)],
  [20, new SMAPoint(TEST_SYMBOL, 20, 110)],
]);

describe('stocks services', () => {
  it('should two CloseHist', async () => {
    const mockApi: TypeMoq.IMock<AlphaVantageApi> = TypeMoq.Mock.ofType<AlphaVantageApi>();
    mockApi.setup(x => x.getHistory(TEST_SYMBOL)).returns(() => {
      return from(TEST_HISTORY_POINTS);
    });
    mockApi.setup(x => x.getSMA(TEST_SYMBOL)).returns(() => {
      return of(TEST_SMA_POINTS);
    });
    const stocks = new Stocks(mockApi.object);
    const hist = await stocks.getCloseHist(TEST_SYMBOL).toPromise();
    expect(hist).to.be.a(Array.name);
    expect(hist.length).to.be.eq(TEST_HISTORY_POINTS.length);
    hist.forEach((item, index) => {
      expect(item.symbol).to.be.eq(TEST_SYMBOL);
      expect(item.mstime).to.be.eq(TEST_HISTORY_POINTS[index].mstime);
      expect(item.close).to.be.eq(TEST_HISTORY_POINTS[index].close);
      expect(item.mvClose).to.be.eq(TEST_SMA_POINTS.get(item.mstime).value);
    });
  });
});
