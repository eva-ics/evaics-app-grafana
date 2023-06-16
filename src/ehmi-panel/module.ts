import { PanelPlugin } from '@grafana/data';
import { EvaEHMIOptions } from './types';
import { EvaEHMIPanel } from './components/EvaEHMIPanel';

export const plugin = new PanelPlugin<EvaEHMIOptions>(EvaEHMIPanel);
