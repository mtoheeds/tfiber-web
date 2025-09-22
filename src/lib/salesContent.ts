// src/lib/salesContent.ts

export const pitch = `
Hi, there! How are you doing?! *pause* Yeah finally the heat has calmed down a bit and
corporate sent us door knocking. My name is *____* and I’m here behalf of T-Fiber. My
company just spent around 18 million doing a lot of construction recently, did you
happen to see any of it? *pause*
IF Yes: Then; Yeah 100% so that was T-Fiber and we were laying out down Fiber optic
infrastructure. Are you familiar with fiber optic internet?
IF No: Then; No worries – Are you familiar with fiber optic internet?
*This is fishing* (you are learning about the customer, based on what you find here you
will know which levers to pull to close the deal)
IF Yes; then; Perfect as you know Fiber optic is the next generation of internet
technology and it has a lot great advancements.
IF No; then; No worries – just to let you know Fiber optic is the next generation of
internet technology, and it has a lot of great advancements compared to the old copper
based coaxial cables that our competitors use.

I have been talking to a lot of your neighbor like *__insert names of customers from the
neighborhood__* and majority of them are using spectrum, and spectrum is one of our
competitors that uses the old copper based (use air quotes while saying shared
infrastructure) shared infrastructure that I was mentioning. Share infrastructure is kind of
like that tree (Point at a tree) where there is 1 cable coming into a neighborhood and all
the houses are leeching off the same cable. So around 4-6 o’clock when all the
neighbors are coming home from work and kids are back from school and are playing
video games, I’m sure you noticed internet slows down that’s because everyone is
using the same cable. On top of that those lines have been there for the last 50 or more
years, so they have detreated over time and to make a bad situation worse because
copper has metallic property every time it’s thundering and the positive and negative
charges react with those copper lines which is another advantage of fiber as it’s a glass-
based cable.
Now talking to all neighbors I have been finding 2 main pain points, 1 is introductory
rate, 2 is spinning wheel that is the death of joy while you are on Netflix, hulu or
youtube.
I’m assuming you have spectrum.
IF Yes: Then; And how much are you paying?
Find pricing: then; what kind of speeds do you get with that (you’d want to guess here to
build your image as the expert)

Company Internet Speed Price in Promo Price outside of

Promo
Spectrum 100 MB/s $30 $50-$54
Spectrum 500/600 MB/s
(Ultra)

$50 $82-86
Spectrum 1 Gig $70 $94-$114
Ripple 500 MB/s $50 $73
Ripple 1 Gig $85 $85
Ripple 2 Gig $105 $105
*Some customers don’t like to share their billing cost – take educated guess to
determine which plan they would have*
**Then here come the trial close**
Best part about fiber is that it allows for bisymmetrical speed meaning your download
and upload speeds will be the same, and even better part is the cost of transmitting
internet broadband over fiber optic lines is lower compared to copper based coaxial
lines. Now what this means for you is that your bill will be lowered and your experience
on facebook, Instagram, Netflix YouTube will be improved.
Now a lot of the neighbors are getting installed *choose a date that you signed up last
customer* would that date work for you?
IF Yes: Then; Put in the order.
IF No: Then; Yeah, I can understand the hesitation and today all we are doing is
choosing an installation date so you can take us on a free spin; I would be stupid to
come up to your doorstep and tell you decide on the spot. That’s why we are offering
free installation and free equipment so you can make an educated decision. Now let’s
say you’re not convinced fiber is better than copper after the installation there are no
contracts or cancellation fees.
Also just some food for thought, for the last 50 year there was only 1 fiber line in the
state of north Carolina which was in Front Bragg to the US Air Force base Langlie in
Virginia; and this was a military grade technology which recently came to the
commercial space where it started off in densily populated city center like New York,
Boston, and Chicago. Now recently due to Government subsidies and grant fiber optic
internet is available in rural America. Like I said we want to earn your business that’s
why there’s free installation and free 30 days of internet service. Like I said a lot of the
neighbors are getting installed *choose a date that you signed up last customer* would
that date work for you?
IF Yes: Then; Put in the order.
IF No: Then; walk away – rejection immunity. Next door up.
`;

export type Playbook = {
  [key: string]: string;
};

export const playbook: Playbook = {	
  card2: `
Shared vs. Dedicated Infrastructure
Spectrum uses shared copper lines that congest during peak hours...
Analogy: garden hose shared by 5 families (cable) vs. your own water main (fiber).
Ask: "Notice slowdowns around dinner time?"`,
  card3: `
Commercial-Grade Equipment Edge
$300+ 802.11ax router included free. Enterprise-grade Wi-Fi, solves dead zones.`,
  card5: `
Infrastructure Age Comparison
Copper = 1960s, weathered, degraded. Fiber = glass, waterproof, connects continents.`,
  card6: `
Military & Government Credibility
Trusted by the U.S. military, federal agencies, hospitals since the 1990s.`,
  card7: `
Live Speed Test Revelation
Run a speed test on their phone. Let numbers create the 'aha' moment.`,
  card8: `
Upload Speed Game-Changer
Cable: 100/10. Fiber: symmetrical. Video calls, gaming, cloud = smooth.`,
  card9: `
Price Lock Guarantee
Spectrum intro rates jump 40–60% after 12 months. Fiber = no surprises.`
};
