import React from 'react';
import { Palette, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme, ThemePalette } from '@/contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  const handleThemeSelect = (theme: ThemePalette) => {
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Select theme palette</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Design System</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(themes).map(([key, theme]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleThemeSelect(key as ThemePalette)}
            className="flex items-start gap-3 p-3 cursor-pointer"
          >
            <div className="flex items-center justify-center w-4 h-4 mt-0.5">
              {currentTheme === key && <Check className="h-3 w-3" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-medium">{theme.name}</div>
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};