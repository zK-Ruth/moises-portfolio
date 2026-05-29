export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: 'fullstack' | 'devsecops' | 'opensource';
  accentColor: string;
  url?: string;
  /** Optional screenshot/cover. Falls back to the generated cover if missing or it fails to load. */
  image?: string;
  /** Material Symbols icon shown on the generated cover medallion. */
  icon?: string;
  /** Force the "View Project" button into a disabled state (also auto-disabled when there is no url). */
  disabled?: boolean;
  /** i18n key for the button label when disabled. Defaults to projects.unavailable. */
  disabledLabel?: string;
}
