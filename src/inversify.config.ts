import { Container } from 'inversify';
import { AlphaVantageApi } from './services/alpha-vantage';
import { Stocks } from './services/stocks';

const depenciesContainer = new Container();
depenciesContainer.bind<AlphaVantageApi>(AlphaVantageApi.name).to(AlphaVantageApi);
depenciesContainer.bind<Stocks>(Stocks.name).to(Stocks);

export { depenciesContainer };
