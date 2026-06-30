'use client';

import { useEffect } from 'react';
import Link from 'next/link';

const projects = [
  { src: '/cases/neuromov-1.jpg', tag: 'Neuromov · Pilates' },
  { src: '/cases/gabriel-1.jpg', tag: 'Gabriel Carneiro · Personal' },
  { src: '/cases/joaopaulo-1.jpg', tag: 'João Paulo · Fisio' },
  { src: '/cases/neuromov-2.jpg', tag: 'Neuromov · Pilates' },
  { src: '/cases/gabriel-2.jpg', tag: 'Gabriel Carneiro · Personal' },
  { src: '/cases/joaopaulo-2.jpg', tag: 'João Paulo · Fisio' },
  { src: '/cases/neuromov-3.jpg', tag: 'Neuromov · Pilates' },
  { src: '/cases/gabriel-3.jpg', tag: 'Gabriel Carneiro · Personal' },
];

const colA = projects.filter((_, i) => i % 2 === 0);
const colB = projects.filter((_, i) => i % 2 === 1);

const dores = [
  'Você atende bem, mas atrai quem pechincha em vez de quem valoriza.',
  'Tem medo de subir o preço porque a marca não sustenta o que você cobra.',
  'Parece amador do lado de quem entrega menos e se posiciona melhor.',
  'Depende de indicação. Sem ela, não entra cliente novo.',
  'Posta no Instagram sem direção. Aparece, mas não cresce.',
];

const fases = [
  {
    n: '01',
    nome: 'Raio-X',
    desc: 'Diagnóstico. Entendo o que você entrega de verdade, quem é o seu paciente e por que ele escolhe você. Branding é tradução, não invenção.',
  },
  {
    n: '02',
    nome: 'Território',
    desc: 'O coração do método. Defino o lugar que você ocupa na mente do público: o seu diferencial real, a sua promessa, de quem você quer ser a opção óbvia.',
  },
  {
    n: '03',
    nome: 'Voz',
    desc: 'Dou voz ao posicionamento. Como a sua marca fala, a sua narrativa de origem, as mensagens que geram conexão e confiança.',
  },
  {
    n: '04',
    nome: 'Pele',
    desc: 'A identidade visual. Logo, sistema e aplicações de nível profissional, que existem porque as três fases anteriores decidiram o que essa marca precisa comunicar.',
  },
];

