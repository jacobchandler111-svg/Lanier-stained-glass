// Single source of truth for business info.
// Update phone/email/address here once and re-deploy.

window.LSG_BUSINESS = {
  name: 'Lanier Stained Glass',
  owner: 'Ricky Dorsey',
  verse: 'Proverbs 3:5-6',
  phone: '(678) 776-1325',
  phoneTel: '+16787761325',
  email: 'LanierStainedGlass@gmail.com',
  street: '5221 Palmero Ct',
  city: 'Buford',
  state: 'GA',
  zip: '30518',
  hours: 'By appointment',
  yearsInBusiness: '20+',
  url: 'https://lanierstainedglass.com',
  serviceTagline:
    'Design to Installation \u00b7 Stained Leaded Glass \u00b7 Church Restoration \u00b7 Residential Repair \u00b7 Historic Window Restorations',
  regionalCoverage: 'Across the Southeast for church and historic restoration projects',
  services: [
    { slug: 'custom-design',                 title: 'Custom Design',                 blurb: 'Original commissioned panels, designed with you from sketch to install.' },
    { slug: 'stained-leaded-glass',          title: 'Stained Leaded Glass',          blurb: 'Traditional leaded panels for doors, transoms, and feature windows.' },
    { slug: 'church-restoration',            title: 'Church Restoration',            blurb: 'Restoring sanctuaries across Georgia with period-correct craftsmanship.' },
    { slug: 'residential-repair',            title: 'Residential Repair',            blurb: 'Cracked panels, sagging leading, broken solder \u2014 repaired in our Buford studio.' },
    { slug: 'historic-window-restoration',   title: 'Historic Window Restorations',  blurb: 'Documented, reversible, archival restoration of century-old windows.' },
  ],
  serviceArea: ['Buford', 'Sugar Hill', 'Suwanee', 'Flowery Branch', 'Lawrenceville', 'Atlanta'],
  portfolio: [
    { slug: 'rock-springs-church', title: 'Rock Springs Church',                   city: 'Elberton, GA', year: 2024, blurb: 'Restored the original early-1900s sanctuary windows of this historic Georgia church.' },
    { title: 'Shiloh Baptist Church',                  city: 'Carlton, GA',  year: 2018 },
    { title: 'Greater Liberty Hill Baptist Church',    city: 'Atlanta, GA',  year: 2018 },
    { title: 'Mt. Calvary Baptist Church Lakeside',    city: 'Macon, GA',    year: 2018 },
  ],
  testimonials: [
    { quote: 'The quality of your stained glass windows and doors is 2nd to none, and always such a pleasure to work with you.', author: 'Megan Nunnery McKinnon' },
    { quote: 'A very special thank you to Lanier Stained Glass for their hard work and dedication to their craft. Our windows are beautiful.', author: 'Rock Springs Church' },
    { quote: 'Great local business and beautiful work!', author: 'Elizabeth Carpenter Trenary' },
  ],
};

// Stamp the current year into any element with [data-year].
document.addEventListener('DOMContentLoaded', function () {
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });
});
