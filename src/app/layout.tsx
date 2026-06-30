import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://baw.leonardoferreirr.com.br'),
  title: 'BAW — Branding Aplicado ao Wellness',
  description:
    'Posiciono profissionais de saúde e bem-estar para serem lembrados pelo público certo e cobrarem pelo que valem. Primeiro o lugar na mente, depois a identidade visual.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'BAW — Branding Aplicado ao Wellness',
    description:
      'Posiciono profissionais de saúde e bem-estar para serem lembrados pelo público certo e cobrarem pelo que valem.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