function ProjectCard({
  p,
  w,
  h,
  eager,
}: {
  p: { src: string; tag: string };
  w: number;
  h: number;
  eager?: boolean;
}) {
  return (
    <div className="project-card" style={{ width: w, height: h }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.src} alt={p.tag} loading={eager ? 'eager' : 'lazy'} />
      <span className="tag">{p.tag}</span>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    // smooth scroll
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    (async () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({ duration: 1.1 });
        (window as unknown as { __lenis?: unknown }).__lenis = lenis;
        const loop = (t: number) => {
          lenis?.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      }
    })();

    // reveal on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <main>
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 backdrop-blur-md bg-[rgba(10,10,10,0.6)] border-b border-[var(--line-soft)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-baw.png" alt="BAW" className="h-6 sm:h-7 w-auto" />
        <Link href="/formulario" className="btn !py-2.5 !px-5 !text-[0.9rem]">
          Quero me posicionar
        </Link>
      </header>

      {/* ===== HERO ===== */}
      <section className="lg:min-h-[100svh] flex flex-col justify-center px-5 sm:px-8 pt-28 pb-12 lg:pb-16 max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center w-full">
          {/* texto */}
          <div>
            <h1 className="serif text-[2.7rem] leading-[1.05] sm:text-[3.6rem] lg:text-[4.2rem]">
              Você é ótimo no que faz.
              <br />
              Sua marca não conta isso.
            </h1>
            <p className="mt-7 text-[1.08rem] sm:text-[1.18rem] text-[var(--fg-dim)] max-w-[34rem] leading-[1.6]">
              BAW é branding feito só para quem é de saúde e bem-estar. Eu defino o seu
              posicionamento antes de desenhar qualquer coisa, pra você ser lembrado pelo público
              certo e poder cobrar pelo que vale.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/formulario" className="btn">
                Quero me posicionar
                <span aria-hidden>→</span>
              </Link>
              <span className="text-[0.92rem] text-[var(--fg-faint)] max-w-[16rem]">
                Atendo poucos profissionais por mês. Leva 2 minutos pra ver se faz sentido.
              </span>
            </div>
          </div>

          {/* marquee desktop (vertical) */}
          <div className="hidden lg:flex gap-5 h-[78vh] max-h-[680px] overflow-hidden fade-mask-y justify-center">
            <div className="marquee-col">
              {[...colA, ...colA].map((p, i) => (
                <ProjectCard key={`a${i}`} p={p} w={252} h={310} eager={i < 2} />
              ))}
            </div>
            <div className="marquee-col slow" style={{ marginTop: '-60px' }}>
              {[...colB, ...colB].map((p, i) => (
                <ProjectCard key={`b${i}`} p={p} w={252} h={310} eager={i < 2} />
              ))}
            </div>
          </div>
        </div>
        {/* marquee mobile (horizontal), dentro do hero */}
        <div className="lg:hidden overflow-hidden fade-mask-x mt-12">
          <div className="marquee-track">
            {[...projects, ...projects].map((p, i) => (
              <ProjectCard key={`m${i}`} p={p} w={210} h={262} eager={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATEMENT (a tese) ===== */}
      <section className="px-5 sm:px-8 py-24 sm:py-36 border-t border-[var(--line-soft)]">
        <div className="max-w-[1000px] mx-auto reveal">
          <p className="serif text-[2rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.18]">
            O desafio não é criar uma marca bonita. É definir o posicionamento certo pra você ser
            lembrado pelo público certo. <span className="text-[var(--fg-faint)]">E só depois pensar na identidade visual.</span>
          </p>
        </div>
      </section>

      {/* ===== DORES ===== */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 bg-[var(--bg-soft)] border-y border-[var(--line-soft)]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="serif text-[2rem] sm:text-[2.8rem] leading-[1.1] mb-12 reveal">
            Soa familiar?
          </h2>
          <div className="grid sm:grid-cols-2 gap-px bg-[var(--line-soft)] rounded-2xl overflow-hidden border border-[var(--line-soft)]">
            {dores.map((d, i) => (
              <div
                key={i}
                className="bg-[var(--bg)] p-7 sm:p-8 reveal flex gap-4"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="serif text-[var(--purple)] text-[1.6rem] leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[1.05rem] text-[var(--fg-dim)] leading-[1.5]">{d}</p>
              </div>
            ))}
            <div className="bg-[var(--purple)] p-7 sm:p-8 reveal flex items-center">
              <p className="text-[1.15rem] text-white font-medium leading-[1.4]">
                No wellness, ganha quem comunica confiança, não quem só entende do método.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MÉTODO ===== */}
      <section className="px-5 sm:px-8 py-24 sm:py-32 max-w-[1100px] mx-auto">
        <div className="mb-14 reveal">
          <h2 className="serif text-[2.2rem] sm:text-[3rem] leading-[1.1]">O Método BAW</h2>
          <p className="mt-4 text-[1.05rem] text-[var(--fg-dim)] max-w-[40rem]">
            Quatro fases, do diagnóstico à pele. A ordem é inegociável: primeiro o lugar na mente,
            depois a identidade visual.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {fases.map((f, i) => (
            <div
              key={f.n}
              className="border border-[var(--line)] rounded-2xl p-8 reveal hover:border-[var(--purple)] transition-colors duration-300"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="serif text-[var(--purple)] text-[1.5rem]">{f.n}</span>
                <h3 className="serif text-[1.8rem]">{f.nome}</h3>
              </div>
              <p className="text-[1.02rem] text-[var(--fg-dim)] leading-[1.55]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CASES (prova) ===== */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 bg-[var(--bg-soft)] border-y border-[var(--line-soft)]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="serif text-[2rem] sm:text-[2.8rem] leading-[1.1] mb-3 reveal">
            Marcas que já saíram da multidão
          </h2>
          <p className="text-[1.02rem] text-[var(--fg-dim)] mb-12 reveal">
            Profissionais de saúde reais, com marca de verdade. Nada de logo de Canva.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { src: '/cases/neuromov-3.jpg', nome: 'Neuromov', tipo: 'Fisioterapia e Pilates' },
              { src: '/cases/gabriel-1.jpg', nome: 'Gabriel Carneiro', tipo: 'Personal Trainer' },
              { src: '/cases/joaopaulo-2.jpg', nome: 'João Paulo Alves', tipo: 'Fisioterapeuta' },
            ].map((c, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="project-card" style={{ aspectRatio: '4/5', width: '100%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={`${c.nome} — ${c.tipo}`} loading="lazy" />
                </div>
                <h3 className="mt-4 text-[1.15rem] font-medium">{c.nome}</h3>
                <p className="text-[0.95rem] text-[var(--fg-faint)]">{c.tipo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOBRE ===== */}
      <section className="px-5 sm:px-8 py-24 sm:py-32 max-w-[900px] mx-auto reveal">
        <h2 className="serif text-[2rem] sm:text-[2.8rem] leading-[1.15] mb-7">
          Por que comigo
        </h2>
        <div className="space-y-5 text-[1.08rem] text-[var(--fg-dim)] leading-[1.65]">
          <p>
            Sou o Leonardo. Não sou um designer que também pega academia. Eu trabalho só com
            branding para saúde e bem-estar, porque um nutricionista não quer um designer qualquer,
            quer alguém que entenda por que o paciente escolhe um profissional e não outro.
          </p>
          <p>
            Penso a marca, o funil, o conteúdo e a venda juntos, com método de verdade por trás, não
            achismo. No wellness, confiança é a moeda. O paciente entrega o corpo, a dor, a cabeça.
            Ele compra confiança antes de comprar técnica, e a sua marca é onde essa confiança
            começa.
          </p>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="px-5 sm:px-8 py-24 sm:py-36 border-t border-[var(--line-soft)] text-center">
        <div className="max-w-[760px] mx-auto reveal">
          <h2 className="serif text-[2.6rem] sm:text-[4rem] leading-[1.08]">
            Primeiro o lugar na mente.
            <br />
            Só depois a identidade visual.
          </h2>
          <p className="mt-6 text-[1.1rem] text-[var(--fg-dim)] max-w-[34rem] mx-auto">
            Preencha a aplicação. Em 2 minutos eu entendo o seu momento e vejo se o seu projeto é um
            dos poucos que eu pego por mês.
          </p>
          <div className="mt-10">
            <Link href="/formulario" className="btn !text-[1.05rem] !py-4 !px-9">
              Iniciar aplicação
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-5 sm:px-8 py-10 border-t border-[var(--line-soft)] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1280px] mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-baw.png" alt="BAW" className="h-5 w-auto opacity-80" />
        <p className="text-[0.85rem] text-[var(--fg-faint)]">
          Branding Aplicado ao Wellness · Leonardo Ferreira
        </p>
      </footer>
    </main>
  );
}
