import MapEmbed from "./MapEmbed";

interface Props {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
}

export default function MapWrapper(props: Props) {
  return <MapEmbed {...props} />;
}
