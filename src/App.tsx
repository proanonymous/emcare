import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import {
  Search,
  ShoppingBag,
  UserRound,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  X,
  Menu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
} from 'lucide-react';

const products = [
  {
    id: 'p1',
    name: 'Daily Care Hand Wash',
    category: 'Personal Care',
    price: 2450,
    old: 2900,
    desc: 'A gentle everyday hand wash.',
    emoji: '🧴',
    tone: 'mint',
  },
  {
    id: 'p2',
    name: 'Fresh Breath Toothpaste',
    category: 'Personal Care',
    price: 1800,
    desc: 'An everyday oral care essential.',
    emoji: '🪥',
    tone: 'sky',
  },
  {
    id: 'p3',
    name: 'Hydrating Face Cream',
    category: 'Beauty & Skincare',
    price: 5200,
    old: 6000,
    desc: 'A moisturising skincare essential.',
    emoji: '✨',
    tone: 'rose',
  },
  {
    id: 'p4',
    name: 'Baby Gentle Wipes',
    category: 'Baby Care',
    price: 2100,
    desc: 'Soft wipes for everyday baby care.',
    emoji: '🧻',
    tone: 'peach',
  },
  {
    id: 'p5',
    name: 'Home Cleaning Essentials',
    category: 'Household Essentials',
    price: 3500,
    desc: 'Useful essentials for a fresh home.',
    emoji: '🧽',
    tone: 'lavender',
  },
  {
    id: 'p6',
    name: 'Soft Cotton Wool',
    category: 'Personal Care',
    price: 1250,
    desc: 'A practical personal-care item.',
    emoji: '☁️',
    tone: 'cream',
  },
  {
    id: 'p7',
    name: 'Reusable Water Bottle',
    category: 'General Merchandise',
    price: 4800,
    desc: 'A reusable bottle for daily hydration.',
    emoji: '🥤',
    tone: 'mint',
  },
  {
    id: 'p8',
    name: 'Body Lotion',
    category: 'Beauty & Skincare',
    price: 3900,
    desc: 'A daily moisturising body lotion.',
    emoji: '🧴',
    tone: 'rose',
  },
  {
    id: 'p9',
    name: 'Baby Care Starter Pack',
    category: 'Baby Care',
    price: 6900,
    desc: 'Everyday baby-care essentials.',
    emoji: '🧸',
    tone: 'peach',
  },
  {
    id: 'p10',
    name: 'Laundry Detergent',
    category: 'Household Essentials',
    price: 2800,
    desc: 'Laundry care for the home.',
    emoji: '🫧',
    tone: 'sky',
  },
  {
    id: 'p11',
    name: 'Lunch Storage Set',
    category: 'General Merchandise',
    price: 4200,
    desc: 'Reusable containers for meals.',
    emoji: '🍱',
    tone: 'lavender',
  },
  {
    id: 'p12',
    name: 'Pocket Hand Sanitiser',
    category: 'Personal Care',
    price: 950,
    desc: 'A compact hand hygiene essential.',
    emoji: '🫧',
    tone: 'cream',
  },
  {
    id: 'p13',
    name: 'Gentle Shampoo',
    category: 'Personal Care',
    price: 3200,
    desc: 'An everyday hair-care essential.',
    emoji: '🧴',
    tone: 'sky',
  },
  {
    id: 'p14',
    name: 'Soft Facial Tissues',
    category: 'Household Essentials',
    price: 1400,
    desc: 'Soft tissues for home and travel.',
    emoji: '🧻',
    tone: 'cream',
  },
  {
    id: 'p15',
    name: 'Baby Feeding Bottle',
    category: 'Baby Care',
    price: 4500,
    desc: 'A sample baby-feeding accessory.',
    emoji: '🍼',
    tone: 'peach',
  },
  {
    id: 'p16',
    name: 'Daily Sunscreen',
    category: 'Beauty & Skincare',
    price: 6500,
    desc: 'A sample sun-care product listing.',
    emoji: '☀️',
    tone: 'rose',
  },
  {
    id: 'p17',
    name: 'Kitchen Sponge Pack',
    category: 'Household Essentials',
    price: 1200,
    desc: 'Handy cleaning sponges for the kitchen.',
    emoji: '🧽',
    tone: 'mint',
  },
  {
    id: 'p18',
    name: 'Travel Toiletry Pouch',
    category: 'General Merchandise',
    price: 3800,
    desc: 'Keep everyday travel essentials together.',
    emoji: '🧳',
    tone: 'lavender',
  },
  {
    id: 'p19',
    name: 'Baby Soft Blanket',
    category: 'Baby Care',
    price: 7800,
    desc: 'A sample soft blanket for baby-care shopping.',
    emoji: '🧸',
    tone: 'peach',
  },
  {
    id: 'p20',
    name: 'Reusable Shopping Bag',
    category: 'General Merchandise',
    price: 1600,
    desc: 'A reusable bag for everyday shopping.',
    emoji: '🛍️',
    tone: 'mint',
  },
];
const categories = [
  'All products',
  'Personal Care',
  'Beauty & Skincare',
  'Baby Care',
  'Household Essentials',
  'General Merchandise',
];
const money = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);

