import logo from '../assets/logo.png';
import formalImage from '../assets/FORMAL.png';
import w1 from '../assets/w1.jpg';
import w2 from '../assets/w2.jpg';
import w3 from '../assets/w3 (2).jpg';
import w4 from '../assets/w4 (2).jpg';
import w5 from '../assets/w5.jpg';
import w6 from '../assets/w6.jpg';
import w7 from '../assets/w7.jpg';
import w8 from '../assets/w8.jpg';

export const defaultSiteContent = {
  brand: {
    siteName: 'Matoma',
    logo,
  },
  home: {
    title: '\u098f\u0995 \u09ab\u09cb\u0981\u099f\u09be \u09b0\u0995\u09cd\u09a4 \u09a6\u09be\u09a8\u09c7, \u099c\u09be\u0997\u09c7 \u099c\u09c0\u09ac\u09a8\u09c7\u09b0 \u0997\u09be\u09a8,',
    subtitle: '\u09ae\u09be\u09a8\u09ac\u09a4\u09be\u09b0 \u09b8\u09c7\u09ac\u09be\u09df \u09b9\u09cb\u0995 \u09b8\u09ac\u09be\u09b0 \u0986\u09b9\u09cd\u09ac\u09be\u09a8',
    poem:
      '\u0997\u09be\u09b9\u09bf \u09b8\u09be\u09ae\u09cd\u09af\u09c7\u09b0 \u0997\u09be\u09a8-\n\u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u099a\u09c7\u09af\u09bc\u09c7 \u09ac\u09a1\u09bc \u0995\u09bf\u099b\u09c1 \u09a8\u09be\u0987, \u09a8\u09b9\u09c7 \u0995\u09bf\u099b\u09c1 \u09ae\u09b9\u09c0\u09af\u09bc\u09be\u09a8!\n\u09a8\u09be\u0987 \u09a6\u09c7\u09b6-\u0995\u09be\u09b2-\u09aa\u09be\u09a4\u09cd\u09b0\u09c7\u09b0 \u09ad\u09c7\u09a6, \u0985\u09ad\u09c7\u09a6 \u09a7\u09b0\u09cd\u09ae \u099c\u09be\u09a4\u09bf,\n\u09b8\u09ac \u09a6\u09c7\u09b6\u09c7, \u09b8\u09ac \u0995\u09be\u09b2\u09c7, \u0998\u09b0\u09c7 \u0998\u09b0\u09c7 \u09a4\u09bf\u09a8\u09bf \u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u099c\u09cd\u099e\u09be\u09a4\u09bf\u0964',
  },
  donor: {
    title: 'Find Donor',
    subtitle: 'Search by blood group and location to find an available donor quickly.',
    buttonLabel: 'Find Donor',
  },
  about: {
    title: 'About Us',
    subtitle: '\u09ae\u09be\u09a8\u09c1\u09b7 \u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u099c\u09a8\u09cd\u09af, \u099c\u09c0\u09ac\u09a8 \u099c\u09c0\u09ac\u09a8\u09c7\u09b0 \u099c\u09a8\u09cd\u09af',
    description:
      '\u0986\u09ae\u09b0\u09be \u09ae\u09be\u09a8\u09ac \u09b8\u09c7\u09ac\u09be\u09df \u0995\u09be\u099c \u0995\u09b0\u09bf, \u0986\u09ae\u09b0\u09be \u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u0995\u09be\u099c \u0995\u09b0\u09bf, \u0986\u09ae\u09b0\u09be \u098f\u0987 \u0995\u09be\u099c\u0995\u09c7 \u09ad\u09be\u09b2\u09cb\u09ac\u09be\u09b8\u09bf\u0964 \u09b0\u0995\u09cd\u09a4 \u09a6\u09be\u09a8,\n\u09aa\u09a5-\u09b6\u09bf\u09b6\u09c1\u09a6\u09c7\u09b0 \u09aa\u09be\u09a0\u09a6\u09be\u09a8, \u0985\u09b8\u09b9\u09be\u09af\u09bc \u09ae\u09be\u09a8\u09c1\u09b7\u09a6\u09c7\u09b0 \u09b8\u09be\u09b9\u09be\u09af\u09cd\u09af, \u09a4\u09c3\u09a4\u09c0\u09af\u09bc \u09b2\u09bf\u0999\u09cd\u0997\u09c7\u09b0 \u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u09b8\u09be\u09b9\u09be\u09af\u09cd\u09af, \u09a4\u09cd\u09b0\u09bf\u09b6 \u09b0\u09cb\u099c\u09be\u09af\u09bc \u09aa\u09a5\u099a\u09be\u09b0\u09c0\u09a6\u09c7\u09b0\n\u0987\u09ab\u09a4\u09be\u09b0 \u0995\u09b0\u09be\u09a8\u09cb \u09b8\u09b9 \u09a8\u09be\u09a8\u09be \u09b8\u09be\u09ae\u09be\u099c\u09bf\u0995 \u0995\u09be\u099c\u09c7 \u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u098f\u0987 \u09b8\u0982\u0997\u09a0\u09a8 \u09a8\u09bf\u09af\u09bc\u09cb\u099c\u09bf\u09a4',
    quote:
      '\u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u09aa\u09be\u09b6\u09c7 \u09a6\u09be\u0981\u09dc\u09be\u09a8\u09cb\u0987 \u09b8\u09ac\u099a\u09c7\u09df\u09c7 \u09ac\u09dc \u09a7\u09b0\u09cd\u09ae, \u0986\u09b0 \u09ae\u09be\u09a8\u09ac\u09a4\u09be\u0987 \u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u09aa\u09cd\u09b0\u0995\u09c3\u09a4 \u09aa\u09b0\u09bf\u099a\u09df\u0964',
    developerName: 'Nazmul Islam',
    developerImage: formalImage,
    galleryImages: [w1, w2, w3, w4, w5, w6, w7, w8],
  },
  contact: {
    title: 'Contact',
    subtitle: 'Contact us directly through the information below.',
    description: 'We are here to answer questions, coordinate support, and stay connected with our community.',
    items: [
      {
        type: 'phone',
        title: 'Phone',
        value: '01323362752',
        description: 'Call us for any urgent need or support request.',
        href: 'tel:01323362752',
      },
      {
        type: 'email',
        title: 'Email',
        value: 'manobota@gmail.com',
        description: 'Send us an email and we will get back to you soon.',
        href: 'mailto:manobota@gmail.com',
      },
      {
        type: 'address',
        title: 'Address',
        value: 'Serving communities across Bangladesh',
        description: 'Our work reaches people through ongoing community support activities.',
        href: '',
      },
    ],
  },
  footer: {
    badge: 'Footer',
    description:
      'We work to connect donors, support people in need, and strengthen community care through simple and accessible communication.',
    socialTitle: 'Get In Touch',
    socialItems: [
      {
        type: 'facebook',
        label: 'Facebook',
        value: 'Matoma Facebook Group',
        href: 'https://www.facebook.com/groups/206655876614747',
      },
      {
        type: 'gmail',
        label: 'Gmail',
        value: 'manobota@gmail.com',
        href: 'mailto:manobota@gmail.com',
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '+880 1323-362752',
        href: 'https://wa.me/8801323362752',
      },
    ],
    developerPrefix: 'Designed and developed by',
    developerName: 'Nazmul Mazumdar',
    developerLink: 'https://www.facebook.com/nazmul.mazumdar.2025',
    year: '2026',
  },
};

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export const mergeSiteContent = (baseValue, incomingValue) => {
  if (Array.isArray(baseValue)) {
    if (!Array.isArray(incomingValue)) {
      return baseValue;
    }

    return incomingValue.map((item, index) => {
      if (index >= baseValue.length) {
        return item;
      }

      return mergeSiteContent(baseValue[index], item);
    });
  }

  if (isPlainObject(baseValue)) {
    const nextValue = isPlainObject(incomingValue) ? incomingValue : {};
    const result = {};
    const keys = new Set([...Object.keys(baseValue), ...Object.keys(nextValue)]);

    keys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(nextValue, key)) {
        result[key] = baseValue[key];
        return;
      }

      result[key] = mergeSiteContent(baseValue[key], nextValue[key]);
    });

    return result;
  }

  return typeof incomingValue === 'undefined' ? baseValue : incomingValue;
};

export const createSiteContentDraft = (content = defaultSiteContent) =>
  JSON.parse(JSON.stringify(content));
