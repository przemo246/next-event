const eventCountFormatter = new Intl.NumberFormat("pl-PL");

export const formatEventCount = (count: number): string =>
  `${eventCountFormatter.format(count)} wydarzeń`;