export default function App() {
  const [category, setCategory] = useState('All products');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('emcare-cart') || '{}');
    } catch {
      return {};
    }
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [panel, setPanel] = useState<'cart' | 'checkout' | 'account' | null>(
    null
  );
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('emcare-theme') === 'dark');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ id: string; name?: string; email?: string } | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Abeokuta',
  });
  const [order, setOrder] = useState<{
    orderId: string;
    total: number;
    paymentStatus: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [sort, setSort] = useState('featured');
  const [newsletter, setNewsletter] = useState(false);
  const [page, setPage] = useState(() => window.location.hash === '#products' ? 'products' : 'home');
  useEffect(() => {
    const syncPage = () => setPage(window.location.hash === '#products' ? 'products' : 'home');
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);
  useEffect(() => {
    localStorage.setItem('emcare-cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const account = data.session?.user;
      if (account) setUser({ id: account.id, email: account.email, name: account.user_metadata?.full_name });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const account = session?.user;
      setUser(account ? { id: account.id, email: account.email, name: account.user_metadata?.full_name } : null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    localStorage.setItem('emcare-theme', dark ? 'dark' : 'light');
  }, [dark]);
  const list = useMemo(() => {
    let found = products.slice(0, 12).filter(
      p =>
        (category === 'All products' || p.category === category) &&
        (p.name + ' ' + p.category + ' ' + p.desc)
          .toLowerCase()
          .includes(query.toLowerCase())
    );
    if (sort === 'low') found = [...found].sort((a, b) => a.price - b.price);
    if (sort === 'high') found = [...found].sort((a, b) => b.price - a.price);
    return found;
  }, [category, query, sort]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0),
    0
  );
  const delivery = subtotal === 0 || subtotal >= 25000 ? 0 : 1500;
  const total = subtotal + delivery;
  const notify = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(''), 2400);
  };
  const add = (id: string) => {
    setCart(c => ({ ...c, [id]: Math.min((c[id] || 0) + 1, 50) }));
    notify('Added to your bag');
  };
  const login = async () => {
    setError('');
    if (!supabase || !isSupabaseConfigured) {
      setError('Connect Supabase using the environment variables in .env.example, then redeploy.');
      return;
    }
    if (!authEmail.trim() || authPassword.length < 8) {
      setError('Enter a valid email and a password with at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      const result = authMode === 'signup'
        ? await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword, options: { data: { full_name: form.name.trim() || undefined } } })
        : await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });
      if (result.error) throw result.error;
      if (result.data.user && !result.data.session && authMode === 'signup') {
        setError('Account created. Check your email to confirm it, then sign in.');
      } else if (result.data.user) {
        setUser({ id: result.data.user.id, email: result.data.user.email, name: result.data.user.user_metadata?.full_name });
        setError('');
        notify(authMode === 'signup' ? 'Account created' : 'Signed in successfully');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      count === 0
    ) {
      setError(
        'Enter your name, phone number and address, and add at least one product.'
      );
      return;
    }
    if (!supabase || !user) {
      setError('Please sign in before placing an order.');
      setPanel('account');
      return;
    }
    setBusy(true);
    try {
      const orderId = 'EM-' + Date.now().toString(36).toUpperCase();
      const items = products.filter(p => cart[p.id]).map(p => ({ product_id: p.id, name: p.name, unit_price: p.price, quantity: cart[p.id] }));
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user.id, order_number: orderId, customer_name: form.name.trim(),
        phone: form.phone.trim(), email: form.email.trim() || user.email || null,
        delivery_address: form.address.trim(), city: form.city.trim(), items,
        subtotal, delivery_fee: delivery, total, status: 'pending', payment_status: 'unpaid'
      });
      if (orderError) throw orderError;
      setOrder({ orderId, total, paymentStatus: 'Unpaid — awaiting store confirmation' });
      setCart({});
      setPanel(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not save your order. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={dark ? 'app dark' : 'app'}>
      <div className="announcement">
        <Sparkles size={14} /> Everyday essentials, made easier <span>•</span>{' '}
        Welcome to EMCARE
      </div>
      <header className="header">
        <a className="brand" href="#home">
          <span className="brand-icon">✚</span>
          <span>
            <b>
              emcare<span>.</span>
            </b>
            <small>PHARMACY & STORES</small>
          </span>
        </a>
        <nav className={menu ? 'nav open' : 'nav'}>
          <a href="#home" onClick={() => setMenu(false)}>
            Home
          </a>
          <a href="#products" onClick={() => setMenu(false)}>
            Products
          </a>
          <a href="#shop" onClick={() => setMenu(false)}>
            Shop
          </a>
          <a href="#more-products" onClick={() => setMenu(false)}>
            More products
          </a>
          <a href="#why" onClick={() => setMenu(false)}>
            Why EMCARE
          </a>
          <a href="#footer" onClick={() => setMenu(false)}>
            Contact
          </a>
        </nav>
        <div className="head-actions">
          <button
            className="icon"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon"
            onClick={() => setPanel('account')}
            aria-label="Account"
          >
            <UserRound size={18} />
          </button>
          <button className="bag" onClick={() => setPanel('cart')}>
            <ShoppingBag size={17} /> Bag <b>{count}</b>
          </button>
          <button
            className="icon mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label="Menu"
          >
            <Menu size={19} />
          </button>
        </div>
      </header>
      <main>
        {page === 'products' ? (
          <section className="products-page shop" id="products-page">
            <div className="products-page-top">
              <a href="#home" className="back-home"><ArrowRight size={15} /> Back to home</a>
              <div className="eyebrow">EMCARE CATALOGUE</div>
              <h1>All products<span>.</span></h1>
              <p>Browse the full sample catalogue, find your essentials and add them to your bag.</p>
              <div className="products-page-count">{products.length} sample products · Sample prices only</div>
            </div>
            <div className="tools">
              <div className="chips">
                {categories.map(c => (
                  <button className={category === c ? 'chip active' : 'chip'} key={c} onClick={() => setCategory(c)}>{c}</button>
                ))}
              </div>
              <div className="search-row">
                <label className="search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search all products..." />{query && <button onClick={() => setQuery('')}><X size={14} /></button>}</label>
                <select className="sort" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
              </div>
            </div>
            <div className="grid">
              {products.filter(p => (category === 'All products' || p.category === category) && (p.name + ' ' + p.category + ' ' + p.desc).toLowerCase().includes(query.toLowerCase())).slice().sort((a,b) => sort === 'low' ? a.price-b.price : sort === 'high' ? b.price-a.price : 0).map(p => (
                <article className="product" key={p.id}>
                  <div className={'product-art ' + p.tone}><div className="rings"></div><span className="emoji">{p.emoji}</span>{p.old && <span className="badge">Special price</span>}<button className={wishlist.includes(p.id) ? 'wish chosen' : 'wish'} aria-label={'Toggle wishlist for ' + p.name} onClick={() => setWishlist(w => w.includes(p.id) ? w.filter(id => id !== p.id) : [...w,p.id])}><Heart size={17} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} /></button><small>emcare<span>.</span></small></div>
                  <div className="product-info"><label>{p.category}</label><h3>{p.name}</h3><p>{p.desc}</p><div className="product-bottom"><div><b>{money(p.price)}</b>{p.old && <del>{money(p.old)}</del>}</div><button className="add" onClick={() => add(p.id)} aria-label={'Add ' + p.name + ' to bag'}><Plus size={18} /></button></div></div>
                </article>
              ))}
            </div>
            {products.filter(p => (category === 'All products' || p.category === category) && (p.name + ' ' + p.category + ' ' + p.desc).toLowerCase().includes(query.toLowerCase())).length === 0 && <div className="empty"><Search /><h3>No products found</h3><p>Try another search or category.</p><button className="primary" onClick={() => {setQuery('');setCategory('All products');}}>Clear filters</button></div>}
            <p className="catalogue-note">Sample catalogue for website preview only. Confirm actual stock, product details and prices with the store before purchase.</p>
          </section>
        ) : (
        <>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <i /> YOUR EVERYDAY WELLNESS & ESSENTIALS
            </div>
            <h1>
              Good care.
              <br />
              <em>Every day.</em>
            </h1>
            <p>
              Shop everyday personal care, beauty, baby essentials and home
              favourites — all in one convenient place.
            </p>
            <div className="hero-buttons">
              <a className="primary" href="#shop">
                Explore the store <ArrowRight size={17} />
              </a>
              <span>
                <ShieldCheck size={17} /> Shopping made simple
              </span>
            </div>
            <div className="stats">
              <div>
                <b>12+</b>
                <small>Demo products</small>
              </div>
              <i />
              <div>
                <b>6</b>
                <small>Easy categories</small>
              </div>
              <i />
              <div>
                <b>₦</b>
                <small>Naira pricing</small>
              </div>
            </div>
          </div>
          <div className="visual">
            <div className="orb"></div>
            <div className="glass-product">
              <small>✳ &nbsp; YOUR DAILY ESSENTIALS</small>
              <div className="bottles">
                <span>🧴</span>
                <span>🧼</span>
                <span>🫧</span>
              </div>
              <div className="glass-caption">
                <b>Feel good, every day.</b>
                <small>Little essentials. Big difference.</small>
              </div>
            </div>
            <div className="float float-top">
              <Truck size={19} />
              <span>
                <b>Easy ordering</b>
                <small>From your phone</small>
              </span>
            </div>
            <div className="float float-bottom">
              <Heart size={19} />
              <span>
                <b>Care in every choice</b>
                <small>Everyday essentials</small>
              </span>
            </div>
          </div>
        </section>
        <section className="benefits" id="why">
          <div>
            <ShieldCheck />
            <span>
              <b>Shopping with confidence</b>
              <small>Clear product information</small>
            </span>
          </div>
          <div>
            <Truck />
            <span>
              <b>Convenient ordering</b>
              <small>Simple checkout flow</small>
            </span>
          </div>
          <div>
            <Heart />
            <span>
              <b>Here to help</b>
              <small>Customer-first experience</small>
            </span>
          </div>
        </section>
        <section className="shop" id="shop">
          <div className="section-head">
            <div>
              <div className="eyebrow">THE EMCARE EDIT</div>
              <h2>
                Shop the essentials<span>.</span>
              </h2>
              <p>Useful everyday finds, all in one place.</p>
            </div>
            <small>{list.length} products ↗</small>
          </div>
          <div className="tools">
            <div className="chips">
              {categories.map(c => (
                <button
                  className={category === c ? 'chip active' : 'chip'}
                  key={c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="search-row">
              <label className="search">
                <Search size={17} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search essentials..."
                />
                {query && (
                  <button onClick={() => setQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </label>
              <select
                className="sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>
          <div className="grid">
            {list.map(p => (
              <article className="product" key={p.id}>
                <div className={'product-art ' + p.tone}>
                  <div className="rings"></div>
                  <span className="emoji">{p.emoji}</span>
                  {p.old && <span className="badge">Special price</span>}
                  <button
                    className={wishlist.includes(p.id) ? 'wish chosen' : 'wish'}
                    aria-label="Add to wishlist"
                    onClick={() =>
                      setWishlist(w =>
                        w.includes(p.id)
                          ? w.filter(id => id !== p.id)
                          : [...w, p.id]
                      )
                    }
                  >
                    <Heart
                      size={17}
                      fill={wishlist.includes(p.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                  <small>
                    emcare<span>.</span>
                  </small>
                </div>
                <div className="product-info">
                  <label>{p.category}</label>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="product-bottom">
                    <div>
                      <b>{money(p.price)}</b>
                      {p.old && <del>{money(p.old)}</del>}
                    </div>
                    <button
                      className="add"
                      onClick={() => add(p.id)}
                      aria-label={'Add ' + p.name + ' to bag'}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {list.length === 0 && (
            <div className="empty">
              <Search />
              <h3>No products found</h3>
              <p>Try another search or category.</p>
              <button
                className="primary"
                onClick={() => {
                  setQuery('');
                  setCategory('All products');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
        <section className="shop more-products" id="more-products">
          <div className="section-head">
            <div>
              <div className="eyebrow">MORE TO EXPLORE</div>
              <h2>More products<span>.</span></h2>
              <p>Browse additional sample items across everyday categories.</p>
            </div>
            <small>{products.length - 12} additional items ↗</small>
          </div>
          <div className="grid">
            {products.slice(12).map(p => (
              <article className="product" key={p.id}>
                <div className={'product-art ' + p.tone}>
                  <div className="rings"></div>
                  <span className="emoji">{p.emoji}</span>
                  <button
                    className={wishlist.includes(p.id) ? 'wish chosen' : 'wish'}
                    aria-label={'Toggle wishlist for ' + p.name}
                    onClick={() =>
                      setWishlist(w =>
                        w.includes(p.id)
                          ? w.filter(id => id !== p.id)
                          : [...w, p.id]
                      )
                    }
                  >
                    <Heart size={17} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} />
                  </button>
                  <small>emcare<span>.</span></small>
                </div>
                <div className="product-info">
                  <label>{p.category}</label>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="product-bottom">
                    <div><b>{money(p.price)}</b></div>
                    <button className="add" onClick={() => add(p.id)} aria-label={'Add ' + p.name + ' to bag'}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="catalogue-note">These are sample listings and prices for website preview only. Confirm actual stock and pricing with the store.</p>
        </section>
        <section className="banner">
          <div className="banner-art">
            <span>🌿</span>
          </div>
          <div>
            <div className="eyebrow light">A LITTLE MORE CONVENIENCE</div>
            <h2>
              Your essentials,
              <br />
              <em>your way.</em>
            </h2>
            <p>
              Find what you need, build your bag and check out in just a few
              steps. Designed to make everyday shopping feel easy.
            </p>
            <a className="light-button" href="#shop">
              Start shopping <ArrowRight size={17} />
            </a>
          </div>
          <small className="glass-tag">EVERYDAY CARE ✳</small>
        </section>
        <section className="newsletter">
          <div>
            <span className="news-icon">✳</span>
            <span>
              <b>A little good in your inbox.</b>
              <small>
                Get store news and occasional offers when available.
              </small>
            </span>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              setNewsletter(true);
            }}
          >
            <input type="email" required placeholder="Your email address" />
            <button className="primary">
              {newsletter ? 'You’re on the list' : 'Sign me up'}{' '}
              <ArrowRight size={16} />
            </button>
          </form>
        </section>
        </>
        )}
      </main>
      <footer id="footer">
        <div className="footer-main">
          <div>
            <a className="brand" href="#home">
              <span className="brand-icon">✚</span>
              <span>
                <b>
                  emcare<span>.</span>
                </b>
                <small>PHARMACY & STORES</small>
              </span>
            </a>
            <p>
              Your everyday essentials, made easier. Explore personal care,
              beauty, baby and household favourites.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <b>Explore</b>
              <a href="#shop">All products</a>
              <a href="#shop" onClick={() => setCategory('Personal Care')}>
                Personal care
              </a>
              <a href="#shop" onClick={() => setCategory('Beauty & Skincare')}>
                Beauty & skincare
              </a>
            </div>
            <div>
              <b>Help & info</b>
              <button
                onClick={() =>
                  notify(
                    'Delivery options and fees are illustrative in this demo.'
                  )
                }
              >
                Delivery information
              </button>
              <button
                onClick={() =>
                  notify(
                    'Contact and return policies will be configured by the owner.'
                  )
                }
              >
                Returns policy
              </button>
              <button
                onClick={() =>
                  notify('Store contact details will be added by the owner.')
                }
              >
                Contact the store
              </button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EMCARE Pharmacy & Stores</span>
          <span className="demo">
            ● Preview storefront · 20 sample products and prices
          </span>
          <button onClick={() => setDark(!dark)}>
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </footer>
      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
      {panel && (
        <div
          className="overlay"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setPanel(null);
              setError('');
            }
          }}
        >
          <aside className="drawer">
            <div className="drawer-head">
              <div>
                <small>EMCARE STORE</small>
                <h2>
                  {panel === 'cart'
                    ? 'Your bag'
                    : panel === 'checkout'
                      ? 'Checkout'
                      : 'Your account'}
                </h2>
              </div>
              <button
                className="icon"
                onClick={() => {
                  setPanel(null);
                  setError('');
                }}
              >
                <X />
              </button>
            </div>
            {panel === 'cart' && (
              <>
                <div className="cart-list">
                  {count === 0 ? (
                    <div className="empty">
                      <div>🛍️</div>
                      <h3>Your bag is waiting</h3>
                      <p>Add a few everyday essentials to get started.</p>
                      <button
                        className="primary"
                        onClick={() => setPanel(null)}
                      >
                        Explore products
                      </button>
                    </div>
                  ) : (
                    products
                      .filter(p => cart[p.id])
                      .map(p => (
                        <div className="cart-row" key={p.id}>
                          <div className={'cart-emoji ' + p.tone}>
                            {p.emoji}
                          </div>
                          <div className="cart-detail">
                            <b>{p.name}</b>
                            <small>{money(p.price)}</small>
                            <div className="qty">
                              <button
                                onClick={() =>
                                  setCart(c => ({
                                    ...c,
                                    [p.id]: Math.max(0, (c[p.id] || 0) - 1),
                                  }))
                                }
                              >
                                <Minus size={13} />
                              </button>
                              <span>{cart[p.id]}</span>
                              <button onClick={() => add(p.id)}>
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                          <strong>{money(p.price * cart[p.id])}</strong>
                          <button
                            className="remove"
                            onClick={() => setCart(c => ({ ...c, [p.id]: 0 }))}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))
                  )}
                </div>
                {count > 0 && (
                  <div className="summary">
                    <div>
                      <span>Subtotal</span>
                      <b>{money(subtotal)}</b>
                    </div>
                    <div>
                      <span>Delivery estimate</span>
                      <b>{delivery === 0 ? 'Free' : money(delivery)}</b>
                    </div>
                    <div className="total">
                      <span>Total</span>
                      <b>{money(total)}</b>
                    </div>
                    <small>
                      Delivery estimate is illustrative and will be confirmed by
                      the store.
                    </small>
                    <button
                      className="primary full"
                      onClick={() => setPanel('checkout')}
                    >
                      Continue to checkout <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </>
            )}
            {panel === 'checkout' && (
              <form className="checkout" onSubmit={placeOrder}>
                <div className="notice">
                  <ShieldCheck size={18} /> Preview checkout only. No payment is collected and this is not a confirmed pharmacy order.
                </div>
                <label>
                  Full name
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="080..."
                  />
                </label>
                <label>
                  Email (optional)
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                  />
                </label>
                <label>
                  Delivery address
                  <textarea
                    required
                    value={form.address}
                    onChange={e =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Street, area and landmark"
                  />
                </label>
                <label>
                  City / town
                  <input
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                </label>
                {error && (
                  <div className="error">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                <div className="total">
                  <span>Order total</span>
                  <b>{money(total)}</b>
                </div>
                <button className="primary full" disabled={busy}>
                  {busy ? 'Submitting demo order…' : 'Place demo order'}{' '}
                  <ArrowRight size={17} />
                </button>
                <small className="fine">
                  No payment gateway is connected. This creates a demo order
                  only.
                </small>
              </form>
            )}
            {panel === 'account' && (
              <div className="account">
                {user ? (
                  <>
                    <div className="avatar">
                      {(user.name || user.email || 'E')
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                    <h3>
                      Welcome{user.name ? ', ' + user.name.split(' ')[0] : ''}!
                    </h3>
                    <p>{user.email}</p>
                    <button
                      className="primary full"
                      onClick={async () => {
                        if (supabase) await supabase.auth.signOut();
                        setUser(null);
                        setPanel(null);
                        notify('Signed out');
                      }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="avatar">✳</div>
                    <h3>Welcome to EMCARE</h3>
                    <p>
                      Account sign-in is not connected in this preview.
                    </p>
                    <button className="primary full" onClick={login}>
                      <UserRound size={17} /> Sign in securely
                    </button>
                    <small>
                      Live customer accounts need an authentication service to be configured.
                    </small>
                    {error && <div className="error">{error}</div>}
                  </>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
      {order && (
        <div className="overlay success-overlay">
          <section className="success">
            <div className="success-icon">
              <CheckCircle2 size={31} />
            </div>
            <div className="eyebrow">DEMO ORDER RECEIVED</div>
            <h2>Thanks, {form.name.split(' ')[0]}.</h2>
            <p>
              This is a local preview reference only. No order was sent to the store and no payment was taken.
            </p>
            <div className="reference">
              <small>Order reference</small>
              <b>{order.orderId}</b>
            </div>
            <div className="total">
              <span>Order total</span>
              <b>{money(order.total)}</b>
            </div>
            <div className="pending">● Demo order · {order.paymentStatus}</div>
            <button
              className="primary full"
              onClick={() => {
                setOrder(null);
                setForm({
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                  city: 'Abeokuta',
                });
              }}
            >
              Continue shopping <ArrowRight size={17} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
