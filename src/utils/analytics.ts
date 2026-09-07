import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

export const initGA = () => {
    if (!GA_MEASUREMENT_ID) return;
    ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = () => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
};

export const logEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({ category, action, label });
};