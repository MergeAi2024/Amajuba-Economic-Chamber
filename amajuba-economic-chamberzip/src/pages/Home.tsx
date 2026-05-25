import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pickaxe, Factory, ShoppingCart, ArrowRight, Users, TrendingUp, Building } from 'lucide-react';

export default function Home() {
  const sectors = [
    {
      title: 'Primary Sector',
      icon: <Pickaxe size={32} className="text-chamber-blue" />,
      description: 'Focused on extraction and raw materials including Agriculture and Mining to provide foundational resources.',
      color: 'bg-blue-50',
    },
    {
      title: 'Secondary Sector',
      icon: <Factory size={32} className="text-chamber-blue" />,
      description: 'Focused on manufacturing and processing, including Steel, Textiles, Chemicals, and Industrial processing.',
      color: 'bg-slate-50',
    },
    {
      title: 'Tertiary Sector',
      icon: <ShoppingCart size={32} className="text-chamber-blue" />,
      description: 'Focused on services, distribution, retail, professional services, and logistics ensuring robust service delivery.',
      color: 'bg-blue-50',
    },
  ];

  const stats = [
    { icon: <Users size={22} />, value: '500+', label: 'Members' },
    { icon: <Building size={22} />, value: '6', label: 'Districts Covered' },
    { icon: <TrendingUp size={22} />, value: '3', label: 'Economic Sectors' },
  ];

  return (
    <div className="flex flex-col">

      {/* ── Hero Section ── */}
      <section className="relative min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2940&auto=format&fit=crop')`,
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-chamber-navy/90 via-chamber-navy/80 to-blue-900/70" />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-chamber-gold via-amber-400 to-chamber-gold" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center pt-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6 drop-shadow-lg">
              Promoting{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-chamber-gold">
                Growth
              </span>
              {' '}&amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-chamber-gold to-amber-400">
                Prosperity
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              We serve as a catalyst for sustainable economic development across the Amajuba District — transforming dialogue into action and shared understanding into measurable progress.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-chamber-gold text-chamber-navy font-bold rounded-full hover:bg-amber-400 transition-all shadow-2xl shadow-amber-900/30 text-lg flex items-center justify-center gap-2 group"
              >
                Become a Member
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all text-lg border border-white/30"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative z-10 w-full max-w-3xl mx-auto px-4 mt-14"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl grid grid-cols-3 divide-x divide-white/20">
            {stats.map(stat => (
              <div key={stat.label} className="flex flex-col items-center py-5 px-4 gap-1">
                <div className="text-amber-300">{stat.icon}</div>
                <span className="text-2xl font-extrabold text-white leading-none">{stat.value}</span>
                <span className="text-xs text-blue-200 font-medium uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Core Sectors ── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-chamber-navy mb-4">Our Economic Development Framework</h2>
            <div className="w-24 h-1 bg-chamber-gold mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our strategy is organized across three interconnected economic sectors, aligned with standard economic classification to drive transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`${sector.color} rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}
              >
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {sector.icon}
                </div>
                <h3 className="text-xl font-bold text-chamber-navy mb-3">{sector.title}</h3>
                <p className="text-slate-600 leading-relaxed">{sector.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Prop Banner ── */}
      <section className="py-20 bg-chamber-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-balance">
          <h2 className="text-2xl md:text-4xl font-serif font-medium leading-relaxed italic">
            "Developing integrated competence — woven from knowledge, skills, and attitudes — to drive economic transformation and sustainable livelihoods across all sectors within 3–5 years."
          </h2>
          <div className="mt-8 flex justify-center">
            <Link
              to="/about"
              className="text-white border-b border-chamber-gold bg-transparent pb-1 hover:text-chamber-lightgold transition-colors font-medium"
            >
              Read our full strategic framework
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
