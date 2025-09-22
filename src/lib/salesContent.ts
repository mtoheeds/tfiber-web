export type SalesNote = {
  tag?: string;
  region?: string | null;
  title: string;
  body: string;
};

export const salesContent: SalesNote[] = [
  {
    title: "Door Pitch",
    body: `Hi, there! How are you doing?! *pause* Yeah finally the heat has calmed down a bit and corporate sent us door knocking. My name is ____ and I’m here on behalf of T-Fiber. My company just spent around 18 million doing a lot of construction recently, did you happen to see any of it? *pause*
    
IF Yes: Then; Yeah 100% so that was T-Fiber and we were laying out down Fiber optic infrastructure. Are you familiar with fiber optic internet?
IF No: Then; No worries – Are you familiar with fiber optic internet?

*This is fishing* (you are learning about the customer, based on what you find here you will know which levers to pull to close the deal)

IF Yes; then; Perfect as you know Fiber optic is the next generation of internet technology and it has a lot great advancements.
IF No; then; No worries – just to let you know Fiber optic is the next generation of internet technology, and it has a lot of great advancements compared to the old copper based coaxial cables that our competitors use.

I have been talking to a lot of your neighbor like __insert names__ and majority of them are using Spectrum, and Spectrum is one of our competitors that uses the old copper based “shared infrastructure”. Shared infrastructure is kind of like that tree (point at a tree) where there is 1 cable coming into a neighborhood and all the houses are leeching off the same cable. So around 4–6 o’clock when all the neighbors are home and kids are on games, internet slows down because everyone is using the same cable. On top of that those lines have been there for 50+ years, and because copper has metallic properties every time it’s thundering the positive and negative charges react with those lines. Fiber, being glass, doesn’t have that problem.

Talking to neighbors I’ve found 2 main pain points:  
1) Introductory rate trap  
2) Spinning wheel of death while streaming.

I’m assuming you have Spectrum?  
IF Yes: Then; And how much are you paying?  
Find pricing, then: what speeds do you get with that? (take an educated guess to show expertise)

Spectrum typical plans:  
• 100 Mbps: $30 promo → $50–54 regular  
• 500/600 Mbps Ultra: $50 promo → $82–86 regular  
• 1 Gig: $70 promo → $94–114 regular  

Ripple typical plans:  
• 500 Mbps: $50 → $73  
• 1 Gig: $85 flat  
• 2 Gig: $105 flat  

**Trial close**:  
Best part about fiber is that it’s bi-symmetrical (download = upload), and costs less to transmit broadband vs. copper. That means your bill will be lower and your experience on Facebook, Netflix, YouTube will be better.

Neighbors are getting installed on *insert date*. Would that date work for you?

IF Yes: Put in the order.  
IF No: Reassure them: today is just picking an install date, no contracts, free installation + free equipment + 30 days free. After trying it, if you’re not convinced, cancel with no fees.  

Food for thought: For 50 years there was only 1 fiber line in NC—from Fort Bragg to Langley Air Force Base. Military-only tech, now rolled out to homes thanks to subsidies.  

So, would *insert date* work for you?  
IF Yes: Put in the order.  
IF No: Walk away – rejection immunity.`
  },

  {
    title: "Card 2: Shared vs. Dedicated Infrastructure",
    body: `Spectrum cable runs on shared copper lines that get congested during peak hours. Fiber gives each home dedicated bandwidth with consistent speeds.  
Analogy: “Garden hose shared by five families vs. your own water main.”  
Ask: “Notice your internet slows at dinner time?”`
  },

  {
    title: "Card 3: Commercial-Grade Equipment Edge",
    body: `Routers with 802.11ax ($300+ retail) included free. Enterprise-grade Wi-Fi for whole-home coverage.  
Tactics:  
• Position as future-proof: “This is what offices use.”  
• Solve dead zone complaints by highlighting this card.  
• Value stack: “$300 retail router included free.”`
  },

  {
    title: "Card 4: Risk-Free Trial Strategy",
    body: `Remove commitment fear by reframing:  
“Look, you don’t have to marry us on the first date. Try fiber for 30 days – if you don’t love it, kick us out.”  
Position yourself as the underdog: “We’re the new guys, so we’ll prove ourselves.”  
Make ‘No’ harder than ‘Yes’. With zero risk, refusal makes no sense.`
  },

  {
    title: "Card 5: Infrastructure Age Comparison",
    body: `Copper lines: hung on poles since the 1960s. Corroded, storm-damaged, weakened by time. Shared bandwidth = bottlenecks.  
Fiber: glass tubes, immune to water/weather, consistent performance, built to last decades, dedicated bandwidth.  
Killer question: “Would you trust 60-year-old copper beaten by storms, or brand-new fiber reliable enough to connect continents under oceans?”`
  },

  {
    title: "Card 6: Military & Government Credibility",
    body: `Fiber = trusted for mission-critical communications since 1990s.  
• Military: secure, high-speed bases worldwide  
• Government: backbone for air traffic, emergency services  
• Healthcare: life-saving telemedicine, instant patient records  
Pitch: “If the U.S. military has trusted fiber for decades to protect the country, now it’s finally affordable enough for your neighborhood.”`
  },

  {
    title: "Card 7: Live Speed Test Revelation",
    body: `Numbers don’t lie. Run a live speed test on the customer’s phone.  
Act surprised when they’re underperforming: “Wow, you pay for how much and only get this?”  
Then contrast with fiber’s consistent, symmetrical speeds.  
Perfect against: “My internet is fine.”`
  },

  {
    title: "Card 8: Upload Speed Game-Changer",
    body: `Cable = fast downloads, terrible uploads (e.g., 100 Mbps down / 10 Mbps up).  
Fiber = symmetrical (300 down = 300 up).  
Why uploads matter:  
• Zoom/Teams calls  
• Cloud storage backups  
• Online gaming latency  
• Remote work file transfers  
• Live streaming / video uploads  
Opener: “Ever freeze on video calls while others look fine? That’s your upload speed failing you.”`
  },

  {
    title: "Card 9: Price Lock Guarantee",
    body: `Spectrum trap: promo rate for 12 months, then 40–60% hikes.  
Fiber promise: no intro rates, no surprises. Transparent, locked pricing.  
Position this strongly with cost-conscious customers.`
  }
];
// --- Convenience named exports for existing imports ---
export const pitch =
  salesContent.find(n => n.title.toLowerCase().includes("door pitch"))?.body ??
  (salesContent[0]?.body ?? "");

export const playbook = salesContent.filter(
  n => !n.title.toLowerCase().includes("door pitch")
);
