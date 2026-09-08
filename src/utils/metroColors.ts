export interface MetroLineMeta {
  name: string;
  code: string;
  color: string;
  hex: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  ringColor: string;
  corridor: string;
  terminals: string;
  status: string;
  tagline: string;
}

export const METRO_LINES_METADATA: Record<string, MetroLineMeta> = {
  'Blue Line': {
    name: 'Blue Line',
    code: 'Line 1',
    color: 'bg-[#0072CE]',
    hex: '#0072CE',
    bgLight: 'bg-blue-50',
    textColor: 'text-[#0072CE]',
    borderColor: 'border-[#0072CE]',
    ringColor: 'ring-[#0072CE]',
    corridor: 'North-South Corridor',
    terminals: 'Dakshineswar ⇄ Kavi Subhash',
    status: 'Fully Operational',
    tagline: 'Connects iconic South & North Kolkata Pujas directly via Kalighat, Jatin Das Park, and Girish Park.',
  },
  'Green Line': {
    name: 'Green Line',
    code: 'Line 2',
    color: 'bg-[#009A44]',
    hex: '#009A44',
    bgLight: 'bg-emerald-50',
    textColor: 'text-[#009A44]',
    borderColor: 'border-[#009A44]',
    ringColor: 'ring-[#009A44]',
    corridor: 'East-West Corridor',
    terminals: 'Howrah Maidan ⇄ Salt Lake Sector V',
    status: 'Operational (Underwater section active)',
    tagline: "India's first underwater metro river tunnel connecting Howrah and Sealdah pandal hubs.",
  },
  'Purple Line': {
    name: 'Purple Line',
    code: 'Line 3',
    color: 'bg-[#7D3F98]',
    hex: '#7D3F98',
    bgLight: 'bg-purple-50',
    textColor: 'text-[#7D3F98]',
    borderColor: 'border-[#7D3F98]',
    ringColor: 'ring-[#7D3F98]',
    corridor: 'South-West Corridor',
    terminals: 'Joka ⇄ Majerhat',
    status: 'Operational (Majerhat section active)',
    tagline: 'Direct gateway for Behala & Diamond Harbour road mega pandal clusters.',
  },
  'Orange Line': {
    name: 'Orange Line',
    code: 'Line 6',
    color: 'bg-[#ED6B00]',
    hex: '#ED6B00',
    bgLight: 'bg-orange-50',
    textColor: 'text-[#ED6B00]',
    borderColor: 'border-[#ED6B00]',
    ringColor: 'ring-[#ED6B00]',
    corridor: 'Kavi Subhash - Airport Corridor',
    terminals: 'Kavi Subhash ⇄ Hemanta Mukhopadhyay (Ruby)',
    status: 'Operational Phase 1',
    tagline: 'Connects EM Bypass and Ruby hospital pandal circuits with Garia.',
  },
  'Yellow Line': {
    name: 'Yellow Line',
    code: 'Line 4',
    color: 'bg-[#EAB308]',
    hex: '#EAB308',
    bgLight: 'bg-yellow-50',
    textColor: 'text-[#B45309]',
    borderColor: 'border-[#EAB308]',
    ringColor: 'ring-[#EAB308]',
    corridor: 'Noapara - Airport Corridor',
    terminals: 'Noapara ⇄ Jai Hind (Airport)',
    status: 'Operational Phase 1 (Noapara to Airport)',
    tagline: 'High-speed link connecting North Kolkata & Dum Dum directly to NSCBI Airport and VIP Road puja circuits.',
  },
};

export function getMetroLineMeta(lineName: string): MetroLineMeta {
  // Normalize line name if multiple or whitespace
  const trimmed = lineName.trim();
  for (const [key, meta] of Object.entries(METRO_LINES_METADATA)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase())) {
      return meta;
    }
  }
  return {
    name: lineName,
    code: 'Metro',
    color: 'bg-charcoal',
    hex: '#18181B',
    bgLight: 'bg-stone-100',
    textColor: 'text-charcoal',
    borderColor: 'border-charcoal',
    ringColor: 'ring-charcoal',
    corridor: 'Kolkata Metro Network',
    terminals: 'Kolkata Metro Stations',
    status: 'Operational',
    tagline: 'Kolkata Metro rapid transit link.',
  };
}

export function parseStationLines(lineString: string): string[] {
  if (!lineString) return [];
  return lineString.split(',').map((l) => l.trim()).filter(Boolean);
}

