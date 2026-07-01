'use client';

import { useState } from 'react';
import Link from 'next/link';

type Q =
  | { id: string; kind: 'text' | 'tel'; label: string; hint?: string; placeholder?: string }
  | { id: string; kind: 'choice'; label: string; hint?: string; options: string[] };

const QUESTIONS: Q[] = [
  { id: 'nome', kind: 'text', label: 'Qual é o seu nome completo?', placeholder: 'Seu nome' },
  { id: 'instagram', kind: 'text', label: 'Qual o @ do seu Instagram?', placeholder: '@seuperfil' },
  {
    id: 'whatsapp',
    kind: 'tel',
    label: 'Qual o seu WhatsApp?',
    hint: 'É por onde eu vou falar com você.',
    placeholder: '(00) 00000-0000',
  },
  {
    id: 'area',
    kind: 'choice',
    label: 'Qual é a sua área?',
    options: [
      'Personal trainer',
      'Fisioterapeuta',
      'Nutricionista',
      'Psicólogo(a)',
      'Terapeuta',
      'Outra área de saúde e bem-estar',
    ],
  },
  {
    id: 'tempo',
    kind: 'choice',
    label: 'Há quanto tempo você atua na sua área?',
    options: ['Menos de 2 anos.', '2 a 5 anos.', 'Mais de 5 anos.'],
  },
  {
    id: 'dificuldade',
    kind: 'choice',
    label: 'Qual a sua principal dificuldade hoje?',
    options: [
      'Atrair clientes que valorizam meu trabalho.',
      'Cobrar o preço que meu serviço merece.',
      'Me diferenciar de tantos outros profissionais.',
      'Depender menos de indicação.',
      'Ter uma marca que comunique o meu nível.',
    ],
  },
  {
    id: 'renda',
    kind: 'choice',
    label: 'Na média dos últimos 3 meses, qual a sua renda mensal?',
    hint: 'Somando tudo: CLT, PJ, atendimentos e projetos por fora.',
    options: ['Até R$4.999', 'R$5.000 a R$19.999', 'Mais de R$20.000'],
  },
  {
    id: 'naming',
    kind: 'choice',
    label: 'Você já tem um nome ou marca definida, ou também precisa de nomeação?',
    options: ['Já tenho nome.', 'Preciso de nome.'],
  },
  {
    id: 'momento',
    kind: 'choice',
    label:
      'Os projetos de branding BAW começam em R$3.000 e variam conforme o escopo. Qual opção representa o seu momento?',
    options: [
      'É um investimento que faz sentido pra mim. Quero a proposta.',
      'Consigo investir, mas quero conversar antes.',
      'Não é esse nível de projeto que eu busco agora.',
    ],
  },
];

const COUNTRIES = [
  { code: 'BR', flag: '🇧🇷', dial: '+55', name: 'Brasil' },
  { code: 'PT', flag: '🇵🇹', dial: '+351', name: 'Portugal' },
  { code: 'US', flag: '🇺🇸', dial: '+1', name: 'EUA' },
  { code: 'AR', flag: '🇦🇷', dial: '+54', name: 'Argentina' },
  { code: 'CL', flag: '🇨🇱', dial: '+56', name: 'Chile' },
  { code: 'CO', flag: '🇨🇴', dial: '+57', name: 'Colômbia' },
  { code: 'MX', flag: '🇲🇽', dial: '+52', name: 'México' },
  { code: 'ES', flag: '🇪🇸', dial: '+34', name: 'Espanha' },
];

