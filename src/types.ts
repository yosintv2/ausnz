export interface AUPostcode {
  postcode: string;
  locality: string;
  state: string;
  lat: number;
  lng: number;
  type: string;
  status: string;
  region: string;
  lgaregion: string;
  electorate: string;
  altitude: string;
  phn_name: string;
  sa3name: string;
  sa4name: string;
}

export interface NZPostcode {
  id: number;
  postcode: string;
  locality: string;
  region: string;
  lat: number;
  lng: number;
  type: string;
  status: string;
}

export type Country = "au" | "nz";

export interface PostcodeGroup {
  postcode: string;
  localities: string[];
  state: string;
  country: Country;
  lat: number;
  lng: number;
}

export interface LocalityGroup {
  locality: string;
  slug: string;
  postcodes: string[];
  state: string;
  country: Country;
  lat: number;
  lng: number;
}

export interface StateGroup {
  state: string;
  slug: string;
  country: Country;
  postcodes: string[];
  localityCount: number;
}

export const AU_STATES: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

export const NZ_REGIONS: string[] = [
  "Auckland",
  "Bay of Plenty",
  "Canterbury",
  "Gisborne",
  "Hawke's Bay",
  "Manawatu-Whanganui",
  "Marlborough",
  "Nelson",
  "Northland",
  "Otago",
  "Southland",
  "Taranaki",
  "Tasman",
  "Waikato",
  "Wellington",
  "West Coast",
];
