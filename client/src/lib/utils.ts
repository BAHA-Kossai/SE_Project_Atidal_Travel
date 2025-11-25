/**
 * Common utility functions for the application
 */

/**
 * Combines class names with tailwind merge support
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Formats a date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Validates search filters
 */
export const isValidSearchFilters = (
  destination: string,
  date: string,
  persons: string
): boolean => {
  return !!(destination && date && persons);
};

/**
 * Generates a breadcrumb trail
 */
export const getBreadcrumbs = (
  pathname: string
): Array<{ label: string; href: string }> => {
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
  ];

  if (pathname === '/destinations') {
    breadcrumbs.push({ label: 'Destinations', href: '/destinations' });
  }

  return breadcrumbs;
};
