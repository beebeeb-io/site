export default {
  register() {},
  async bootstrap({ strapi }) {
    // Ensure public API permissions on every startup
    await ensurePublicPermissions(strapi);

    // Only seed on first run (no admin users exist yet)
    const adminCount = await strapi.db.query('admin::user').count();
    if (adminCount > 0) return;

    console.log('[seed] First run detected — creating admin user and seeding content...');

    // 1. Create admin user
    const adminRole = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-super-admin' } });
    await strapi.db.query('admin::user').create({
      data: {
        firstname: 'Guus',
        lastname: 'Langelaar',
        email: 'guus@devidee.nl',
        password: await strapi.service('admin::auth').hashPassword('beebeeb2026'),
        isActive: true,
        blocked: false,
        roles: adminRole ? [adminRole.id] : [],
      },
    });
    console.log('[seed] Admin user created (guus@devidee.nl / beebeeb2026)');

    // Pages are static Astro files — Strapi only manages FAQ, blog, support config, changelog, and landing pages

    // 2. Seed changelog
    await strapi.documents('api::changelog-entry.changelog-entry').create({
      data: {
        title: 'Beebeeb launches in public beta',
        date: '2026-04-25',
        tags: ['launch', 'milestone'],
        body: '<p>Today we\'re opening Beebeeb to the public. Start with 5 GB free — encrypted before it leaves your device, stored in Falkenstein, Germany, governed by EU law.</p>',
      },
      status: 'published',
    });
    console.log('[seed] Changelog entry seeded');

    // 3. Seed FAQ, blog, and support config
    await seedFaqContent(strapi);
    await seedBlogContent(strapi);

    await strapi.documents('api::support-config.support-config').create({
      data: {
        heroTitle: 'How can we help?',
        heroSubtitle: 'Find answers to common questions about encryption, storage, billing, and your account.',
        contactEmail: 'support@beebeeb.io',
        securityEmail: 'security@beebeeb.io',
        responseTimeText: 'We typically respond within 24 hours on business days.',
      },
    });
    console.log('[seed] Support config seeded');

    console.log('[seed] Done! Strapi is ready.');
  },
  destroy() {},
};

async function ensurePublicPermissions(strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  const requiredActions = [
    'api::page.page.find',
    'api::page.page.findOne',
    'api::global.global.find',
    'api::changelog-entry.changelog-entry.find',
    'api::changelog-entry.changelog-entry.findOne',
    'api::faq-category.faq-category.find',
    'api::faq-category.faq-category.findOne',
    'api::faq-item.faq-item.find',
    'api::faq-item.faq-item.findOne',
    'api::support-config.support-config.find',
    'api::blog-post.blog-post.find',
    'api::blog-post.blog-post.findOne',
    'api::blog-author.blog-author.find',
    'api::blog-author.blog-author.findOne',
    'api::blog-category.blog-category.find',
    'api::blog-category.blog-category.findOne',
    'api::landing-page.landing-page.find',
    'api::landing-page.landing-page.findOne',
  ];

  let added = 0;
  for (const action of requiredActions) {
    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (!existing) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id, enabled: true },
      });
      added++;
    }
  }
  if (added > 0) {
    console.log(`[permissions] Added ${added} new public API permissions`);
  }
}

