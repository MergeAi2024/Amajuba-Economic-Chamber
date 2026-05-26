import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const post = {
  title: 'Building Prosperity from the Ground Up: The Story and Vision of the Amajuba Economic Chamber of Commerce',
  date: 'May 2026',
  author: 'Themba Khanyile, Chairperson',
  readTime: '8 min read',
  category: 'Chamber Insight',
  coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop',
  intro: 'In a region where economic promise has long outpaced economic reality, a new institution has risen to bridge the gap — the Amajuba Economic Chamber of Commerce. This is its story.',
  sections: [
    {
      heading: 'A Region of Untapped Potential',
      body: `The Amajuba District of KwaZulu-Natal sits at the heart of one of South Africa's most historically significant industrial corridors. Home to Newcastle — once a steel and manufacturing powerhouse — and surrounded by agricultural hinterland stretching across Dannhauser, Utrecht, Charlestown, Osizweni, and Madadeni, the district has all the ingredients for sustained economic prosperity.

Yet for too long, communities here have remained on the margins of the formal economy. Limited access to information about government procurement, poor connections to business support networks, and a fragmented approach to local economic development have left enormous potential unrealised. The Amajuba Economic Chamber of Commerce was founded with a clear-eyed understanding of this gap — and an equally clear mandate to close it.`,
    },
    {
      heading: 'Our Founding Purpose',
      body: `Registered in 2026 (Reg No: 2026 / 354235 / 08), the Chamber was established as a structured, governance-driven platform to facilitate growth, innovation, and community empowerment across all sectors of the Amajuba economy.

The founding vision is unambiguous: to be the leading catalyst for sustainable economic development and inclusive prosperity in the district. The mission is to operationalise that vision through concrete, measurable intervention — not empty rhetoric, but structured programmes, real partnerships, and accountable leadership.

At its core, the Chamber's value proposition is this: "Developing integrated competence — woven from knowledge, skills, and attitudes — to drive economic transformation and sustainable livelihoods across all sectors within 3–5 years."`,
    },
    {
      heading: 'Three Sectors, One Strategy',
      body: `The Chamber's economic development framework is organised across three interconnected sectors that mirror the standard economic classification model:

**Primary Sector (Extraction):** Agriculture and mining form the foundation of the Amajuba economy. The Chamber advocates for small-scale farmers, supports agri-business development, and works to connect primary producers with secondary processors and market access networks.

**Secondary Sector (Manufacturing & Processing):** Newcastle's industrial heritage in steel, textiles, and chemicals positions the region uniquely for manufacturing revival. The Chamber facilitates connections between manufacturers, logistics providers, and export market opportunities — while pushing for policies that make the district more competitive for industrial investment.

**Tertiary Sector (Services & Distribution):** The fastest-growing segment of the economy, services — from professional services to retail, logistics, and digital — represents the day-to-day economic engine of communities. The Chamber supports service-sector SMMEs through business incubation, mentorship, and market access.

Each sector is supported by a dedicated departmental head within the Chamber's governance structure, ensuring that strategic direction translates into focused, ground-level action.`,
    },
    {
      heading: 'Community Empowerment at the Core',
      body: `What distinguishes the Amajuba Economic Chamber from a traditional business lobby is its deep commitment to community-level economic empowerment. The Chamber operates a flagship Community Capacity-Building Programme, implemented in partnership with the Newcastle Local Municipality and Amajuba District Municipality's Local Economic Development (LED) units.

This programme addresses a critical gap: many community members, cooperatives, SMMEs, and grassroots organisations possess the drive to grow — but lack the knowledge to navigate government systems, procurement processes, and development funding mechanisms.

The programme delivers structured, accredited training in five key areas:
- **Tendering & Procurement:** Understanding how government buys goods and services, and how businesses can ethically and competitively participate.
- **Governance Literacy:** Building awareness of municipal structures, ward committees, councillor accountability, and civic rights.
- **Fund Management:** Teaching responsible use of development funding, project budgeting, and sustainability planning.
- **Community Leadership:** Developing participatory governance skills, conflict resolution capabilities, and community organising capacity.
- **Economic Participation:** LED structures, cooperative models, youth enterprise, and informal trader development.

Critically, training is delivered by accredited local facilitators drawn from within the communities themselves — creating paid employment opportunities and building a sustainable community-owned training ecosystem.`,
    },
    {
      heading: 'Governance Built for Accountability',
      body: `The Chamber's internal governance architecture reflects the seriousness with which it approaches its public mandate. A cascading leadership model ensures clear accountability at every level:

At the apex sits the President/Chairperson, responsible for strategic vision, external stakeholder representation, and final policy authority. The Vice-Chairperson (Strategy & Innovation) drives strategic planning, business intelligence, and performance monitoring. Corporate Services — comprising the Secretary, Treasurer, and Community Head — manage operations, finances, and stakeholder relations respectively.

Departmental Heads cover Business Incubation & Support, Government Relations & Policy, and Tourism, Transport & Logistics — ensuring that no major economic domain falls outside the Chamber's active attention.

This structure is not ceremonial. Each level carries defined responsibilities and is held to measurable outcomes. Transparency and accountability are non-negotiable principles.`,
    },
    {
      heading: 'The Road Ahead',
      body: `The Chamber's strategic framework sets a 3–5 year horizon for transformative impact. In the near term, priorities include expanding the community capacity-building programme across all six district areas, establishing a formal business incubation hub, deepening LED partnerships with both Newcastle Local Municipality and Amajuba District Municipality, and creating structured pathways for youth and informal sector participation in the formal economy.

In the medium term, the focus shifts to sector-specific investment facilitation — bringing new manufacturing investment into the Secondary Sector, connecting Primary Sector producers to value chains, and positioning the district as a hub for services and logistics in the broader KwaZulu-Natal economy.

The long-term vision is a district where inclusive prosperity is not an aspiration but a reality — where communities are informed, businesses are connected, and economic growth is shared.

The Amajuba Economic Chamber of Commerce exists to make that future inevitable.`,
    },
  ],
};

