import { vars } from 'nativewind';

// Soft, inviting theme with calming blues and purples
export const lightTheme = vars({
  '--radius': '16',
  '--background': '250 251 255',        // Soft lavender-white
  '--foreground': '30 27 75',           // Deep indigo text
  '--card': '255 255 255',              // Pure white cards
  '--card-foreground': '30 27 75',      // Deep indigo on cards
  '--primary': '99 102 241',            // Bright indigo
  '--primary-foreground': '255 255 255', // White text on primary
  '--secondary': '233 213 255',         // Soft purple
  '--secondary-foreground': '76 29 149', // Deep purple text
  '--muted': '248 250 252',             // Very light blue-gray
  '--muted-foreground': '100 116 139',  // Slate gray
  '--accent': '147 197 253',            // Sky blue accent
  '--accent-foreground': '30 58 138',   // Deep blue text
  '--destructive': '239 68 68',         // Bright red
  '--border': '226 232 240',            // Light slate border
  '--input': '248 250 252',             // Light input bg
  '--ring': '99 102 241',               // Indigo focus ring
});

export const darkTheme = vars({
  '--radius': '16',
  '--background': '15 23 42',           // Deep slate blue
  '--foreground': '248 250 252',        // Almost white
  '--card': '30 41 59',                 // Slate card
  '--card-foreground': '248 250 252',   // Almost white on cards
  '--primary': '129 140 248',           // Lighter indigo
  '--primary-foreground': '255 255 255', // White text
  '--secondary': '55 48 163',           // Deep purple
  '--secondary-foreground': '233 213 255', // Light purple text
  '--muted': '51 65 85',                // Muted slate
  '--muted-foreground': '148 163 184',  // Light slate gray
  '--accent': '56 189 248',             // Bright cyan
  '--accent-foreground': '240 249 255', // Very light blue
  '--destructive': '248 113 113',       // Softer red
  '--border': '51 65 85',               // Slate border
  '--input': '51 65 85',                // Slate input
  '--ring': '129 140 248',              // Light indigo ring
});