async function seedFaqContent(strapi) {
  const categories = [
    {
      name: 'Getting started',
      slug: 'getting-started',
      sortOrder: 1,
      items: [
        { question: 'How do I create an account?', answer: '<p>Visit <a href="https://app.beebeeb.io/signup">app.beebeeb.io/signup</a> and enter your email address. You will create a passphrase that encrypts all your data — we never see this passphrase.</p>', sortOrder: 1, searchTags: 'signup,register,account,create' },
        { question: 'What happens if I forget my passphrase?', answer: '<p>If you have your 12-word recovery phrase, you can reset your passphrase. If you have lost both your passphrase and recovery phrase, your data is permanently inaccessible. This is by design — it means we cannot access your data either.</p>', sortOrder: 2, searchTags: 'passphrase,password,forgot,reset,recovery' },
        { question: 'Which platforms are supported?', answer: '<p>Beebeeb is available on Web (any modern browser), macOS, Windows, Linux, iOS, and Android. All clients are open source.</p>', sortOrder: 3, searchTags: 'platforms,devices,ios,android,mac,windows,linux' },
      ],
    },
    {
      name: 'Security & encryption',
      slug: 'security',
      sortOrder: 2,
      items: [
        { question: 'What encryption does Beebeeb use?', answer: '<p>AES-256-GCM for file encryption, Argon2id for key derivation from your passphrase, X25519 for key exchange when sharing files, and HKDF-SHA256 for per-file key derivation. Every file — and every filename — is encrypted on your device before upload.</p>', sortOrder: 1, searchTags: 'encryption,aes,argon2,zero-knowledge,e2ee' },
        { question: 'Can Beebeeb staff read my files?', answer: '<p>No. This is not a policy decision — it is an architectural guarantee. Your encryption keys are derived from your passphrase, which never leaves your device. Our servers store only encrypted blobs. If compelled by law enforcement, we can only hand over encrypted data we cannot decrypt.</p>', sortOrder: 2, searchTags: 'zero-knowledge,privacy,staff,access,read' },
        { question: 'Is Beebeeb open source?', answer: '<p>All client applications (web, desktop, mobile, CLI) are open source under AGPL-3.0 and available on <a href="https://github.com/beebeeb-io">GitHub</a>. You can audit the encryption implementation, compile from source, or self-host.</p>', sortOrder: 3, searchTags: 'open source,github,code,audit,agpl' },
        { question: 'Has Beebeeb been audited?', answer: '<p>Not yet. A third-party security audit is planned but has not been scheduled. Our cryptographic implementation uses well-established primitives (AES-256-GCM, Argon2id, X25519) and all client code is open source on GitHub for public review.</p>', sortOrder: 4, searchTags: 'audit,security,review' },
      ],
    },
    {
      name: 'Account & billing',
      slug: 'billing',
      sortOrder: 3,
      items: [
        { question: 'What plans are available?', answer: '<p>Free (5 GB), Basic (1 TB at EUR 10.99/month), Pro (5 TB+ at EUR 54.95/month), and Business (10 TB+ at EUR 109.90/month, coming later this year). All plans include end-to-end encryption. Annual billing saves two months.</p>', sortOrder: 1, searchTags: 'plans,pricing,cost,free,basic,pro,business' },
        { question: 'How do I cancel my subscription?', answer: '<p>Go to Settings then Billing then Cancel subscription. Your data remains accessible until the end of your billing period. After that, your account reverts to the Free plan. We do not use dark patterns — cancellation is two clicks.</p>', sortOrder: 2, searchTags: 'cancel,subscription,billing,stop' },
        { question: 'Which payment methods are accepted?', answer: '<p>We accept credit/debit cards (Visa, Mastercard, Amex) and SEPA direct debit via Stripe. All payment processing happens through Stripe — we never see your full card number.</p>', sortOrder: 3, searchTags: 'payment,credit card,sepa,stripe' },
      ],
    },
    {
      name: 'Privacy & legal',
      slug: 'privacy',
      sortOrder: 4,
      items: [
        { question: 'Where is my data stored?', answer: '<p>All data is stored on EU-operated infrastructure in Falkenstein, Germany. No data ever leaves the European Union. No US sub-processors have access to storage infrastructure.</p>', sortOrder: 1, searchTags: 'location,data,eu,europe,germany,gdpr' },
        { question: 'Is Beebeeb GDPR compliant?', answer: '<p>Yes. Beebeeb is operated by Initlabs B.V. in the Netherlands. We process minimal personal data (email, payment info via Stripe, usage metadata). File contents are encrypted and inaccessible to us, which is the strongest possible form of data protection.</p>', sortOrder: 2, searchTags: 'gdpr,compliance,regulation,eu,data protection' },
        { question: 'How do I request my data or delete my account?', answer: '<p>Go to Settings then Privacy then Export data to download everything we have. To delete your account, use Settings then Privacy then Delete account. This is irreversible — all encrypted data is permanently destroyed.</p>', sortOrder: 3, searchTags: 'dsar,export,delete,account,data request,right to erasure' },
      ],
    },
    {
      name: 'Technical',
      slug: 'technical',
      sortOrder: 5,
      items: [
        { question: 'Is there a CLI tool?', answer: '<p>Yes. The <code>bb</code> CLI is available via Homebrew (<code>brew install beebeeb-io/tap/bb</code>) or as a direct download. It supports upload, download, sync, and sharing from the terminal.</p>', sortOrder: 1, searchTags: 'cli,terminal,command line,bb,homebrew' },
        { question: 'Is there an API?', answer: '<p>A REST API is available for Pro and Business plans. Documentation is at <a href="https://beebeeb.io/docs">beebeeb.io/docs</a>. The API requires client-side encryption — you encrypt before sending, just like our apps do.</p>', sortOrder: 2, searchTags: 'api,rest,developer,integration' },
        { question: 'What is the maximum file size?', answer: '<p>Individual files up to 50 GB are supported. Files are chunked and encrypted in 64 MB segments for efficient upload and download. There is no limit on the number of files.</p>', sortOrder: 3, searchTags: 'file size,limit,maximum,upload' },
      ],
    },
  ];

  for (const cat of categories) {
    const { items, ...catData } = cat;
    const created = await strapi.documents('api::faq-category.faq-category').create({ data: catData });
    for (const item of items) {
      await strapi.documents('api::faq-item.faq-item').create({
        data: { ...item, faq_category: created.documentId },
      });
    }
  }
  console.log(`[seed] ${categories.length} FAQ categories with ${categories.reduce((n, c) => n + c.items.length, 0)} items seeded`);
}

