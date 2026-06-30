import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// Ordem e rótulos do e-mail, espelhando o formulário.
const FIELDS: [string, string][] = [
  ['nome', 'Nome'],
  ['instagram', 'Instagram'],
  ['whatsapp', 'WhatsApp'],
  ['area', 'Área'],
  ['tempo', 'Tempo de atuação'],
  ['dificuldade', 'Principal dificuldade'],
  ['renda', 'Renda mensal média'],
  ['naming', 'Nome / naming'],
  ['momento', 'Momento (investimento)'],
];

function esc(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Payload inválido.' }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.APLICACAO_TO || user;

  if (!user || !pass) {
    return NextResponse.json(
      { success: false, message: 'Envio de e-mail não configurado no servidor.' },
      { status: 500 },
    );
  }

  const get = (k: string) => (data[k] || '').toString().trim();
  const nome = get('nome') || 'sem nome';

  const htmlParts: string[] = [
    `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto">`,
    `<h2 style="margin:0 0 4px">Nova aplicação BAW</h2>`,
    `<p style="margin:0 0 24px;color:#666">De: <strong>${esc(nome)}</strong></p>`,
  ];
  const textParts: string[] = [`NOVA APLICAÇÃO BAW — ${nome}`, ''];

  for (const [key, label] of FIELDS) {
    const val = get(key);
    if (!val) continue;
    htmlParts.push(
      `<p style="margin:0 0 12px"><strong style="color:#555">${esc(label)}:</strong><br>${esc(val)}</p>`,
    );
    textParts.push(`${label}: ${val}`);
  }
  htmlParts.push('</div>');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Aplicação BAW" <${user}>`,
      to,
      subject: `Nova aplicação BAW: ${nome}`,
      text: textParts.join('\n'),
      html: htmlParts.join('\n'),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Falha ao enviar e-mail da aplicação BAW:', err);
    return NextResponse.json({ success: false, message: 'Falha ao enviar o e-mail.' }, { status: 502 });
  }
}
