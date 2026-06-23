import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: { default: 'SNAP — Universal Clipboard Vault', template: '%s | SNAP' },
  description:
    'Clipboard history that follows you everywhere. Sync across all your devices, search instantly, and never lose a copy again.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set dark class before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
