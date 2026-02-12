import raw from "./sections.json";

export type Section = {
  key: string;
  label: string;
  typeDefault: string;
};

export const SECTIONS = raw as Section[];
