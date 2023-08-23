import ReactGA from 'react-ga';

const useBatchFillout = () => ReactGA.event({
  category: 'Repair Completeness',
  action: 'batch_fillout',
  label: 'Using batch fillout feature',
});

const useColumnFilter = () => ReactGA.event({
  category: 'Repair Completeness',
  action: 'column_filter',
  label: 'Using column filter feature',
});

const acceptAllSuggestions = () => ReactGA.event({
  category: 'Repair Adherence',
  action: 'accept_all_suggestions',
  label: 'Accepting all repair suggestions',
});

const acceptSuggestion = () => ReactGA.event({
  category: 'Repair Adherence',
  action: 'accept_suggestion',
  label: 'Accepting single repair suggestion',
});

const rejectSuggestion = () => ReactGA.event({
  category: 'Repair Adherence',
  action: 'reject_suggestion',
  label: 'Rejecting single repair suggestion',
});

const gaEvents = {
  useBatchFillout,
  useColumnFilter,
  acceptAllSuggestions,
  acceptSuggestion,
  rejectSuggestion,
};

export default { gaEvents };
