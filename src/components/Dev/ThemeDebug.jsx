// src/components/Dev/ThemeDebug.jsx
import { useTheme } from '../../context/ThemeContext';

const ThemeDebug = () => {
  const { theme, isDark } = useTheme();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="theme-debug fixed top-20 right-4 z-50 bg-surface border-theme rounded-lg p-4 shadow-lg text-xs">
      <div className="font-bold mb-2">Theme Debug</div>
      <div>Current: <strong>{theme}</strong></div>
      <div>isDark: <strong>{isDark.toString()}</strong></div>
      <div className="mt-2 text-xs opacity-75">
        Click theme toggle to switch
      </div>
    </div>
  );
};

export default ThemeDebug;