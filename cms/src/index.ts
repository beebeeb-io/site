export default {
  register() {},
  async bootstrap({ strapi }) {
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

    // 2. Enable public API access for pages, global, changelog-entries
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (publicRole) {
      const permissions = [
        { action: 'api::page.page.find' },
        { action: 'api::page.page.findOne' },
        { action: 'api::global.global.find' },
        { action: 'api::changelog-entry.changelog-entry.find' },
        { action: 'api::changelog-entry.changelog-entry.findOne' },
      ];
      for (const perm of permissions) {
        const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: { action: perm.action, role: publicRole.id },
        });
        if (!existing) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: { ...perm, role: publicRole.id, enabled: true },
          });
        }
      }
      console.log('[seed] Public permissions set for pages, global, changelog-entries');
    }

    // 3. Seed Global
    await strapi.documents('api::global.global').create({
      data: {
        site_name: 'Beebeeb',
        site_mode: 'live',
        coming_soon_title: 'Something is brewing.',
        coming_soon_subtitle: 'Beebeeb is end-to-end encrypted cloud storage. Made in Europe, for people who want their files private by default. We are building it right now.',
        coming_soon_cta_label: 'Get notified at launch',
        coming_soon_cta_href: 'mailto:hello@beebeeb.io?subject=Notify me when Beebeeb launches',
        company_name: 'Initlabs B.V.',
        kvk: '95157565',
        btw_id: 'NL867023430B01',
        address: 'Kelvinstraat 34A\n6601 HE Wijchen',
        email: 'hello@beebeeb.io',
        navigation: [
          { label: 'Product', href: '/' },
          { label: 'For teams', href: '/' },
          { label: 'Security', href: '/security' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Open source', href: '/' },
        ],
        footer_columns: [
          {
            title: 'Product',
            items: [
              { label: 'Drive', href: '#' },
              { label: 'Photos', href: '#' },
              { label: 'Sharing', href: '#' },
              { label: 'Team vaults', href: '#' },
              { label: 'Desktop apps', href: '#' },
              { label: 'Mobile apps', href: '#' },
            ],
          },
          {
            title: 'Security',
            items: [
              { label: 'Whitepaper', href: '#' },
              { label: 'Open source', href: '#' },
              { label: 'Audit reports', href: '#' },
              { label: 'Bug bounty', href: '/bug-bounty' },
              { label: 'Security page', href: '/security' },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About', href: '/about' },
              { label: 'Careers', href: '/careers' },
              { label: 'Blog', href: '#' },
              { label: 'Press', href: '#' },
              { label: 'Contact', href: '#' },
            ],
          },
          {
            title: 'Legal',
            items: [
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'DPA', href: '#' },
              { label: 'Transparency report', href: '#' },
              { label: 'Imprint', href: '/imprint' },
            ],
          },
        ],
      },
    });
    console.log('[seed] Global data seeded');

    // 4. Seed pages
    const pages = [
      {
        title: 'Home',
        slug: 'home',
        seo_title: 'Beebeeb — Storage that can\'t be read. Not even by us.',
        seo_description: 'Beebeeb is the European cloud for people who want their files encrypted before they leave their device, stored on EU soil, and governed by EU law.',
        publishedAt: new Date(),
        blocks: [
          {
            __component: 'blocks.hero-landing',
            title: 'Storage that can\'t be read',
            title_highlight: '— not even by us.',
            subtitle: 'Beebeeb is the European cloud for people who want their files encrypted before they leave their device, stored on EU soil, and governed by EU law — nothing more, nothing less.',
            announcement: 'Built for NIS2 & DORA — read our compliance note',
            cta_primary_label: 'Start free · 10 GB',
            cta_primary_href: 'https://app.beebeeb.io/signup',
            cta_secondary_label: 'Download desktop app',
            cta_secondary_href: 'https://app.beebeeb.io/download',
            trust_badges: ['No card', 'Open-source clients', 'Audit our code on GitHub'],
          },
          {
            __component: 'blocks.trust-bar',
            items: {
              label: 'Built on EU infrastructure',
              providers: ['Hetzner · Germany', 'Leaseweb · Netherlands'],
              chips: ['GDPR', 'NIS2', 'DORA', 'ISO 27001 — in progress'],
            },
          },
          {
            __component: 'blocks.pillars-grid',
            label: 'Why Beebeeb',
            title: 'Four promises. No fine print.',
            pillars: [
              { number: '01', icon: 'shield', title: 'Zero-knowledge, architecturally.', description: 'Files are encrypted on your device with a key we never see. Our servers store opaque blobs — if subpoenaed, we hand over encrypted garbage, and that\'s the point.', stat: 'AES-256-GCM · Argon2id · X25519' },
              { number: '02', icon: 'cloud', title: 'European soil, European law.', description: 'Every byte lives in an EU-operated data centre. No CLOUD Act exposure, no US subprocessors, no fine print that moves your data to Oregon overnight.', stat: 'Choice of region · DE · NL · FR' },
              { number: '03', icon: 'users', title: 'Built for small teams that act big.', description: 'Shared vaults, team keys, client portals, audit logs, SSO. Everything regulated industries need — without the enterprise ceremony or pricing.', stat: 'From 5 seats · €9.99 / seat' },
              { number: '04', icon: 'key', title: 'Open where it counts.', description: 'Every client app — web, iOS, Android, desktop — is open source and reproducibly built. Read the code, compile it yourself, run it offline. We earn trust, we don\'t ask for it.', stat: 'AGPL-3.0 · audited by Cure53' },
            ],
          },
          {
            __component: 'blocks.comparison-table',
            label: 'The honest comparison',
            title: 'How we stack up — without the spin.',
            columns: [
              { name: 'Beebeeb', highlight: true },
              { name: 'Dropbox' },
              { name: 'Proton' },
              { name: 'Tresorit' },
            ],
            rows: [
              ['End-to-end encryption by default', 'y', 'n', 'y', 'y'],
              ['Zero-knowledge keys', 'y', 'n', 'y', 'y'],
              ['EU-only infrastructure', 'y', 'opt', 'y', 'opt'],
              ['Not subject to US CLOUD Act', 'y', 'n', 'y', 'n'],
              ['Open-source client apps', 'y', 'n', 'partial', 'n'],
              ['SSO + audit logs on Team tier', 'y', 'addon', 'addon', 'y'],
              ['Honest "we can\'t recover your data" UX', 'y', 'n', 'partial', 'partial'],
            ],
            footnote: 'Comparison as of April 2026 based on public documentation. We keep this table current — including when competitors catch up.',
          },
          {
            __component: 'blocks.founder-quote',
            label: 'A note from the founders',
            quote: 'We\'re two brothers from Wijchen who spent years building reliable systems at other companies. Every European SMB we know is one CLOUD Act away from an uncomfortable conversation with their customers. We wanted one answer: encrypted on your device, stored in the EU, governed by EU law. That\'s the whole product.',
            author_name: 'Bram & Guus Langelaar',
            author_title: 'CEO & CTO · Wijchen, NL',
            author_initials: 'ID',
          },
          {
            __component: 'blocks.cta-section',
            title: 'Start encrypting',
            title_highlight: 'in the next 90 seconds.',
            description: '10 GB free forever. No card, no upsell email storm, no dark patterns on the way out.',
            cta_primary_label: 'Create your account',
            cta_primary_href: 'https://app.beebeeb.io/signup',
            cta_secondary_label: 'Read the whitepaper',
            cta_secondary_href: '/security',
            dark_bg: true,
          },
        ],
      },
      {
        title: 'Security',
        slug: 'security',
        seo_title: 'Security — Beebeeb',
        seo_description: 'How encryption works at Beebeeb. Zero-knowledge by architecture, not by promise.',
        publishedAt: new Date(),
        blocks: [
          {
            __component: 'blocks.hero-simple',
            label: 'How encryption works at Beebeeb',
            title: 'We don\'t ask you to trust us.<br /><span class="text-ink-3">We designed a system that cannot betray you.</span>',
            description: 'Your passphrase never leaves your device. Your keys never touch our servers. Every file — and every filename — is encrypted before it\'s uploaded.',
          },
          {
            __component: 'blocks.security-flow',
            label: 'The lifecycle of a file',
            steps: [
              { step_number: '01', title: 'Passphrase', description: 'You type a passphrase. It never leaves your device.' },
              { step_number: '02', title: 'Key derivation', description: 'Argon2id stretches it into a master key.' },
              { step_number: '03', title: 'Per-file key', description: 'HKDF derives a unique key per file.' },
              { step_number: '04', title: 'Encrypt', description: 'AES-256-GCM encrypts file + filename.' },
              { step_number: '05', title: 'Upload', description: 'Only ciphertext reaches our servers.' },
            ],
          },
          {
            __component: 'blocks.primitives-grid',
            title: 'Cryptographic primitives',
            subtitle: 'Every choice is deliberate. No rolling our own crypto.',
            primitives: [
              { label: 'Symmetric encryption', value: 'AES-256-GCM', description: 'NIST-approved authenticated encryption. 256-bit keys, 96-bit nonces.' },
              { label: 'Key derivation', value: 'Argon2id', description: 'Memory-hard password hashing. Winner of the Password Hashing Competition.' },
              { label: 'Key agreement', value: 'X25519', description: 'Elliptic-curve Diffie-Hellman for sharing encrypted files between users.' },
              { label: 'Per-file keys', value: 'HKDF-SHA256', description: 'Deterministic key derivation. One master key, unique key per file.' },
              { label: 'Recovery', value: 'BIP39', description: '24-word mnemonic seed phrase. Industry standard from Bitcoin.' },
              { label: 'Auth tokens', value: 'Argon2id', description: 'Server-side password verification. No plaintext storage.' },
            ],
          },
          {
            __component: 'blocks.cta-section',
            title: 'See it for yourself.',
            description: 'Every client app is open source. Read the code, compile it yourself, run it offline.',
            cta_primary_label: 'View on GitHub',
            cta_primary_href: 'https://github.com/beebeeb-io',
            cta_secondary_label: 'Start encrypting',
            cta_secondary_href: 'https://app.beebeeb.io/signup',
            dark_bg: false,
          },
        ],
      },
      {
        title: 'Pricing',
        slug: 'pricing',
        seo_title: 'Pricing — Beebeeb',
        seo_description: 'Simple, honest pricing. Start free with 10 GB. Upgrade when you need more.',
        publishedAt: new Date(),
        blocks: [
          {
            __component: 'blocks.hero-simple',
            label: 'Pricing',
            title: 'Simple plans. No surprises.',
            description: 'Start free with 10 GB. Upgrade when you need more space or team features.',
          },
          {
            __component: 'blocks.pricing-grid',
            plans: [
              { name: 'Free', price: '0', period: 'forever', description: 'For trying it out or keeping a few important files encrypted.', features: '10 GB storage\nE2E encryption\n1 user\nWeb + desktop + mobile\nCommunity support', cta_label: 'Start free', variant: 'default' },
              { name: 'Personal', price: '5', period: '/month', description: 'For individuals who want encrypted cloud storage they can rely on.', features: '2 TB storage\nE2E encryption\n1 user\nAll platforms\nPriority email support\nFile versioning (90 days)\nEncrypted sharing links', cta_label: 'Start with Personal', variant: 'amber', popular: true },
              { name: 'Team', price: '6', period: '/seat/month', description: 'For small teams that need shared encrypted workspaces.', features: '2 TB per seat\nShared team vaults\nUp to 50 users\nSSO (SAML/OIDC)\nAudit log\nAdmin console\nPriority support', cta_label: 'Start with Team', variant: 'default' },
              { name: 'Business', price: '9.99', period: '/seat/month', description: 'For regulated industries and security-conscious organizations.', features: '5 TB per seat\nUnlimited users\nClient portals\nAdvanced audit log\nData residency controls\nDedicated support\nCustom retention policies\nAPI access', cta_label: 'Contact sales', variant: 'default' },
            ],
            footnote: 'All prices exclude VAT. Annual billing available at 2 months free.',
          },
        ],
      },
      {
        title: 'About',
        slug: 'about',
        seo_title: 'About — Beebeeb',
        seo_description: 'Two brothers from Wijchen building the European cloud that answers to you.',
        publishedAt: new Date(),
        blocks: [
          {
            __component: 'blocks.hero-simple',
            label: 'Made in Europe, on purpose',
            title: 'Two brothers. One hive.<br /><span class="text-ink-3">A cloud that answers to you.</span>',
          },
          {
            __component: 'blocks.about-story',
            body: '<p>We started Beebeeb because we were tired of the trade-off: use a convenient cloud service that can read your files, or self-host and lose all the convenience. We wanted a third option — a cloud that\'s as easy as Dropbox but architecturally incapable of accessing your data.</p><p>Beebeeb is operated by Initlabs B.V., registered in Wijchen, the Netherlands. We\'re bootstrapped, profitable by design, and not interested in venture capital that comes with growth-at-all-costs strings attached.</p>',
            facts: [
              { label: 'Founded', value: '2025' },
              { label: 'Location', value: 'Wijchen, NL' },
              { label: 'Team', value: '2' },
              { label: 'Funded by', value: 'Customers' },
            ],
          },
          {
            __component: 'blocks.promises-list',
            title: 'Five promises we make to every user.',
            promises: [
              { title: 'We will never read your files.', body: 'Not because of a policy — because of math. We don\'t have your keys.' },
              { title: 'We will never sell your data.', body: 'We sell storage. That\'s the business model. There is no second business model.' },
              { title: 'We will never move your data outside the EU.', body: 'Every byte stays on EU-operated infrastructure. Hetzner in Germany, Leaseweb in the Netherlands.' },
              { title: 'We will always publish our client code.', body: 'Every client app is open source under AGPL-3.0. You can audit, fork, or self-host.' },
              { title: 'We will tell you when things go wrong.', body: 'No vague "we\'re investigating." Our status page shows real metrics, and our incident reports explain root causes.' },
            ],
          },
        ],
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy',
        seo_title: 'Privacy Policy — Beebeeb',
        seo_description: 'How Beebeeb handles your data. Short version: we can\'t read it.',
        publishedAt: new Date(),
        blocks: [{ __component: 'blocks.legal-text', title: 'Privacy Policy', body: '<p>This privacy policy explains how Initlabs B.V. ("Beebeeb", "we", "us") processes personal data when you use beebeeb.io.</p><h2>What we collect</h2><p>Email address (for account creation), payment information (processed by Stripe), and usage metadata (storage used, login timestamps). We cannot access the contents of your files — they are encrypted with keys we do not hold.</p><h2>Legal basis</h2><p>Contract performance (GDPR Art. 6(1)(b)) for providing the service. Legitimate interest (Art. 6(1)(f)) for security logging.</p><h2>Data location</h2><p>All data is stored on EU-operated infrastructure: Hetzner (Germany) and Leaseweb (Netherlands).</p><h2>Contact</h2><p>Initlabs B.V., Kelvinstraat 34A, 6601 HE Wijchen, Netherlands. Email: privacy@beebeeb.io</p>' }],
      },
      {
        title: 'Terms of Service',
        slug: 'terms',
        seo_title: 'Terms of Service — Beebeeb',
        seo_description: 'Terms governing your use of Beebeeb cloud storage.',
        publishedAt: new Date(),
        blocks: [{ __component: 'blocks.legal-text', title: 'Terms of Service', body: '<p>These terms govern your use of Beebeeb, operated by Initlabs B.V. (KvK 95157565).</p><h2>The service</h2><p>Beebeeb provides end-to-end encrypted cloud storage. Your files are encrypted on your device before upload. We cannot decrypt or access them.</p><h2>Your responsibility</h2><p>You are responsible for your passphrase and recovery phrase. If you lose both, your data is permanently inaccessible. We cannot recover it.</p><h2>Acceptable use</h2><p>You may not use Beebeeb to store or distribute illegal content. We reserve the right to suspend accounts that violate applicable law.</p><h2>Liability</h2><p>Beebeeb is provided "as is." Our liability is limited to the fees you have paid in the 12 months preceding a claim.</p><h2>Governing law</h2><p>These terms are governed by Dutch law. Disputes are resolved by the courts of Arnhem, Netherlands.</p>' }],
      },
      {
        title: 'Imprint',
        slug: 'imprint',
        seo_title: 'Imprint — Beebeeb',
        seo_description: 'Legal information about the operator of Beebeeb.',
        publishedAt: new Date(),
        blocks: [{ __component: 'blocks.legal-text', title: 'Imprint', body: '<h2>Operator</h2><p>Initlabs B.V.<br />Kelvinstraat 34A<br />6601 HE Wijchen<br />Netherlands</p><h2>Registration</h2><p>KvK (Chamber of Commerce): 95157565<br />BTW (VAT): NL867023430B01</p><h2>Contact</h2><p>Email: hello@beebeeb.io</p><h2>Responsible for content</h2><p>Guus Langelaar, Director</p>' }],
      },
      {
        title: 'Changelog',
        slug: 'changelog',
        seo_title: 'Changelog — Beebeeb',
        seo_description: 'What\'s new in Beebeeb. Product updates and improvements.',
        publishedAt: new Date(),
        blocks: [
          { __component: 'blocks.hero-simple', label: 'Changelog', title: 'What\'s new.', description: 'Product updates, improvements, and fixes.' },
          { __component: 'blocks.changelog-list', title: 'Recent updates' },
        ],
      },
      {
        title: 'Status',
        slug: 'status',
        seo_title: 'System Status — Beebeeb',
        seo_description: 'Current status of Beebeeb services.',
        publishedAt: new Date(),
        blocks: [
          { __component: 'blocks.hero-simple', label: 'System status', title: 'All systems operational.', description: 'Real-time status of Beebeeb services.' },
          {
            __component: 'blocks.status-grid',
            services: [
              { name: 'Web App', status: 'operational' },
              { name: 'API', status: 'operational' },
              { name: 'File Storage (DE)', status: 'operational' },
              { name: 'File Storage (NL)', status: 'operational' },
              { name: 'Authentication', status: 'operational' },
              { name: 'Sharing', status: 'operational' },
            ],
            incidents: [],
          },
        ],
      },
      {
        title: 'Documentation',
        slug: 'docs',
        seo_title: 'Documentation — Beebeeb',
        seo_description: 'Guides, API reference, and tutorials for Beebeeb.',
        publishedAt: new Date(),
        blocks: [
          { __component: 'blocks.hero-simple', label: 'Documentation', title: 'Everything you need to know.', description: 'Guides, API reference, and security documentation.' },
          {
            __component: 'blocks.docs-grid',
            categories: [
              { title: 'Getting Started', description: 'Create your account, install apps, upload your first file.', link_count: 5 },
              { title: 'Security', description: 'How encryption works, key management, recovery phrases.', link_count: 8 },
              { title: 'Teams', description: 'Shared vaults, member management, SSO setup.', link_count: 6 },
              { title: 'API Reference', description: 'REST API documentation for developers.', link_count: 12 },
              { title: 'Desktop & Mobile', description: 'Platform-specific guides for all apps.', link_count: 7 },
              { title: 'Billing', description: 'Plans, invoices, payment methods, cancellation.', link_count: 4 },
            ],
          },
        ],
      },
      {
        title: 'Careers',
        slug: 'careers',
        seo_title: 'Careers — Beebeeb',
        seo_description: 'Join the team building Europe\'s encrypted cloud.',
        publishedAt: new Date(),
        blocks: [
          { __component: 'blocks.hero-simple', label: 'Careers', title: 'Build something that matters.', description: 'We\'re a small team solving a big problem. If you care about privacy and good engineering, we should talk.' },
          {
            __component: 'blocks.careers-list',
            intro: 'Beebeeb is operated by Initlabs B.V. from Wijchen, Netherlands. We\'re a small, bootstrapped team that values depth over breadth.',
            roles: [],
            facts: [
              { label: 'Team size', value: '2' },
              { label: 'Location', value: 'Wijchen, NL' },
              { label: 'Remote', value: 'EU only' },
              { label: 'Funded by', value: 'Revenue' },
            ],
          },
        ],
      },
      {
        title: 'Bug Bounty',
        slug: 'bug-bounty',
        seo_title: 'Bug Bounty — Beebeeb',
        seo_description: 'Report security vulnerabilities in Beebeeb and get rewarded.',
        publishedAt: new Date(),
        blocks: [
          { __component: 'blocks.hero-simple', label: 'Security', title: 'Bug bounty program.', description: 'Help us find vulnerabilities. We pay for valid reports.' },
          {
            __component: 'blocks.bounty-table',
            title: 'Reward tiers',
            description: 'Rewards depend on severity and impact. We follow CVSS scoring.',
            tiers: [
              { severity: 'Critical', reward: '€2,000 – €5,000', criteria: 'RCE, key extraction, auth bypass, data exfiltration' },
              { severity: 'High', reward: '€500 – €2,000', criteria: 'XSS with session theft, IDOR, privilege escalation' },
              { severity: 'Medium', reward: '€100 – €500', criteria: 'CSRF, information disclosure, rate limiting bypass' },
              { severity: 'Low', reward: '€50 – €100', criteria: 'Best practice violations, minor information leaks' },
            ],
            rules: '<h3>Rules</h3><ul><li>Only test against your own account.</li><li>Do not access, modify, or delete data belonging to other users.</li><li>Report via security@beebeeb.io with a detailed description.</li><li>Give us 90 days to fix before public disclosure.</li><li>Do not use automated scanners against production infrastructure.</li></ul><h3>Scope</h3><ul><li>app.beebeeb.io (web application)</li><li>api.beebeeb.io (API server)</li><li>All open-source client apps</li></ul><h3>Out of scope</h3><ul><li>beebeeb.io marketing site</li><li>Social engineering / phishing</li><li>Denial of service attacks</li></ul>',
          },
        ],
      },
    ];

    for (const page of pages) {
      await strapi.documents('api::page.page').create({ data: page, status: 'published' });
    }
    console.log(`[seed] ${pages.length} pages seeded`);

    // 5. Seed a sample changelog entry
    await strapi.documents('api::changelog-entry.changelog-entry').create({
      data: {
        title: 'Beebeeb launches in public beta',
        date: '2026-04-25',
        tags: ['launch', 'milestone'],
        body: '<p>Today we\'re opening Beebeeb to the public. Start with 10 GB free — encrypted before it leaves your device, stored in Germany, governed by EU law.</p>',
      },
      status: 'published',
    });
    console.log('[seed] Sample changelog entry created');

    console.log('[seed] Done! Strapi is ready.');
  },
  destroy() {},
};