function formatInlineText(text: string) {
  const fragments: Array<string | ReactNode> = [];
  const regex = /(\*\*[^*]+\*\*|==[^=]+==)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      fragments.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      fragments.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('==') && token.endsWith('==')) {
      fragments.push(
        <mark key={match.index} className="rounded-sm bg-chamber-gold/20 px-0.5 text-chamber-navy">
          {token.slice(2, -2)}
        </mark>,
      );
    } else {
      fragments.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    fragments.push(text.slice(lastIndex));
  }

  return fragments;
}

function renderSectionBody(body: string) {
  return body.split('\n\n').map((paragraph, index) => {
    const lines = paragraph.split('\n').filter(Boolean);

    if (lines.every(line => line.trim().startsWith('- '))) {
      return (
        <div key={index} className="space-y-2">
          {lines.map((line, lineIndex) => {
            const raw = line.trim().replace(/^-\s*/, '');
            const [label, rest] = raw.split(/:\s*/, 2);
            return (
              <div key={lineIndex} className="flex gap-3 items-start pl-2">
                <div className="w-2 h-2 rounded-full bg-chamber-blue mt-2 shrink-0" />
                <p>
                  <strong className="text-chamber-navy">{label}:</strong>{' '}
                  {rest ? formatInlineText(rest) : null}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <p key={index}>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex}>
            {formatInlineText(line)}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
}

export default function Blog() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Page header */}
      <div className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-chamber-blue font-bold tracking-wider uppercase text-sm mb-3">
            <BookOpen size={16} />
            <span>Chamber Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-chamber-navy mb-4">Our Blog</h1>
          <div className="w-20 h-1 bg-chamber-gold mx-auto rounded-full" />
          <p className="mt-5 text-slate-500 max-w-xl mx-auto">
            In-depth articles on economic development, community empowerment, and the work of the Amajuba Economic Chamber of Commerce.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Cover image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden shadow-xl mb-10 relative"
        >
          <img
            src={post.coverImage}
            alt="Amajuba Economic Chamber"
            className="w-full h-72 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chamber-navy/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-chamber-gold text-chamber-navy rounded-full text-xs font-bold uppercase tracking-wide mb-3">
              <Tag size={11} /> {post.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug max-w-2xl">
              {post.title}
            </h2>
          </div>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200"
        >
          <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-chamber-navy font-medium leading-relaxed mb-12 border-l-4 border-chamber-gold pl-6"
        >
          {post.intro}
        </motion.p>

        {/* Sections */}
        <div className="space-y-12">
          {post.sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-chamber-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-chamber-gold/20 text-chamber-gold text-sm font-extrabold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {section.heading}
              </h3>
              <div className="text-slate-700 leading-relaxed space-y-4">
                {renderSectionBody(section.body)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-chamber-navy rounded-3xl p-10 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-3">Ready to be part of the change?</h3>
          <p className="text-blue-200 mb-6 max-w-md mx-auto">
            Join the Amajuba Economic Chamber of Commerce and help shape the economic future of the district.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3 bg-chamber-gold text-chamber-navy font-bold rounded-full hover:bg-amber-400 transition-colors"
            >
              Become a Member <ArrowRight size={16} />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Ask the Chamber AI
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
