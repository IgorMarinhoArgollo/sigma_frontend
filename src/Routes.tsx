import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import App from './pages/App';
import Details from './pages/Details';
import NoMatch from './pages/NoMatch';
import Edit from './pages/Edit';

const routes: RouteObject[] = [
  { path: '/', element: <App />, index: true },
  { path: '/details', element: <Details /> },
  { path: '/edit', element: <Edit /> },
  { path: '*', element: <NoMatch /> },
];

function Routes() {
  const element = useRoutes(routes);
  return element;
}

export default Routes;
