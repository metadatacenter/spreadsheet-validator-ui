import gtag from 'ga-gtag';

const useBatchFillout = () => gtag('event', 'batch_fillout', {
  event_category: 'Repair Completeness',
  event_label: 'Using batch fillout feature',
});

const useColumnFilter = () => gtag('event', 'column_filter', {
  event_category: 'Repair Completeness',
  event_label: 'Using column filter feature',
});

const acceptAllSuggestions = () => gtag('event', 'accept_all_suggestions', {
  event_category: 'Repair Adherence',
  event_label: 'Accepting all repair suggestions',
});

const acceptSuggestion = () => gtag('event', 'accept_suggestion', {
  event_category: 'Repair Adherence',
  event_label: 'Accepting single repair suggestion',
});

const rejectSuggestion = () => gtag('event', 'reject_suggestion', {
  event_category: 'Repair Adherence',
  event_label: 'Rejecting single repair suggestion',
});

const gaEvents = {
  useBatchFillout,
  useColumnFilter,
  acceptAllSuggestions,
  acceptSuggestion,
  rejectSuggestion,
};

export default { gaEvents };
