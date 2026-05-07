export type Phase = 1 | 2 | 3 | 4;

export interface PhaseConfig {
  phase: Phase;
  isLive: boolean;
  clientsLive: boolean;
  bizLive: boolean;
  primaryCTA: string;
  primaryHref: string;
  basicCTA: string;
  proCTA: string;
  bizCTA: string;
  freeCTA: string;
  availLabel: string;
  availDot: 'live' | 'soon';
  bizBadge: string | null;
  ctaCaption: string;
  webLive: boolean;
  cliLive: boolean;
  iosLive: boolean;
  androidLive: boolean;
  desktopLive: boolean;
  rcloneLive: boolean;
}

export function phaseConfig(phase: Phase = 1): PhaseConfig {
  const isLive = phase >= 2;
  const clientsLive = phase >= 3;
  const bizLive = phase >= 4;
  return {
    phase, isLive, clientsLive, bizLive,
    primaryCTA: isLive ? 'Get started free' : 'Join the waitlist',
    primaryHref: isLive ? 'https://app.beebeeb.io/signup' : '#waitlist',
    basicCTA: isLive ? 'Get Basic' : 'Join the waitlist',
    proCTA: isLive ? 'Get Pro' : 'Join the waitlist',
    bizCTA: bizLive ? 'Get Business' : 'Join the waitlist',
    freeCTA: isLive ? 'Start free' : 'Join the waitlist',
    availLabel: isLive ? 'Available now' : 'Available at launch',
    availDot: isLive ? 'live' : 'soon',
    bizBadge: phase === 1 ? 'Coming later this year' : phase < 4 ? 'Coming soon' : null,
    ctaCaption: isLive ? '5 GB free. No credit card required.' : 'One email when we go live. Then silence.',
    webLive: isLive,
    cliLive: isLive,
    iosLive: clientsLive,
    androidLive: clientsLive,
    desktopLive: clientsLive,
    rcloneLive: clientsLive,
  };
}