// Máscara BR: (XX) XXXXX-XXXX
function formatBR(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function Formulario() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phoneDigits, setPhoneDigits] = useState('');

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const isLast = step === total - 1;
  const current = (q && answers[q.id]) || '';

  // Só avança se o campo atual for válido. Todos obrigatórios.
  function fieldValid(): boolean {
    if (!q) return false;
    if (q.kind === 'choice') return !!answers[q.id];
    if (q.id === 'whatsapp') {
      return country.code === 'BR' ? phoneDigits.length === 11 : phoneDigits.length >= 8;
    }
    if (q.id === 'instagram') return current.trim().replace(/^@/, '').length >= 2;
    return current.trim().length >= 2;
  }
  const canAdvance = fieldValid();

  function set(id: string, val: string) {
    setAnswers((a) => ({ ...a, [id]: val }));
  }

  function setPhone(input: string, c = country) {
    const d = input.replace(/\D/g, '').slice(0, c.code === 'BR' ? 11 : 15);
    setPhoneDigits(d);
    set('whatsapp', `${c.dial} ${c.code === 'BR' ? formatBR(d) : d}`.trim());
  }

  async function submit() {
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/aplicacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Falha no envio.');
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Algo deu errado. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  function next() {
    if (!canAdvance) return;
    if (isLast) submit();
    else setStep((s) => s + 1);
  }

  return (
    <main className="min-h-[100svh] flex flex-col">
      {/* progress */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--line-soft)] z-50">
        <div
          className="h-full bg-[var(--purple)] transition-[width] duration-500"
          style={{ width: started && !sent ? `${((step + 1) / total) * 100}%` : sent ? '100%' : '0%' }}
        />
      </div>

      <header className="flex items-center justify-between px-5 sm:px-8 py-4">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-baw.png" alt="BAW" className="h-6 w-auto" />
        </Link>
        {started && !sent && (
          <span className="text-[0.85rem] text-[var(--fg-faint)]">
            {step + 1} / {total}
          </span>
        )}
      </header>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-[640px]">
          {/* INTRO */}
          {!started && !sent && (
            <div>
              <h1 className="serif text-[2.4rem] sm:text-[3.4rem] leading-[1.1]">
                Aplicação pra ter a sua marca desenvolvida pelo método BAW.
              </h1>
              <p className="mt-6 text-[1.1rem] text-[var(--fg-dim)] max-w-[34rem]">
                Atendo poucos profissionais de saúde e bem-estar por mês. Leva 2 minutos pra eu
                entender se o seu projeto é um deles.
              </p>
              <button className="btn mt-9" onClick={() => setStarted(true)}>
                Iniciar aplicação <span aria-hidden>→</span>
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {sent && (
            <div>
              <h1 className="serif text-[2.4rem] sm:text-[3.4rem] leading-[1.1]">
                Aplicação enviada.
              </h1>
              <p className="mt-6 text-[1.1rem] text-[var(--fg-dim)] max-w-[34rem]">
                Recebi as suas respostas. Se o seu momento bater com o que eu faço, eu te chamo no
                WhatsApp pra conversar sobre o seu posicionamento. Obrigado pela confiança.
              </p>
              <Link href="/" className="btn btn-ghost mt-9">
                Voltar ao início
              </Link>
            </div>
          )}

          {/* QUESTION */}
          {started && !sent && q && (
            <div key={q.id}>
              <h2 className="serif text-[1.9rem] sm:text-[2.6rem] leading-[1.15]">{q.label}</h2>
              {q.hint && <p className="mt-3 text-[1rem] text-[var(--fg-dim)]">{q.hint}</p>}

              <div className="mt-8">
                {q.kind === 'choice' ? (
                  <div className="flex flex-col gap-3">
                    {q.options.map((opt, i) => {
                      const selected = current === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => set(q.id, opt)}
                          className="text-left px-5 py-4 rounded-xl border transition-colors duration-200 flex items-center gap-3"
                          style={{
                            borderColor: selected ? 'var(--purple)' : 'var(--line)',
                            background: selected ? 'rgba(90,62,255,0.12)' : 'transparent',
                          }}
                        >
                          <span
                            className="serif text-[0.95rem] w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{
                              background: selected ? 'var(--purple)' : 'var(--line-soft)',
                              color: selected ? '#fff' : 'var(--fg-faint)',
                            }}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-[1.05rem]">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : q.kind === 'tel' ? (
                  <div>
                    <div className="flex items-center gap-2 border-b border-[var(--line)] focus-within:border-[var(--purple)] transition-colors">
                      <select
                        aria-label="País"
                        value={country.code}
                        onChange={(e) => {
                          const c = COUNTRIES.find((x) => x.code === e.target.value) || COUNTRIES[0];
                          setCountry(c);
                          setPhone(phoneDigits, c);
                        }}
                        className="bg-transparent py-3 pr-1 text-[1.2rem] outline-none cursor-pointer text-[var(--fg)]"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[var(--bg)] text-[var(--fg)]">
                            {c.flag} {c.dial}
                          </option>
                        ))}
                      </select>
                      <input
                        autoFocus
                        type="tel"
                        inputMode="numeric"
                        value={country.code === 'BR' ? formatBR(phoneDigits) : phoneDigits}
                        placeholder={country.code === 'BR' ? '(11) 99999-9999' : 'DDD + número'}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') next();
                        }}
                        className="flex-1 bg-transparent outline-none text-[1.4rem] py-3 placeholder:text-[var(--fg-faint)]"
                      />
                    </div>
                    {phoneDigits.length > 0 && !canAdvance && (
                      <p className="mt-3 text-[0.9rem] text-[#ff8f8f]">
                        Digite o número completo com DDD.
                      </p>
                    )}
                  </div>
                ) : (
                  <input
                    autoFocus
                    type="text"
                    value={current}
                    placeholder={q.placeholder}
                    onChange={(e) => set(q.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') next();
                    }}
                    className="w-full bg-transparent border-b border-[var(--line)] focus:border-[var(--purple)] outline-none text-[1.4rem] py-3 transition-colors placeholder:text-[var(--fg-faint)]"
                  />
                )}
              </div>

              {error && <p className="mt-5 text-[0.95rem] text-[#ff6b6b]">{error}</p>}

              <div className="mt-9 flex items-center gap-4">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="text-[0.95rem] text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors"
                  >
                    ← Voltar
                  </button>
                )}
                <button className="btn disabled:opacity-40" disabled={!canAdvance || sending} onClick={next}>
                  {sending ? 'Enviando…' : isLast ? 'Enviar aplicação' : 'Avançar'}
                  {!sending && <span aria-hidden>→</span>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