async function seedBlogContent(strapi) {
  const author = await strapi.documents('api::blog-author.blog-author').create({
    data: {
      name: 'Guus Langelaar',
      slug: 'guus-langelaar',
      bio: 'CTO and co-founder of Beebeeb. Building encrypted infrastructure from Wijchen, Netherlands.',
      role: 'CTO & Co-founder',
      socialLinks: { github: 'https://github.com/guuslangelaar' },
    },
  });

  const categories = {
    engineering: await strapi.documents('api::blog-category.blog-category').create({
      data: { name: 'Engineering', slug: 'engineering', description: 'Technical deep-dives into how Beebeeb is built.' },
    }),
    privacy: await strapi.documents('api::blog-category.blog-category').create({
      data: { name: 'Privacy', slug: 'privacy', description: 'Thoughts on privacy, encryption, and European data sovereignty.' },
    }),
    company: await strapi.documents('api::blog-category.blog-category').create({
      data: { name: 'Company', slug: 'company', description: 'Updates from the Beebeeb team.' },
    }),
  };

  const posts = [
    {
      title: 'Why we built Beebeeb',
      slug: 'why-we-built-beebeeb',
      excerpt: 'The cloud storage market is full of products that promise privacy but deliver convenience with a privacy veneer. We built Beebeeb because we wanted the real thing.',
      content: '<h2>The problem with "encrypted" cloud storage</h2><p>Most cloud storage providers encrypt your data — in transit and at rest. But they hold the keys. That means they can read your files, comply with broad government requests, or suffer a breach that exposes your data. "Encrypted" has become a marketing checkbox, not an engineering commitment.</p><h2>What we wanted</h2><p>We wanted a cloud where encryption is not a feature you turn on — it is the architecture. Where the server is fundamentally incapable of reading your data. Where "we protect your privacy" is not a policy promise but a mathematical guarantee.</p><h2>Why Europe matters</h2><p>We are a Dutch company, operated from Wijchen, Netherlands. Our servers run on dedicated infrastructure in Falkenstein, Germany. Every byte stays in the EU. This is not just about GDPR compliance — it is about being outside the reach of the US CLOUD Act, which can compel US-connected companies to hand over data stored anywhere in the world.</p><h2>What we are building</h2><p>Beebeeb is end-to-end encrypted cloud storage with apps for every platform: web, macOS, Windows, Linux, iOS, Android, and a CLI. All client apps are open source under AGPL-3.0. You can audit the code, compile it yourself, or self-host.</p><p>We are building this for individuals who care about privacy and small teams in regulated industries who need encrypted collaboration without the enterprise ceremony.</p>',
      readingTime: 4,
      category: categories.company.documentId,
      publishedAt: '2026-04-25T09:00:00.000Z',
    },
    {
      title: 'How zero-knowledge encryption works at Beebeeb',
      slug: 'how-zero-knowledge-works',
      excerpt: 'A technical walkthrough of our encryption architecture: from passphrase to ciphertext, with no server-side key material.',
      content: '<h2>The key derivation chain</h2><p>When you create a Beebeeb account, you choose a passphrase. This passphrase is the root of all your encryption keys — and it never leaves your device.</p><p>Here is how we turn your passphrase into file encryption:</p><ol><li><strong>Passphrase to Master Key:</strong> Argon2id with 256 MB memory, 4 iterations, 4 lanes. This makes brute-force attacks extremely expensive.</li><li><strong>Master Key to Per-file Key:</strong> HKDF-SHA256 derives a unique 256-bit key for each file using the file ID as context.</li><li><strong>Per-file Key to Ciphertext:</strong> AES-256-GCM encrypts the file content and filename with a random 96-bit nonce.</li></ol><h2>What the server sees</h2><p>Our server receives: an encrypted blob (the file), an encrypted blob (the filename), a nonce, and metadata (size, timestamp, owner ID). It cannot derive any key material. It cannot read the filename. It cannot read the file content.</p><h2>Sharing</h2><p>When you share a file, X25519 key exchange creates a shared secret between your key pair and the recipient\'s public key. The per-file key is re-encrypted under this shared secret. At no point does the server learn the file key.</p><h2>Recovery</h2><p>Your master key is also encoded as a 12-word mnemonic recovery phrase. If you lose your passphrase, you can use this phrase to recover your master key and re-derive all file keys. If you lose both, your data is gone. This is the trade-off of real zero-knowledge encryption.</p>',
      readingTime: 6,
      category: categories.engineering.documentId,
      publishedAt: '2026-04-26T09:00:00.000Z',
    },
    {
      title: 'What "Made in Europe" actually means',
      slug: 'what-made-in-europe-means',
      excerpt: 'When we say "Made in Europe," we mean every byte, every server, every legal entity. Here is exactly what that entails.',
      content: '<h2>Infrastructure</h2><p>All Beebeeb data is stored on dedicated servers in Falkenstein, Germany. Our infrastructure provider is a German company with no US parent company, no US investors, and no US operational presence. They cannot be compelled under the US CLOUD Act.</p><h2>Legal entity</h2><p>Beebeeb is operated by Initlabs B.V., registered at the Dutch Chamber of Commerce (KvK 95157565). We are a Dutch company governed exclusively by Dutch and EU law.</p><h2>Sub-processors</h2><p>Our only third-party sub-processor with access to any user data is Stripe (for payment processing). Stripe processes card details — we never see full card numbers. All other infrastructure is self-operated on EU bare metal.</p><h2>Why this matters</h2><p>The US CLOUD Act (2018) allows US authorities to compel any US-connected company to hand over data, regardless of where it is stored. Many "European" cloud providers use AWS, Azure, or GCP under the hood — making them subject to US jurisdiction. We chose EU-owned infrastructure specifically to avoid this.</p><h2>What we do not claim</h2><p>We do not claim that EU jurisdiction makes your data immune to government access. EU member states have their own lawful interception regimes. But because Beebeeb uses zero-knowledge encryption, even a valid EU court order would only produce encrypted data we cannot decrypt.</p>',
      readingTime: 5,
      category: categories.privacy.documentId,
      publishedAt: '2026-04-28T09:00:00.000Z',
    },
    {
      title: 'Why we chose EU-only infrastructure',
      slug: 'why-eu-infrastructure',
      excerpt: 'Our infrastructure runs on dedicated servers in Falkenstein, Germany — owned and operated by a European company. Here is why we avoided the hyperscalers.',
      content: '<h2>The hyperscaler problem</h2><p>AWS, Azure, and GCP are US companies. Even when they offer EU regions, they remain subject to the US CLOUD Act. For a zero-knowledge encryption product, using a US-controlled infrastructure provider undermines the security model.</p><h2>Why EU-owned infrastructure</h2><p>Our servers run in Falkenstein, Germany, operated by a European company with no US parent, no US investors, and no US operational presence. Key factors:</p><ul><li><strong>No US jurisdiction:</strong> European company, European ownership — cannot be compelled under the CLOUD Act</li><li><strong>Own hardware:</strong> Dedicated servers in EU-operated data centres. No abstraction layers, no shared hyperscaler fabric.</li><li><strong>Cost efficiency:</strong> Dedicated servers at a fraction of hyperscaler pricing. We pass these savings to customers.</li><li><strong>Renewable energy:</strong> Our primary data centre runs on renewable energy.</li></ul><h2>What about redundancy?</h2><p>We use Falkenstein, Germany as our primary location. For geographic redundancy, we plan to add a secondary location in the Netherlands. Both EU-owned and operated.</p><h2>The trade-off</h2><p>EU infrastructure providers do not offer the managed services ecosystem of AWS. We build more infrastructure ourselves: load balancing, backup rotation, monitoring. This is a trade-off we accept because the alternative — putting encrypted data on US-controlled infrastructure — would undermine the entire product.</p>',
      readingTime: 4,
      category: categories.engineering.documentId,
      publishedAt: '2026-04-30T09:00:00.000Z',
    },
  ];

  for (const post of posts) {
    await strapi.documents('api::blog-post.blog-post').create({
      data: { ...post, author: author.documentId },
      status: 'published',
    });
  }
  console.log(`[seed] ${posts.length} blog posts seeded with author and categories`);
}
