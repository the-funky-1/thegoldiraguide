import { extractPlainText, fleschKincaidGrade } from '../src/content/strategic/reading-level';
import { block, callout, faq, h2, p } from '../src/content/strategic/pt';

const text3 = [
  block('intro', p('Gold often gets the most attention from investors. However, silver offers an equally strong way to protect your wealth. Adding silver to your retirement plan gives you safety and high growth potential.')),
  block('intro2', p('Silver works as both a metal for money and a highly used factory asset. It is needed for solar panels, phones, and medical tools. The IRS officially lets you hold physical silver inside a tax-free retirement account.')),
  block('h2-eligible-silver', h2('IRS Rules for Silver')),
  block('eligible-silver', p('The IRS has very strict rules regarding silver. Any silver product you buy must meet a high purity standard of .999 fineness. Thankfully, most common bullion bars easily meet this rule.')),
  block('eligible-silver2', p('You can safely buy popular assets like American Silver Eagles and Canadian Silver Maple Leafs. On the other hand, you are banned from buying old junk silver or rare coins, which will cause large tax fines.')),
  block('danger', callout('danger', 'We highly advise against buying graded coins. Dealers attach huge markups to these products. The IRS totally bans these assets from retirement accounts.')),
  block('h2-storage', h2('Storage Rules')),
  block('storage', p('A Silver IRA works just like a standard Gold IRA. You are legally required to use a certified account custodian. You also must store your physical metals inside an approved vault.')),
  block('storage2', p('You cannot keep IRA silver inside your personal home. Storing these assets in a home safe breaks federal rules. Doing this will result in heavy fines and the sudden loss of your tax benefits.')),
  block('h2-why-silver', h2('Why Choose Silver?')),
  block('why-silver', p('Silver costs much less to buy upfront compared to gold. This lower cost allows regular investors to easily gather large amounts of metal. Also, silver prices often move much faster than gold during big market runs.')),
  block('why-silver2', p('However, you must know that silver carries much higher price swings. Prices can drop fast during times of economic calm. A smart plan is to hold a good mix of both metals, combining steady gold with fast-growing silver.')),
];

const grade3 = fleschKincaidGrade(extractPlainText(text3));
console.log('Test 3 (Silver):', grade3.toFixed(2));

const text4 = [
  block('intro', p('A Roth IRA is an incredibly powerful financial tool for your long-term retirement planning. You contribute after-tax income, but your future capital growth remains totally free from taxation. When you finally reach retirement age, you can take big withdrawals without causing any tax bills.')),
  block('intro2', p('Modern rules allow investors to hold physical gold inside a special Roth IRA. This fresh approach provides you with a great combination of benefits. You acquire the safety of hard assets alongside the massive tax perks tied to a Roth account.')),
  block('h2-how-it-works', h2('How a Roth Gold IRA Works')),
  block('how-it-works', p('Setting up a Roth Gold IRA is a relatively simple paperwork process. You begin by making a self-directed Roth IRA through an approved custodian. Next, you fund the new account using either cash deposits or a rollover from a past Roth plan.')),
  block('how-it-works2', p('Once your starting funds successfully clear, you can select your desired precious metals. Your chosen custodian officially buys the gold for you and safely ships it to a certified vault. You are strictly forbidden from keeping these assets at your own house.')),
  block('h2-traditional-vs-roth', h2('Traditional vs. Roth')),
  block('traditional-vs-roth', p('A Traditional IRA provides an immediate tax break on your current income taxes. You avoid paying taxes on your starting funds, but you will eventually owe income tax when you sell the physical gold later in life.')),
  block('traditional-vs-roth2', p('A Roth IRA works using the exact opposite idea. You receive absolutely no upfront tax break today. However, all future market growth is fully sheltered from taxes. If gold prices surge over the next decade, you retain every single penny of that profit.')),
  block('h2-conversions', h2('Roth Conversions')),
  block('conversions', p('If you currently have a Traditional IRA, you can choose to turn it into a Roth IRA. This money move is called a Roth conversion. You must carefully figure out and pay the required income taxes on the full converted amount during the current year.')),
  block('conversions2', p('Smart investors often do this strategy when current gold prices are temporarily low. They willingly pay the tax burden right away. Then, when the precious metals finally rise in value, all the newly created wealth remains fully protected from future IRS taxes.')),
  block('warning', callout('warning', 'We strongly suggest talking with a trusted tax expert before doing a large Roth conversion. A massive account conversion can easily push you into a much higher tax bracket for the current calendar year.')),
];

const grade4 = fleschKincaidGrade(extractPlainText(text4));
console.log('Test 4 (Roth):', grade4.toFixed(2));
