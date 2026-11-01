// Page de redirection des liens puz-app.com (/get, /e/<code>, /u/<pseudo>).
// Si Puz est installé, iOS et Android ouvrent l'app directement et cette page ne s'affiche pas.
// Sinon : on envoie vers l'App Store (iPhone) ou Google Play (Android) ; sur ordinateur, on montre les deux.
(function () {
  var STORES = {
    ios: 'https://apps.apple.com/app/id6824273629',
    android: 'https://play.google.com/store/apps/details?id=com.puzapp.puz',
  };

  var T = {
    fr: {
      get: 'Puz, l\'app des fans de puzzles',
      event: 'Un événement de puzzle t\'attend sur Puz',
      eventCode: 'Code de l\'événement : ',
      profile: ' t\'invite sur Puz',
      sub: 'Collection, chronos, classements, échanges entre amis et concours.',
      redirect: 'Redirection vers le store…',
      appStore: 'Télécharger sur l\'App Store',
      play: 'Disponible sur Google Play',
      open: 'Déjà installé ? Ouvrir dans Puz',
      notFound: 'Cette page n\'existe pas.',
      home: 'Accueil',
    },
    en: {
      get: 'Puz, the app for puzzle lovers',
      event: 'A puzzle event is waiting for you on Puz',
      eventCode: 'Event code: ',
      profile: ' invites you to Puz',
      sub: 'Collection, times, rankings, swaps with friends and contests.',
      redirect: 'Taking you to the store…',
      appStore: 'Download on the App Store',
      play: 'Get it on Google Play',
      open: 'Already installed? Open in Puz',
      notFound: 'This page does not exist.',
      home: 'Home',
    },
    es: {
      get: 'Puz, la app de los fans de los puzles',
      event: 'Un evento de puzles te espera en Puz',
      eventCode: 'Código del evento: ',
      profile: ' te invita a Puz',
      sub: 'Colección, tiempos, clasificaciones, intercambios entre amigos y concursos.',
      redirect: 'Redirigiendo a la tienda…',
      appStore: 'Descargar en el App Store',
      play: 'Disponible en Google Play',
      open: '¿Ya la tienes? Abrir en Puz',
      notFound: 'Esta página no existe.',
      home: 'Inicio',
    },
    pt: {
      get: 'Puz, a app dos fãs de puzzles',
      event: 'Um evento de puzzles espera por ti no Puz',
      eventCode: 'Código do evento: ',
      profile: ' convida-te para o Puz',
      sub: 'Coleção, tempos, classificações, trocas entre amigos e concursos.',
      redirect: 'A abrir a loja…',
      appStore: 'Descarregar na App Store',
      play: 'Disponível no Google Play',
      open: 'Já tens a app? Abrir no Puz',
      notFound: 'Esta página não existe.',
      home: 'Início',
    },
  };

  var lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  var t = T[lang] || T.en;
  document.documentElement.lang = T[lang] ? lang : 'en';

  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
  var isAndroid = /Android/i.test(ua);

  // Quel lien ? /get, /e/<code>, /u/<pseudo>
  var path = location.pathname.replace(/\/+$/, '');
  var m;
  var kind = 'unknown';
  var value = '';
  var appPath = '';
  if (path === '' || path === '/get' || path === '/index.html') {
    kind = 'get';
    appPath = 'get';
  } else if ((m = path.match(/^\/e\/([^/]+)$/))) {
    kind = 'event';
    value = decodeURIComponent(m[1]).toUpperCase();
    appPath = 'e/' + encodeURIComponent(value);
  } else if ((m = path.match(/^\/u\/([^/]+)$/))) {
    kind = 'profile';
    value = decodeURIComponent(m[1]);
    appPath = 'u/' + encodeURIComponent(value);
  }

  // Promotion de Merge 3D (pas encore sorti : « Bientôt disponible »).
  // 👉 À la sortie, remplir ces liens (et les mêmes dans src/lib/crossPromo.ts de l'app).
  var MERGE3D = { ios: '', android: '' };
  var PROMO = {
    fr: { pitch: 'Notre prochain jeu de réflexion, en 3D.', soon: 'Bientôt', get: 'Découvrir' },
    en: { pitch: 'Our next puzzle game, in 3D.', soon: 'Soon', get: 'Discover' },
    es: { pitch: 'Nuestro próximo juego de lógica, en 3D.', soon: 'Pronto', get: 'Descubrir' },
    pt: { pitch: 'O nosso próximo jogo de lógica, em 3D.', soon: 'Em breve', get: 'Descobrir' },
  };
  var promo = document.getElementById('promo');
  if (promo) {
    var pl = PROMO[lang] || PROMO.en;
    var uaP = navigator.userAgent || '';
    var mergeUrl = /Android/i.test(uaP) ? MERGE3D.android : MERGE3D.ios || MERGE3D.android;
    document.getElementById('promo-pitch').textContent = pl.pitch;
    document.getElementById('promo-soon').textContent = mergeUrl ? pl.get : pl.soon;
    if (mergeUrl) promo.href = mergeUrl;
    else promo.addEventListener('click', function (e) { e.preventDefault(); });
  }

  // Lien vers les conditions légales, dans la langue du visiteur.
  var LEGAL = { fr: 'Confidentialité et conditions', en: 'Privacy & terms', es: 'Privacidad y condiciones', pt: 'Privacidade e termos' };
  var legalLang = T[lang] ? lang : 'en';
  var legalLink = document.getElementById('legal');
  if (legalLink) {
    legalLink.href = '/' + legalLang + '/';
    legalLink.textContent = LEGAL[legalLang];
  }

  function el(id) {
    return document.getElementById(id);
  }
  function text(id, s) {
    el(id).textContent = s;
  }

  if (kind === 'unknown') {
    text('title', t.notFound);
    el('sub').style.display = 'none';
    el('stores').style.display = 'none';
    el('open').textContent = t.home;
    el('open').href = '/';
    return;
  }

  text('title', kind === 'event' ? t.event : kind === 'profile' ? value + t.profile : t.get);
  if (kind === 'event') {
    text('detail', t.eventCode + value);
    el('detail').style.display = 'block';
  }
  text('sub', t.sub);

  var ios = el('ios');
  var android = el('android');
  ios.href = STORES.ios;
  android.href = STORES.android;
  ios.textContent = t.appStore;
  android.textContent = t.play;
  // Sur téléphone, seul le bon store est proposé.
  if (isIOS) android.style.display = 'none';
  if (isAndroid) ios.style.display = 'none';

  // « Déjà installé ? » : ouvre l'app par son adresse puzapp://
  el('open').textContent = t.open;
  el('open').href = 'puzapp://' + appPath;

  // Sur téléphone : direction le store (une seule fois, pour ne pas boucler avec le bouton Retour).
  var key = 'puz.redirected.' + path;
  var already = false;
  try {
    already = sessionStorage.getItem(key) === '1';
    sessionStorage.setItem(key, '1');
  } catch (e) {}
  var noRedirect = document.body.getAttribute('data-noredirect') === '1'; // page d'accueil
  if ((isIOS || isAndroid) && !already && !noRedirect) {
    text('redirect', t.redirect);
    el('redirect').style.display = 'block';
    setTimeout(function () {
      location.href = isIOS ? STORES.ios : STORES.android;
    }, 1200);
  }
})();
