// Shared types and interfaces
export interface Destination {
  id: number;
  title: string;
  location: string;
  image: string;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}

export interface SearchFilters {
  destination: string;
  date: string;
  persons: string;
}
