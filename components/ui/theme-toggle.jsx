'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/use-theme';
import { cn } from '@/lib/utils';

const MODES = [
  { value: 'light',  icon: Sun,     label: 'Light'  },
  { value: 'dark',   icon: Moon,    label: 'Dark'   },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn('px-3 py-2', className)}>
      <p className="mb-1.5 text-xs text-muted-foreground">Appearance</p>
      <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {MODES.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md py-1.5 text-xs font-medium transition-colors',
              theme === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
