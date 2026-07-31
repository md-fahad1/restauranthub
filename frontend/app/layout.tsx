import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import { ApolloClientProvider } from '@/lib/apollo/provider';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-family',
  weight: ['500', '600'],
});
const inter = Inter({ subsets: ['latin'], variable: '--font-sans-family' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono-family', weight: ['400', '500'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans">
        <ApolloClientProvider>{children}</ApolloClientProvider>
      </body>
    </html>
  );
}
