import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { ROUTES } from '../../constants';
import { PageMain, PageDS, PageHelp } from '../../pages';
import { prefixRoute } from '../../utils/utils.routing';

export function App(props: AppRootProps) {
  return (
      <Switch>
        <Route exact path={prefixRoute(ROUTES.DS)} component={PageDS} />
        <Route exact path={prefixRoute(ROUTES.Help)} component={PageHelp} />

        {/* Default page */}
        <Route component={PageMain} />
      </Switch>
  );
}
